from app.database import SessionLocal
from app.models.question import Question
from app.models.personality_type import PersonalityType
from app.seed.questions import QUESTIONS
from app.seed.personality_types import PERSONALITY_TYPES


def seed_questions(db):
    for pet_type, questions in QUESTIONS.items():
        for q in questions:
            existing = db.query(Question).filter(
                Question.pet_type == pet_type,
                Question.order_num == q["order_num"],
            ).first()
            if existing:
                existing.text = q["text"]
                existing.options = q["options"]
            else:
                db.add(Question(pet_type=pet_type, **q))
    db.commit()
    print("Questions seeded.")


def seed_personality_types(db):
    for pet_type, types in PERSONALITY_TYPES.items():
        for t in types:
            existing = db.query(PersonalityType).filter(
                PersonalityType.pet_type == pet_type,
                PersonalityType.type_code == t["type_code"],
            ).first()
            if existing:
                for k, v in t.items():
                    setattr(existing, k, v)
            else:
                db.add(PersonalityType(pet_type=pet_type, **t))
    db.commit()
    print("Personality types seeded.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_questions(db)
        seed_personality_types(db)
        print("Seed complete.")
    finally:
        db.close()
