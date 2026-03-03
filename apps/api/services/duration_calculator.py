def format_duration(seconds: float) -> str:
    """
    Formats duration in HH:MM:SS.mm format as per user requirement.
    """
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    ms = int(round((seconds % 1) * 100, 2))
    
    return f"{hrs:02}:{mins:02}:{secs:02}.{ms:02}"

def get_duration_ms(start_ms: float, end_ms: float) -> float:
    """
    Calculates duration in ms.
    """
    return max(0, end_ms - start_ms)
