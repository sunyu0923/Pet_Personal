from sqlalchemy import Column, Integer, String, Text, JSON, UniqueConstraint
from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    pet_type = Column(String(3), nullable=False)
    order_num = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)

    __table_args__ = (
        UniqueConstraint("pet_type", "order_num", name="uq_question_v2"),
    )
