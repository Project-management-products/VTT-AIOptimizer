export interface ConsolidatedEntry {
    speaker: string;
    total_duration_ms: number;
    text: string;
    original_count: number;
}

export interface SpeakerMetrics {
    speaker: string;
    total_time_s: number;
    original_interventions: number;
    consolidated_interventions: number;
}

export interface ProcessingResult {
    consolidated_entries: ConsolidatedEntry[];
    speaker_metrics: SpeakerMetrics[];
    total_speaking_time_s: number;
    participants: string[];
    markdown_output: string;
    reduction_percentage: number;
    report_markdown: string;      // Informe generado (opcional)
    original_filename: string;   // Nombre original del archivo subido
    anonymized_vtt_text: string; // Texto anonimizado para enviar al reporte
}

export interface GenerateReportResponse {
    report_markdown: string;
}
