import re
from collections import Counter

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "been", "by", "for", "from",
    "has", "have", "in", "is", "it", "of", "on", "or", "that", "the", "their",
    "these", "this", "to", "was", "were", "will", "with", "we", "our", "using",
}


def extractive_summary(text: str, max_sentences: int = 3) -> str:
    """Return a deterministic extractive summary without sending text off-device."""
    normalized = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r"(?<=[.!?])\s+", normalized)
    if len(sentences) <= max_sentences:
        return normalized

    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ\u0600-\u06FF]{3,}", normalized.lower())
    frequencies = Counter(word for word in words if word not in STOPWORDS)
    if not frequencies:
        return " ".join(sentences[:max_sentences])

    scored: list[tuple[float, int, str]] = []
    for index, sentence in enumerate(sentences):
        sentence_words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ\u0600-\u06FF]{3,}", sentence.lower())
        score = sum(frequencies[word] for word in sentence_words) / max(len(sentence_words), 1)
        position_bonus = 1.15 if index in (0, len(sentences) - 1) else 1.0
        scored.append((score * position_bonus, index, sentence))

    selected = sorted(sorted(scored, reverse=True)[:max_sentences], key=lambda item: item[1])
    return " ".join(item[2] for item in selected)
