from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from nanoid import generate

from app.database import get_db
from app.models.question import Question
from app.models.personality_type import PersonalityType
from app.models.test_result import TestResult
from app.schemas.result import SubmitAnswersRequest, ResultResponse, ResultScores, DimensionScore
from app.schemas.personality_type import PersonalityTypeOut
from app.services.scoring import score_cat_answers, score_dog_answers

router = APIRouter()


def _build_response(result: TestResult, personality: PersonalityType) -> ResultResponse:
    def dim_score(value: int, pct: int, pos_letter: str, neg_letter: str) -> DimensionScore:
        return DimensionScore(value=value, pct=pct, dominant=pos_letter if value >= 0 else neg_letter)

    scores = None
    if result.score_ei is not None:
        scores = ResultScores(
            ei=dim_score(result.score_ei, result.pct_ei, "E", "I"),
            sn=dim_score(result.score_sn, result.pct_sn, "S", "N"),
            tf=dim_score(result.score_tf, result.pct_tf, "T", "F"),
            jp=dim_score(result.score_jp, result.pct_jp, "J", "P"),
        )

    return ResultResponse(
        share_id=result.share_id,
        pet_type=result.pet_type,
        type_code=result.type_code,
        personality=PersonalityTypeOut.model_validate(personality),
        scores=scores,
        type_scores=result.type_scores,
    )


@router.post("/results", response_model=ResultResponse, status_code=201)
def submit_results(body: SubmitAnswersRequest, db: Session = Depends(get_db)):
    if body.pet_type not in ("cat", "dog"):
        raise HTTPException(status_code=400, detail="pet_type must be 'cat' or 'dog'")

    try:
        question_ids = [int(k) for k in body.answers.keys()]
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Answer keys must be question ids") from exc

    questions = db.query(Question).filter(
        Question.id.in_(question_ids),
        Question.pet_type == body.pet_type,
    ).all()

    expected_answers = 16 if body.pet_type == "dog" else 12
    if len(questions) != expected_answers or len(body.answers) != expected_answers:
        raise HTTPException(
            status_code=400,
            detail=f"Must submit exactly {expected_answers} answers for the correct pet type",
        )

    if body.pet_type == "dog":
        scored = score_dog_answers(questions, body.answers)
    else:
        scored = score_cat_answers(questions, body.answers)

    personality = db.query(PersonalityType).filter(
        PersonalityType.pet_type == body.pet_type,
        PersonalityType.type_code == scored["type_code"],
    ).first()

    if not personality:
        raise HTTPException(status_code=500, detail="Personality type not found")

    share_id = generate(size=8)
    result = TestResult(
        share_id=share_id,
        pet_type=body.pet_type,
        type_code=scored["type_code"],
        score_ei=scored["score_ei"],
        score_sn=scored["score_sn"],
        score_tf=scored["score_tf"],
        score_jp=scored["score_jp"],
        pct_ei=scored["pct_ei"],
        pct_sn=scored["pct_sn"],
        pct_tf=scored["pct_tf"],
        pct_jp=scored["pct_jp"],
        type_scores=scored["type_scores"],
        answers=body.answers,
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return _build_response(result, personality)


@router.get("/results/{share_id}", response_model=ResultResponse)
def get_result(share_id: str, db: Session = Depends(get_db)):
    result = db.query(TestResult).filter(TestResult.share_id == share_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    personality = db.query(PersonalityType).filter(
        PersonalityType.pet_type == result.pet_type,
        PersonalityType.type_code == result.type_code,
    ).first()

    return _build_response(result, personality)
