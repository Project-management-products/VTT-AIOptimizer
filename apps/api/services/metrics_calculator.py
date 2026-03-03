from typing import List, Dict
from ..schemas import ConsolidatedEntry, SpeakerMetrics

def calculate_metrics(consolidated_entries: List[ConsolidatedEntry]) -> List[SpeakerMetrics]:
    """
    Calculates performance metrics per speaker.
    """
    metrics_map: Dict[str, SpeakerMetrics] = {}
    
    for entry in consolidated_entries:
        if entry.speaker not in metrics_map:
            metrics_map[entry.speaker] = SpeakerMetrics(
                speaker=entry.speaker,
                total_time_s=0,
                original_interventions=0,
                consolidated_interventions=0
            )
        
        m = metrics_map[entry.speaker]
        m.total_time_s += entry.total_duration_ms / 1000
        m.original_interventions += entry.original_count
        m.consolidated_interventions += 1
        
    # Sort by total time descending
    return sorted(metrics_map.values(), key=lambda x: x.total_time_s, reverse=True)

def get_total_time(metrics: List[SpeakerMetrics]) -> float:
    return sum(m.total_time_s for m in metrics)
