from typing import List, Tuple

def anonymize_speakers(entries: List[dict]) -> Tuple[List[dict], str]:
    """
    Replaces real speaker names with generic identifiers ('Orador 1', 'Orador 2', ...).
    Processes consolidated entries (already merged by speaker_merger).
    
    Returns:
        - anonymized_entries: list of entries with anonymized speaker names
        - anonymized_vtt_text: plain text of the anonymized VTT suitable as prompt
    """
    speaker_map: dict[str, str] = {}
    counter = 1

    anonymized_entries = []
    for entry in entries:
        real_speaker = entry["speaker"]
        if real_speaker not in speaker_map:
            speaker_map[real_speaker] = f"Orador {counter}"
            counter += 1
        
        anon_entry = dict(entry)
        anon_entry["speaker"] = speaker_map[real_speaker]
        anonymized_entries.append(anon_entry)

    # Build plain-text VTT content for the prompt (format: [Xs] Orador N: text)
    lines = []
    for entry in anonymized_entries:
        time_s = round(entry.get("total_duration_ms", 0) / 1000, 2)
        lines.append(f"[{time_s}s] {entry['speaker']}: {entry['text']}")

    anonymized_vtt_text = "\n".join(lines)
    return anonymized_entries, anonymized_vtt_text
