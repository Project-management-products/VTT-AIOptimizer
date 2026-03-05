import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProcessingResult } from '../types';
import { SpeakerTable } from './SpeakerTable';
import { TimeDistribution } from './TimeDistribution';

interface MetricsDashboardProps {
    data: ProcessingResult;
}

export const MetricsDashboard = ({ data }: MetricsDashboardProps) => {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const blob = new Blob([data.markdown_output], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-optimizado.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                        Imprimir Reporte
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Descargar MD
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">timer</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Tiempo de Habla</p>
                        <p className="text-2xl font-black text-background-dark">
                            {Math.floor(data.total_speaking_time_s / 60)}m {Math.floor(data.total_speaking_time_s % 60)}s
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Participantes</p>
                        <p className="text-2xl font-black text-background-dark">{data.participants.length}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">compress</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Reducción Peso</p>
                        <p className="text-2xl font-black text-background-dark">{data.reduction_percentage}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TimeDistribution metrics={data.speaker_metrics} totalTime={data.total_speaking_time_s} />
                <SpeakerTable metrics={data.speaker_metrics} />
            </div>

            {/* Markdown Preview */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-background-dark">
                        <span className="material-symbols-outlined">description</span>
                        Vista Previa del Reporte
                    </h3>

                    <div className="prose prose-sm prose-slate max-w-none 
                        bg-gray-50 border border-gray-100 rounded-2xl p-8 
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

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleDownload}
                            className="text-primary hover:text-blue-700 font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            Descargar archivo completo
                            <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
