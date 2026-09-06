import os

from fastapi.testclient import TestClient

os.environ["ARGUS_ADMIN_TOKEN"] = "test-admin-token"

from app.main import app

client = TestClient(app)
ADMIN_HEADERS = {"Authorization": "Bearer test-admin-token"}


def test_health() -> None:
    assert client.get("/health").json()["status"] == "ok"


def test_content_endpoints() -> None:
    assert len(client.get("/api/videos").json()) >= 3
    assert client.get("/api/knowledge").status_code == 200
    assert client.get("/api/papers").status_code == 200
    response = client.get("/api/content", params={"section": "videos"})
    assert response.status_code == 200
    assert response.json()[0]["created_at"]


def test_admin_content_lifecycle() -> None:
    payload = {
        "section": "work",
        "title": "Test research record",
        "subtitle": "ARGUS test suite",
        "description": "A temporary record used to verify the administrative content lifecycle.",
        "url": "",
        "tags": "Testing",
        "published": False,
        "sort_order": -100,
    }

    unauthorized = client.post("/api/admin/content", json=payload)
    assert unauthorized.status_code == 403

    created = client.post("/api/admin/content", json=payload, headers=ADMIN_HEADERS)
    assert created.status_code == 200
    content_id = created.json()["id"]

    drafts = client.get("/api/content", params={"drafts": "true"}, headers=ADMIN_HEADERS)
    assert any(item["id"] == content_id for item in drafts.json())

    payload["title"] = "Updated test research record"
    updated = client.patch(
        f"/api/admin/content/{content_id}",
        json=payload,
        headers=ADMIN_HEADERS,
    )
    assert updated.status_code == 200

    deleted = client.delete(f"/api/admin/content/{content_id}", headers=ADMIN_HEADERS)
    assert deleted.status_code == 200


def test_admin_messages_require_authentication() -> None:
    assert client.get("/api/admin/messages").status_code == 403
    assert client.get("/api/admin/messages", headers=ADMIN_HEADERS).status_code == 200


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
