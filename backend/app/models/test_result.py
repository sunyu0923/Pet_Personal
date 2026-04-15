from sqlalchemy import Column, Integer, String, JSON, DateTime, Index, func
from app.database import Base


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True)
    share_id = Column(String(8), nullable=False, unique=True)
    pet_type = Column(String(3), nullable=False)
    type_code = Column(String(10), nullable=False)
    score_ei = Column(Integer, nullable=True)
    score_sn = Column(Integer, nullable=True)
    score_tf = Column(Integer, nullable=True)
    score_jp = Column(Integer, nullable=True)
    pct_ei = Column(Integer, nullable=True)
    pct_sn = Column(Integer, nullable=True)
    pct_tf = Column(Integer, nullable=True)
    pct_jp = Column(Integer, nullable=True)
    type_scores = Column(JSON, nullable=True)
    answers = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_test_results_share_id", "share_id"),
        Index("ix_test_results_created_at", "created_at"),
    )
