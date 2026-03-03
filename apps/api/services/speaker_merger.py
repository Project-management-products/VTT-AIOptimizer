from typing import List
from schemas import VttEntry, ConsolidatedEntry

def merge_speaker_entries(entries: List[dict]) -> List[dict]:
    """
    Consolidates consecutive entries by the same speaker.
    Accumulates text fragments in a list for efficient joining.
    """
    if not entries:
        return []
        
    consolidated = []
    current_entry = None
    text_fragments = []
    
    for entry in entries:
        if current_entry is None:
            current_entry = {
                "speaker": entry["speaker"],
                "total_duration_ms": entry["end_ms"] - entry["start_ms"],
                "text_fragments": [entry["text"]],
                "original_count": 1
            }
        elif entry["speaker"] == current_entry["speaker"]:
            current_entry["text_fragments"].append(entry["text"])
            current_entry["total_duration_ms"] += (entry["end_ms"] - entry["start_ms"])
            current_entry["original_count"] += 1
        else:
            # Finalize previous
            current_entry["text"] = " ".join(current_entry["text_fragments"])
            del current_entry["text_fragments"]
            consolidated.append(current_entry)
            
            # Start new
            current_entry = {
                "speaker": entry["speaker"],
                "total_duration_ms": entry["end_ms"] - entry["start_ms"],
                "text_fragments": [entry["text"]],
                "original_count": 1
            }
            
    if current_entry:
        current_entry["text"] = " ".join(current_entry["text_fragments"])
        del current_entry["text_fragments"]
        consolidated.append(current_entry)
        
    return consolidated
