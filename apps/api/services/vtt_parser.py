import webvtt
import html
import re
from typing import List
from schemas import VttEntry

def _to_seconds(timestamp: str) -> float:
    """Converts HH:MM:SS.mmm to float seconds."""
    parts = timestamp.split(':')
    h = int(parts[0])
    m = int(parts[1])
    s_full = parts[2].split('.')
    s = int(s_full[0])
    ms = int(s_full[1]) if len(s_full) > 1 else 0
    return h * 3600 + m * 60 + s + (ms / 1000.0)

def parse_vtt_content(content: str) -> List[VttEntry]:
    """
    Parses VTT content, decodes HTML entities, and extracts speakers from <v Name> tags.
    """
    import io
    vtt_file = io.StringIO(content)
    
    entries = []
    for caption in webvtt.read_buffer(vtt_file):
        text = caption.text
        
        # Decode HTML entities (í, ñ, etc.)
        text = html.unescape(text).strip()
        
        # Extract speaker from voice attribute
        speaker = getattr(caption, "voice", "Unknown").strip()
        if not speaker:
            speaker = "Unknown"
        
        # Manual precision parsing
        start_ms = _to_seconds(caption.start) * 1000
        end_ms = _to_seconds(caption.end) * 1000
        
        entries.append({
            "speaker": speaker,
            "start_ms": start_ms,
            "end_ms": end_ms,
            "text": text
        })
        
    return entries
