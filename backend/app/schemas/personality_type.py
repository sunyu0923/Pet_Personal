from pydantic import BaseModel
from typing import Optional


class PersonalityTypeOut(BaseModel):
    name: str
    english_name: Optional[str] = None
    common_breed: Optional[str] = None
    tagline: str
    description: Optional[str] = None
    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    life_tips: Optional[str] = None
    training_tips: Optional[str] = None
    emoji: str

    model_config = {"from_attributes": True}
