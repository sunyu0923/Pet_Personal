from pydantic import BaseModel
from app.schemas.personality_type import PersonalityTypeOut


class DimensionScore(BaseModel):
    value: int
    pct: int
    dominant: str


class ResultScores(BaseModel):
    ei: DimensionScore
    sn: DimensionScore
    tf: DimensionScore
    jp: DimensionScore


class SubmitAnswersRequest(BaseModel):
    pet_type: str
    answers: dict[str, str]  # question id (str) -> "a" or "b"


class ResultResponse(BaseModel):
    share_id: str
    pet_type: str
    mbti_code: str
    personality: PersonalityTypeOut
    scores: ResultScores
