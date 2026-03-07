import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProcessingResult, GenerateReportResponse } from '../types';
import { SpeakerTable } from './SpeakerTable';
import { TimeDistribution } from './TimeDistribution';

interface MetricsDashboardProps {
    data: ProcessingResult;
}

export const MetricsDashboard = ({ data }: MetricsDashboardProps) => {
    // New local state for on-demand report generation
    const [reportContent, setReportContent] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReportError(null);
        try {
            const response = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anonymized_text: data.anonymized_vtt_text }),
            });

            if (!response.ok) throw new Error('Error al generar el reporte de reunión');

            const result: GenerateReportResponse = await response.json();
            setReportContent(result.report_markdown);
        } catch (err: any) {
            setReportError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadFull = () => {
        // Step 8: Download original optimized full file (names allowed)
        const blob = new Blob([data.markdown_output], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const downloadName = (data.original_filename || 'reporte-optimizado.vtt')
            .replace(/\.vtt$/i, '.md')
            .replace(/\.txt$/i, '.md');
        a.download = downloadName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadReport = () => {
        // Step 7: Download generated report
        if (!reportContent) return;
        const blob = new Blob([reportContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const downloadName = (data.original_filename || 'informe.vtt')
            .replace(/\.vtt$/i, '-informe.md')
            .replace(/\.txt$/i, '-informe.md');
        a.download = downloadName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with main actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Análisis de Participación</h2>
                    <p className="text-gray-500 font-medium">Resultados del procesamiento del archivo VTT</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">print</span>
                        Imprimir
                    </button>

                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-6 py-2.5 ${isGenerating ? 'bg-gray-300' : 'bg-emerald-600'} text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all`}
                    >
                        <span className="material-symbols-outlined text-sm">{isGenerating ? 'sync' : 'summarize'}</span>
                        {isGenerating ? 'Generando...' : 'Reporte de Reunión'}
                    </button>

                    <button
                        onClick={handleDownloadFull}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Descargar Full
                    </button>
                </div>
            </div>

            {reportError && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-medium text-sm">
                    <span className="material-symbols-outlined">error</span>
                    {reportError}
                </div>
            )}

            {/* Statistics Section (Step 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TimeDistribution metrics={data.speaker_metrics} totalTime={data.total_speaking_time_s} />
                <SpeakerTable metrics={data.speaker_metrics} />
            </div>

            {/* AI-Generated Report Display (US3 / Step 7) */}
            {reportContent && (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-1 rounded-[2.5rem] shadow-2xl shadow-emerald-100">
                    <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.25rem] relative overflow-hidden">


                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-600">
                                <span className="material-symbols-outlined text-emerald-600">summarize</span>
                                Informe de Reunión
                            </h3>
                            <p className="text-gray-400 text-sm font-medium mb-8">
                                Generado de forma segura — los oradores han sido anonimizados para la IA.
                            </p>

                            <div className="prose prose-emerald max-w-none text-gray-700
                                bg-gray-50/50 rounded-3xl p-8 border border-emerald-50
                                font-sans leading-relaxed overflow-y-auto max-h-[600px]
                                scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-black mb-4 border-b pb-2" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-6 mb-3" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                        table: ({ node, ...props }) => (
                                            <div className="overflow-x-auto my-6">
                                                <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden" {...props} />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                                        th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest" {...props} />,
                                        td: ({ node, ...props }) => <td className="px-4 py-3 text-sm border-t" {...props} />,
                                        hr: ({ node, ...props }) => <hr className="my-10 border-gray-200" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-emerald-700" {...props} />,
                                    }}
                                >
                                    {reportContent}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    id="btn-download-report"
                                    onClick={handleDownloadReport}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-200 transition-all"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                    Descargar Informe de Reunión (.md)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Markdown FULL Preview (Step 5) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-[2.5rem] shadow-2xl shadow-blue-100">
                <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[2.25rem] relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-background-dark">
                            <span className="material-symbols-outlined text-gray-400">description</span>
                            Transcripción Optimizada
                        </h3>

                        <div className="prose prose-sm prose-slate max-w-none 
                            bg-gray-50/80 border border-gray-100 rounded-2xl p-8 
                            font-sans text-gray-700 leading-relaxed 
                            overflow-y-auto max-h-[600px]
                            scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-black mb-4 border-b pb-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-6">
                                            <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-4 py-3 text-sm border-t" {...props} />,
                                    hr: ({ node, ...props }) => <hr className="my-10 border-gray-200" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                                }}
                            >
                                {data.markdown_output}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleDownloadFull}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-200 transition-all"
                            >
                                <span className="material-symbols-outlined">download</span>
                                Descargar archivo optimizado full
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
