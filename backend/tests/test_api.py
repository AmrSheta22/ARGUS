from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json()["status"] == "ok"


def test_content_endpoints() -> None:
    assert len(client.get("/api/videos").json()) >= 3
    assert client.get("/api/knowledge").status_code == 200
    assert client.get("/api/papers").status_code == 200


def test_summarize() -> None:
    text = " ".join([
        "Machine learning systems often perform well on familiar data.",
        "Performance can fall sharply when the deployment domain changes.",
        "This study evaluates robust training methods across several datasets.",
        "The experiments compare accuracy, calibration, and computational cost.",
        "Results show that targeted augmentation improves stability under shift.",
    ])
    response = client.post("/api/summarize", json={"text": text, "max_sentences": 2})
    assert response.status_code == 200
    assert response.json()["summary_words"] < response.json()["original_words"]
