import sys
from apps.backend.services import vtt_parser, speaker_merger, metrics_calculator

def test_pipeline():
    sample_vtt = """WEBVTT

00:00:00.000 --> 00:00:03.680
<v Carlos Farías>Hola, buenos días.&#237;</v>

00:00:03.680 --> 00:00:05.120
<v Carlos Farías>¿Cómo están?</v>

00:00:05.120 --> 00:00:08.000
<v Ana Rojas>Muy bien, gracias Carlos.</v>
"""
    
    print("Testing Parser...")
    entries = vtt_parser.parse_vtt_content(sample_vtt)
    assert len(entries) == 3
    assert "Carlos" in entries[0].speaker
    assert "Hola" in entries[0].text
    print("Parser OK.")
    
    print("Testing Merger...")
    consolidated = speaker_merger.merge_speaker_entries(entries)
    assert len(consolidated) == 2
    assert "Carlos" in consolidated[0].speaker
    assert consolidated[0].original_count == 2
    print("Merger OK.")
    
    print("Testing Metrics...")
    metrics = metrics_calculator.calculate_metrics(consolidated)
    for m in metrics:
        print(f"DEBUG: Speaker={m.speaker}, Time={m.total_time_s}")
    assert len(metrics) == 2
    carlos_metric = next(m for m in metrics if "Carlos" in m.speaker)
    # Use ads for safer comparison
    assert abs(carlos_metric.total_time_s - 5.12) < 0.01
    print("Metrics OK.")

if __name__ == "__main__":
    try:
        test_pipeline()
        print("\nALL BACKEND SERVICES TESTED SUCCESSFULLY.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"\nTEST FAILED: {str(e)}")
        sys.exit(1)
