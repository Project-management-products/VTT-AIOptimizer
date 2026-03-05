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

def parse_vtt_content(content: str) -> List[dict]:
    """
    Parses VTT content, decodes HTML entities, and extracts speakers.
    Includes defensive checks for malformed files and missing headers.
    """
    import io
    
    # Ensure WEBVTT header exists
    if not content.strip().startswith("WEBVTT"):
        content = "WEBVTT\n\n" + content
    
    vtt_file = io.StringIO(content)
    entries = []
    
    try:
        for caption in webvtt.read_buffer(vtt_file):
            try:
                # Safely get text
                text_raw = getattr(caption, "text", "")
                if text_raw is None: text_raw = ""
                text = html.unescape(text_raw).strip()
                
                # Safely get speaker
                speaker_raw = getattr(caption, "voice", "")
                if speaker_raw is None: speaker_raw = ""
                speaker = html.unescape(speaker_raw).strip()
                
                # Clean speaker: Remove session IDs
                speaker = re.sub(r'\s*[\(\[]?([0-9a-fA-F]{8,})[\)\]]?\s*', '', speaker).strip()
                
                if not speaker or speaker.lower() == "none":
                    speaker = "Unknown"
                
                # Safely parse times
                start_val = getattr(caption, "start", "00:00:00.000")
                end_val = getattr(caption, "end", "00:00:00.000")
                
                start_ms = _to_seconds(start_val) * 1000
                end_ms = _to_seconds(end_val) * 1000
                
                entries.append({
                    "speaker": speaker,
                    "start_ms": start_ms,
                    "end_ms": end_ms,
                    "text": text
                })
            except Exception as inner_e:
                print(f"DEBUG: Skipping malformed caption block: {inner_e}")
                continue
                
    except Exception as outer_e:
        print(f"DEBUG: Critical error in webvtt parser: {outer_e}")
        import traceback
        traceback.print_exc()
        raise outer_e
        
    return entries
