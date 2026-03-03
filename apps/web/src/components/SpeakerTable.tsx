import { SpeakerMetrics } from '../types';

interface SpeakerTableProps {
    metrics: SpeakerMetrics[];
}

export const SpeakerTable = ({ metrics }: SpeakerTableProps) => {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-lg">Métricas por Orador</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalle Individual</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[200px]">Orador</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tiempo Total</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Originales</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Consolidadas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {metrics.map((s) => (
                            <tr key={s.speaker} className="hover:bg-blue-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                            {s.speaker.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-700 truncate max-w-[180px]" title={s.speaker}>{s.speaker}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-xs text-gray-600 font-bold">
                                    {Math.floor(s.total_time_s / 60)}m {Math.floor(s.total_time_s % 60)}s
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400 font-bold text-xs">
                                    {s.original_interventions}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-600 uppercase">
                                        {s.consolidated_interventions}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
