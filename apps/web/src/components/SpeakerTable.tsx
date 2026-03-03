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
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Orador</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Tiempo Total</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Originales</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Consolidadas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {metrics.map((s) => (
                            <tr key={s.speaker} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                            {s.speaker.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-gray-700">{s.speaker}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right font-mono text-sm text-gray-600">
                                    {Math.floor(s.total_time_s / 60)}m {Math.floor(s.total_time_s % 60)}s
                                </td>
                                <td className="px-8 py-5 text-right text-gray-500 font-medium">
                                    {s.original_interventions}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">
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
