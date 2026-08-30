import os
import sqlite3
from contextlib import closing
from pathlib import Path

from .schemas import ContentCreate

DATABASE_PATH = Path(os.getenv("ARGUS_DB_PATH", Path(__file__).resolve().parent.parent / "data" / "argus.db"))
SECTIONS = {"videos", "summaries", "knowledge", "work"}

SEEDS = [
    (1, "videos", "But what is a neural network?", "3Blue1Brown · 19 min", "A visual, intuition-first introduction to neural networks and gradient descent.", "https://www.youtube.com/watch?v=aircAruvnKk", "Deep Learning,Foundations", 1, 10),
    (2, "summaries", "Attention Is All You Need", "Vaswani et al. · Example summary", "The paper introduces the Transformer: an architecture based entirely on attention, removing recurrence and convolution while improving parallelism and translation quality.", "https://arxiv.org/abs/1706.03762", "NLP,Transformers,Seminal Paper", 1, 10),
    (3, "knowledge", "Machine Learning Foundations", "A guided learning path", "Begin with supervised learning, evaluation, and generalization before moving into neural networks and specialized architectures.", "https://developers.google.com/machine-learning/crash-course", "Artificial Intelligence,Machine Learning,Beginner", 1, 10),
    (4, "work", "Robust Arabic misinformation detection under domain shift", "ARGUS NLP Group · 2026 · Under review", "A research direction studying robust misinformation detection when Arabic language models encounter new domains and dialects.", "", "Natural Language Processing,Responsible AI", 1, 10),
]


def connect() -> sqlite3.Connection:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with closing(connect()) as connection:
        connection.execute("""CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT NOT NULL CHECK(section IN ('videos','summaries','knowledge','work')), title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', description TEXT NOT NULL, url TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '', published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)""")
        connection.execute("""CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)""")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_content_section_published ON content(section, published, sort_order)")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_messages_created_at ON contact_messages(created_at)")
        connection.executemany("INSERT OR IGNORE INTO content (id, section, title, subtitle, description, url, tags, published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", SEEDS)
        connection.execute("PRAGMA optimize")
        connection.commit()


def list_content(section: str | None = None, include_drafts: bool = False) -> list[dict]:
    clauses, params = [], []
    if section:
        clauses.append("section = ?")
        params.append(section)
    if not include_drafts:
        clauses.append("published = 1")
    where = f" WHERE {' AND '.join(clauses)}" if clauses else ""
    with closing(connect()) as connection:
        rows = connection.execute(f"SELECT id, section, title, subtitle, description, url, tags, published, sort_order FROM content{where} ORDER BY sort_order DESC, id DESC", params).fetchall()
    return [{**dict(row), "published": bool(row["published"])} for row in rows]


def create_content(payload: ContentCreate) -> int:
    if payload.section not in SECTIONS:
        raise ValueError("Invalid section")
    with closing(connect()) as connection:
        cursor = connection.execute("INSERT INTO content (section, title, subtitle, description, url, tags, published, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (payload.section, payload.title, payload.subtitle, payload.description, payload.url, payload.tags, int(payload.published), payload.sort_order))
        connection.commit()
        return int(cursor.lastrowid)


def delete_content(content_id: int) -> None:
    with closing(connect()) as connection:
        connection.execute("DELETE FROM content WHERE id = ?", (content_id,))
        connection.commit()


def save_message(name: str, email: str, subject: str, message: str) -> None:
    with closing(connect()) as connection:
        connection.execute("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)", (name, email, subject, message))
        connection.commit()
