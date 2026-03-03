from typing import List
from ..schemas import VttEntry, ConsolidatedEntry

def merge_speaker_entries(entries: List[VttEntry]) -> List[ConsolidatedEntry]:
    """
    Consolidates consecutive entries by the same speaker.
    Concatenates text with a space divider.
    """
    if not entries:
        return []
        
    consolidated = []
    current_entry = None
    
    for entry in entries:
        if current_entry is None:
            current_entry = ConsolidatedEntry(
                speaker=entry.speaker,
                total_duration_ms=entry.end_ms - entry.start_ms,
                text=entry.text,
                original_count=1
            )
        elif entry.speaker == current_entry.speaker:
            # Merge with current
            current_entry.text += f" {entry.text}"
            current_entry.total_duration_ms += (entry.end_ms - entry.start_ms)
            current_entry.original_count += 1
        else:
            # New speaker, push current and start new
            consolidated.append(current_entry)
            current_entry = ConsolidatedEntry(
                speaker=entry.speaker,
                total_duration_ms=entry.end_ms - entry.start_ms,
                text=entry.text,
                original_count=1
            )
            
    if current_entry:
        consolidated.append(current_entry)
        
    return consolidated
