from .schemas import KnowledgeDomain, KnowledgeTopic, Paper, Resource, Video

VIDEOS = [
    Video(id=1, title="But what is a neural network?", source="3Blue1Brown", topic="Deep Learning", duration_minutes=19, url="https://www.youtube.com/watch?v=aircAruvnKk"),
    Video(id=2, title="Attention in transformers, visually explained", source="3Blue1Brown", topic="NLP", duration_minutes=27, url="https://www.youtube.com/watch?v=eMlx5fFNoYc"),
    Video(id=3, title="The unreasonable effectiveness of data", source="Google TechTalks", topic="Data Science", duration_minutes=54, url="https://www.youtube.com/watch?v=yvDCzhbjYWs"),
]

KNOWLEDGE = [
    KnowledgeDomain(title="Artificial Intelligence", topics=[
        KnowledgeTopic(title="Machine Learning", resources=[Resource(title="Supervised learning foundations", kind="guide"), Resource(title="Model evaluation & validation", kind="notebook")]),
        KnowledgeTopic(title="Deep Learning", resources=[Resource(title="Neural networks from first principles", kind="course"), Resource(title="Transformer reading sequence", kind="reading-list")]),
    ]),
    KnowledgeDomain(title="Data Science", topics=[
        KnowledgeTopic(title="Statistics", resources=[Resource(title="Probability essentials", kind="guide"), Resource(title="Experimental design checklist", kind="checklist")]),
        KnowledgeTopic(title="Data Engineering", resources=[Resource(title="Reproducible data pipelines", kind="guide"), Resource(title="Data quality patterns", kind="notes")]),
    ]),
]

PAPERS = [
    Paper(code="ARG-006", year=2026, title="Robust Arabic misinformation detection under domain shift", area="Natural Language Processing", status="Under review", authors=["ARGUS NLP Group"], abstract="A research direction studying robust misinformation detection when Arabic language models encounter new domains and dialects."),
    Paper(code="ARG-005", year=2026, title="Interpretable early-warning models for student success", area="Responsible AI", status="Working paper", authors=["ARGUS Learning Analytics Group"], abstract="A research direction exploring interpretable learning analytics while centering student privacy and responsible intervention."),
    Paper(code="ARG-004", year=2025, title="Efficient vision models for resource-constrained environments", area="Computer Vision", status="Research report", authors=["ARGUS Vision Group"], abstract="A research report examining compact computer vision architectures for hardware with limited compute and memory."),
]
