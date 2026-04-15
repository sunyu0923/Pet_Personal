from collections import Counter
from typing import Any


def _find_option_tags(question: Any, answer_key: str) -> list[str]:
    for option in question.options:
        if option["key"] == answer_key:
            return option.get("tags", [])
    return []


def score_dog_answers(questions: list[Any], answers: dict[str, str]) -> dict:
    counts: Counter[str] = Counter()

    for question in questions:
        answer_key = answers.get(str(question.id))
        for tag in _find_option_tags(question, answer_key):
            counts[tag] += 1

    score_ei = counts["E"] - counts["I"]
    score_sn = counts["S"] - counts["N"]
    score_tf = counts["T"] - counts["F"]
    score_jp = counts["J"] - counts["P"]

    max_per_dimension = 8

    def to_pct(positive: str, negative: str) -> int:
        positive_count = counts[positive]
        negative_count = counts[negative]
        total = positive_count + negative_count
        if total == 0:
            return 50
        return round((positive_count / max(total, max_per_dimension)) * 100)

    type_code = (
        ("E" if score_ei >= 0 else "I")
        + ("S" if score_sn >= 0 else "N")
        + ("F" if score_tf <= 0 else "T")
        + ("P" if score_jp <= 0 else "J")
    )

    return {
        "type_code": type_code,
        "score_ei": score_ei,
        "score_sn": score_sn,
        "score_tf": score_tf,
        "score_jp": score_jp,
        "pct_ei": to_pct("E", "I"),
        "pct_sn": to_pct("S", "N"),
        "pct_tf": to_pct("T", "F"),
        "pct_jp": to_pct("J", "P"),
        "type_scores": None,
    }


def score_cat_answers(questions: list[Any], answers: dict[str, str]) -> dict:
    counts: Counter[str] = Counter()

    for question in questions:
        answer_key = answers.get(str(question.id))
        for tag in _find_option_tags(question, answer_key):
            counts[tag] += 1

    if counts["F"] >= 2:
        type_code = "F"
    elif counts["D"] >= 4:
        type_code = "D"
    elif counts["H"] >= 4 and counts["D"] <= 2:
        type_code = "H"
    else:
        ranked = sorted(counts.items(), key=lambda item: item[1], reverse=True)
        max_score = ranked[0][1] if ranked else 0
        second_score = ranked[1][1] if len(ranked) > 1 else 0
        if max_score <= 3 and second_score <= 2:
            type_code = "I"
        else:
            priority = {"E": 0, "A": 1, "D": 2, "B": 3, "F": 4, "C": 5, "H": 6, "G": 7}
            ranked_codes = sorted(counts.keys(), key=lambda code: (-counts[code], priority.get(code, 999)))
            type_code = ranked_codes[0] if ranked_codes else "I"

    return {
        "type_code": type_code,
        "score_ei": None,
        "score_sn": None,
        "score_tf": None,
        "score_jp": None,
        "pct_ei": None,
        "pct_sn": None,
        "pct_tf": None,
        "pct_jp": None,
        "type_scores": dict(counts),
    }
