from sqlalchemy import Column, Integer, String, Text, ARRAY, UniqueConstraint
from app.database import Base


class PersonalityType(Base):
    __tablename__ = "personality_types"

    id = Column(Integer, primary_key=True)
    pet_type = Column(String(3), nullable=False)
    mbti_code = Column(String(4), nullable=False)
    name = Column(String(100), nullable=False)
    tagline = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    strengths = Column(ARRAY(Text), nullable=False)
    weaknesses = Column(ARRAY(Text), nullable=False)
    emoji = Column(String(10), nullable=False)

    __table_args__ = (
        UniqueConstraint("pet_type", "mbti_code", name="uq_personality_type"),
    )
