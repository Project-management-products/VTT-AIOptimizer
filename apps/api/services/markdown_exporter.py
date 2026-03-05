from typing import List
from schemas import ConsolidatedEntry

def export_to_markdown(entries: List[dict], metrics: List[dict], total_time: float) -> str:
    """
    Generates the optimized Markdown report including a statistics summary.
    """
    lines = ["# Reporte de Reunión Optimizado", ""]
    
    # 1. Statistics Summary
    lines.append("## Estadísticas de Participación")
    lines.append(f"**Tiempo total de habla:** {int(total_time // 60)}m {int(total_time % 60)}s")
    lines.append("")
    lines.append("| Orador | Tiempo Total | Intervenciones | % Participación |")
    lines.append("| :--- | :---: | :---: | :---: |")
    
    for m in metrics:
        pct = round((m["total_time_s"] / total_time * 100), 1) if total_time > 0 else 0
        time_str = f"{int(m['total_time_s'] // 60)}m {int(m['total_time_s'] % 60)}s"
        lines.append(f"| {m['speaker']} | {time_str} | {m['consolidated_interventions']} | {pct}% |")
    
    lines.append("")
    lines.append("---")
    lines.append("## Transcripción Optimizada")
    lines.append("")
    
    # 2. Transcription
    for entry in entries:
        time_s = round(entry["total_duration_ms"] / 1000, 2)
        lines.append(f"**[{time_s}s] {entry['speaker']}:** {entry['text']}")
        lines.append("")
        
    return "\n".join(lines)
