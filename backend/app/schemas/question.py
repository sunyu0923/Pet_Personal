from pydantic import BaseModel


class QuestionOut(BaseModel):
    id: int
    dimension: str
    order_num: int
    text: str
    option_a: str
    option_b: str

    model_config = {"from_attributes": True}


class QuestionsResponse(BaseModel):
    pet_type: str
    questions: list[QuestionOut]
