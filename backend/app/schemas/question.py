from pydantic import BaseModel


class OptionOut(BaseModel):
    key: str
    text: str


class QuestionOut(BaseModel):
    id: int
    order_num: int
    text: str
    options: list[OptionOut]

    model_config = {"from_attributes": True}


class QuestionsResponse(BaseModel):
    pet_type: str
    questions: list[QuestionOut]
