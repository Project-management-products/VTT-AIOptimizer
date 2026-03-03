import { SpeakerMetrics } from '../types';

interface TimeDistributionProps {
    metrics: SpeakerMetrics[];
    totalTime: number;
}

export const TimeDistribution = ({ metrics, totalTime }: TimeDistributionProps) => {
    // Simple donut chart representation using CSS conic-gradient
    let currentOffset = 0;

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="font-bold text-lg mb-8">Distribución de Tiempo</h3>

            <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="relative w-48 h-48 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `conic-gradient(
                ${metrics.map((s, i) => {
                                const percentage = (s.total_time_s / totalTime) * 100;
                                const startColor = i === 0 ? '#0b50da' : i === 1 ? '#101622' : i === 2 ? '#3b82f6' : '#94a3b8';
                                const res = `${startColor} ${currentOffset}% ${currentOffset + percentage}%`;
                                currentOffset += percentage;
                                return res;
                            }).join(', ')}
              )`
                        }}
                    ></div>
                    <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                        <span className="text-2xl font-black text-background-dark">
                            {metrics.length}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Oradores</span>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                    {metrics.map((s, i) => {
                        const percentage = Math.round((s.total_time_s / totalTime) * 100);
                        const colorClass = i === 0 ? 'bg-primary' : i === 1 ? 'bg-background-dark' : i === 2 ? 'bg-blue-400' : 'bg-gray-400';

                        return (
                            <div key={s.speaker} className="space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
                                        <span className="font-semibold text-gray-700">{s.speaker}</span>
                                    </div>
                                    <span className="font-bold text-gray-400">{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`${colorClass} h-full transition-all duration-1000`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
