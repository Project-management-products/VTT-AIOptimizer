from typing import List
from ..schemas import ConsolidatedEntry

def export_to_markdown(entries: List[ConsolidatedEntry], original_file_size: int = 1000) -> str:
    """
    Generates the optimized Markdown report.
    Format: [Xs] Speaker: Text
    """
    lines = []
    
    for entry in entries:
        time_s = round(entry.total_duration_ms / 1000, 2)
        # Format as [44.32s] Speaker: Text
        lines.append(f"[{time_s}s] {entry.speaker}: {entry.text}")
        
    md_content = "\n\n".join(lines)
    
    return md_content
