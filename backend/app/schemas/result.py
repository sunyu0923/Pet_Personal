from pydantic import BaseModel
from typing import Optional
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
    answers: dict[str, str]


class ResultResponse(BaseModel):
    share_id: str
    pet_type: str
    type_code: str
    personality: PersonalityTypeOut
    scores: Optional[ResultScores] = None
    type_scores: Optional[dict[str, int]] = None
