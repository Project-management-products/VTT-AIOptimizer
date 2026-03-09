from importlib import import_module
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import schemas
from services import vtt_parser, speaker_merger, metrics_calculator, markdown_exporter
from services import speaker_anonymizer, report_gateway

def _load_local_env() -> None:
    """
    Loads .env for local development only.
    In Vercel, environment variables should be configured in project settings.
    """
    try:
        dotenv = import_module("dotenv")
        load_dotenv = getattr(dotenv, "load_dotenv", None)
        find_dotenv = getattr(dotenv, "find_dotenv", None)
        if callable(load_dotenv) and callable(find_dotenv):
            load_dotenv(find_dotenv())
    except ModuleNotFoundError:
        pass


_load_local_env()

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

@app.post("/api/process", response_model=schemas.ProcessingResult)
async def process_vtt(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.endswith(".vtt") and not filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .vtt or .txt file.")

    try:
        content = (await file.read()).decode('utf-8')

        # 1. Parse
        raw_entries = vtt_parser.parse_vtt_content(content)

        # 2. Merge consecutive same-speaker entries
        consolidated = speaker_merger.merge_speaker_entries(raw_entries)

        # 3. Create FULL markdown with REAL names (Step 5: Preview full file)
        # Use initial metrics on consolidated (real names)
        real_metrics = metrics_calculator.calculate_metrics(consolidated)
        total_time = metrics_calculator.get_total_time(real_metrics)
        participants = [m["speaker"] for m in real_metrics]
        
        md_output = markdown_exporter.export_to_markdown(consolidated, real_metrics, total_time)

        # 4. Anonymize speakers (Step 3: Option 2, anonymized)
        anonymized_entries, anonymized_vtt_text = speaker_anonymizer.anonymize_speakers(consolidated)
        
        # We continue using real_metrics for the table if we want the stats with real names,
        # but common requirement is stats also with Orador N? Let's check user prompt.
        # "Se crean las 2 opciones... la full y la anonimizada".
        # Let's keep metrics associated with the version shown. 
        # If preview is full, metrics shown should be full?
        # User story: "Se da preview del archivo full". "Se crea la tabla de estaditicas".
        # We will return stats with real names as that's what's shown in the full preview.

        original_size = len(content)
        new_size = len(md_output)
        reduction = 0
        if original_size > 0:
            reduction = round((1 - (new_size / original_size)) * 100, 2)

        return schemas.ProcessingResult(
            consolidated_entries=[schemas.ConsolidatedEntry(**entry) for entry in consolidated],  # FULL
            speaker_metrics=[schemas.SpeakerMetrics(**metric) for metric in real_metrics],        # FULL
            total_speaking_time_s=total_time,
            participants=participants,        # REAL names
            markdown_output=md_output,        # FULL version
            reduction_percentage=reduction,
            report_markdown="",               # Empty, generated on demand via button
            original_filename=filename or "transcripcion.vtt",
            anonymized_vtt_text=anonymized_vtt_text, # Ready for the prompt
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing VTT: {str(e)}")

@app.post("/api/generate-report", response_model=schemas.GenerateReportResponse)
async def generate_report_endpoint(request: schemas.GenerateReportRequest):
    """
    Step 6: Endpoint called when user clicks 'Reporte de reunión' button.
    Sends anonymized text to external service.
    """
    try:
        report_md = await report_gateway.generate_report(request.anonymized_text)
        return schemas.GenerateReportResponse(report_markdown=report_md)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")

from mangum import Mangum
handler = Mangum(app)