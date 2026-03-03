export interface ConsolidatedEntry {
    speaker: string;
    total_duration_ms: number;
    text: string;
    original_count: number;
}

export interface SpeakerMetrics {
    speaker: string;
    total_time_s: number;
    original_interventions: int;
    consolidated_interventions: int;
}

export interface ProcessingResult {
    consolidated_entries: ConsolidatedEntry[];
    speaker_metrics: SpeakerMetrics[];
    total_speaking_time_s: number;
    participants: string[];
    markdown_output: string;
    reduction_percentage: number;
}
