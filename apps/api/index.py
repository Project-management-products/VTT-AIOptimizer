from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import ProcessingResult
from services import vtt_parser, speaker_merger, metrics_calculator, markdown_exporter
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Metrics Hub API is running"}

@app.post("/api/process", response_model=ProcessingResult)
async def process_vtt(file: UploadFile = File(...)):
    if not file.filename.endswith('.vtt') and not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .vtt or .txt file.")
        
    try:
        content = (await file.read()).decode('utf-8')
        
        # 1. Parse
        raw_entries = vtt_parser.parse_vtt_content(content)
        
        # 2. Merge
        consolidated = speaker_merger.merge_speaker_entries(raw_entries)
        
        # 3. Calculate Metrics
        metrics = metrics_calculator.calculate_metrics(consolidated)
        total_time = metrics_calculator.get_total_time(metrics)
        participants = [m["speaker"] for m in metrics]
        
        # 4. Export Markdown
        original_size = len(content)
        md_output = markdown_exporter.export_to_markdown(consolidated)
        new_size = len(md_output)
        
        reduction = 0
        if original_size > 0:
            reduction = round((1 - (new_size / original_size)) * 100, 2)
            
        print(f"DEBUG: Processed {len(raw_entries)} raw entries into {len(consolidated)} consolidated entries.")
        print(f"DEBUG: Reduction: {reduction}%")
        
        return ProcessingResult(
            consolidated_entries=consolidated,
            speaker_metrics=metrics,
            total_speaking_time_s=total_time,
            participants=participants,
            markdown_output=md_output,
            reduction_percentage=reduction
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing VTT: {str(e)}")
