from pydantic import BaseModel


class PersonalityTypeOut(BaseModel):
    name: str
    tagline: str
    description: str
    strengths: list[str]
    weaknesses: list[str]
    emoji: str

    model_config = {"from_attributes": True}
