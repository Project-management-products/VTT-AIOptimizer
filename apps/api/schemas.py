from pydantic import BaseModel
from typing import List

class VttEntry(BaseModel):
    speaker: str
    start_ms: float
    end_ms: float
    text: str

class ConsolidatedEntry(BaseModel):
    speaker: str
    total_duration_ms: float
    text: str
    original_count: int

class SpeakerMetrics(BaseModel):
    speaker: str
    total_time_s: float
    original_interventions: int
    consolidated_interventions: int

class ProcessingResult(BaseModel):
    consolidated_entries: List[ConsolidatedEntry]
    speaker_metrics: List[SpeakerMetrics]
    total_speaking_time_s: float
    participants: List[str]
    markdown_output: str
    reduction_percentage: float
