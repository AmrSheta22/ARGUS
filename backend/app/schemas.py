from pydantic import BaseModel, Field, HttpUrl


class Video(BaseModel):
    id: int
    title: str
    source: str
    topic: str
    duration_minutes: int
    url: HttpUrl


class Resource(BaseModel):
    title: str
    kind: str
    url: HttpUrl | None = None


class KnowledgeTopic(BaseModel):
    title: str
    resources: list[Resource]


class KnowledgeDomain(BaseModel):
    title: str
    topics: list[KnowledgeTopic]


class Paper(BaseModel):
    code: str
    year: int
    title: str
    area: str
    status: str
    authors: list[str]
    abstract: str
    url: HttpUrl | None = None


class SummarizeRequest(BaseModel):
    text: str = Field(min_length=80, max_length=12_000)
    max_sentences: int = Field(default=3, ge=1, le=6)


class SummarizeResponse(BaseModel):
    summary: str
    original_words: int
    summary_words: int


class ContentItem(BaseModel):
    id: int
    section: str
    title: str
    subtitle: str = ""
    description: str
    url: str = ""
    tags: str = ""
    published: bool = True
    sort_order: int = 0


class ContentCreate(BaseModel):
    section: str
    title: str = Field(min_length=2, max_length=240)
    subtitle: str = Field(default="", max_length=300)
    description: str = Field(min_length=10, max_length=5000)
    url: str = Field(default="", max_length=1000)
    tags: str = Field(default="", max_length=500)
    published: bool = True
    sort_order: int = 0


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=200)
    subject: str = Field(min_length=2, max_length=180)
    message: str = Field(min_length=10, max_length=5000)
