from typing import Any
from app.models.question import Question


def score_answers(questions: list[Any], answers: dict[str, str]) -> dict:
    scores: dict[str, int] = {"E/I": 0, "S/N": 0, "T/F": 0, "J/P": 0}

    for q in questions:
        answer = answers.get(str(q.id))
        if answer == "a":
            scores[q.dimension] += 1
        elif answer == "b":
            scores[q.dimension] -= 1

    ei, sn, tf, jp = scores["E/I"], scores["S/N"], scores["T/F"], scores["J/P"]

    mbti_code = (
        ("E" if ei >= 0 else "I")
        + ("S" if sn >= 0 else "N")
        + ("T" if tf >= 0 else "F")
        + ("J" if jp >= 0 else "P")
    )

    def to_pct(raw: int) -> int:
        return round(((raw + 3) / 6) * 100)

    return {
        "mbti_code": mbti_code,
        "score_ei": ei,
        "score_sn": sn,
        "score_tf": tf,
        "score_jp": jp,
        "pct_ei": to_pct(ei),
        "pct_sn": to_pct(sn),
        "pct_tf": to_pct(tf),
        "pct_jp": to_pct(jp),
    }
