from sqlalchemy import Column, Integer, String, Text, ARRAY, UniqueConstraint
from app.database import Base


class PersonalityType(Base):
    __tablename__ = "personality_types"

    id = Column(Integer, primary_key=True)
    pet_type = Column(String(3), nullable=False)
    type_code = Column(String(10), nullable=False)
    name = Column(String(100), nullable=False)
    english_name = Column(String(100), nullable=True)
    common_breed = Column(String(100), nullable=True)
    tagline = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    strengths = Column(ARRAY(Text), nullable=True)
    weaknesses = Column(ARRAY(Text), nullable=True)
    life_tips = Column(Text, nullable=True)
    training_tips = Column(Text, nullable=True)
    emoji = Column(String(10), nullable=False)

    __table_args__ = (
        UniqueConstraint("pet_type", "type_code", name="uq_personality_type_v2"),
    )
