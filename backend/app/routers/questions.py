from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import asc

from app.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionsResponse, QuestionOut

router = APIRouter()

DIMENSION_ORDER = {"E/I": 1, "S/N": 2, "T/F": 3, "J/P": 4}


@router.get("/questions/{pet_type}", response_model=QuestionsResponse)
def get_questions(pet_type: str, db: Session = Depends(get_db)):
    if pet_type not in ("cat", "dog"):
        raise HTTPException(status_code=400, detail="pet_type must be 'cat' or 'dog'")

    questions = (
        db.query(Question)
        .filter(Question.pet_type == pet_type)
        .order_by(Question.dimension, asc(Question.order_num))
        .all()
    )

    # Sort by dimension order then order_num
    questions.sort(key=lambda q: (DIMENSION_ORDER[q.dimension], q.order_num))

    return QuestionsResponse(
        pet_type=pet_type,
        questions=[QuestionOut.model_validate(q) for q in questions],
    )
