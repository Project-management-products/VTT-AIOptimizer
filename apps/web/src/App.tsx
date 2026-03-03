import { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ProcessingResult } from './types';

function App() {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<ProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setProgress(0);
        setError(null);
        setResult(null);

        // Simulate progress for better UX (Stitch Screen 2 feel)
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Error processing file');
            }

            const data: ProcessingResult = await response.json();
            setProgress(100);

            // Artificial delay to show 100% (Screen 2 completion)
            setTimeout(() => {
                setResult(data);
                setIsUploading(false);
                clearInterval(progressInterval);
            }, 500);

        } catch (err: any) {
            setError(err.message || 'Error de conexión con el servidor');
            setIsUploading(false);
            clearInterval(progressInterval);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setProgress(0);
        setIsUploading(false);
    };

    return (
        <div className="min-h-screen bg-background-light selection:bg-primary/10 selection:text-primary">
            <Header />

            <main className="pt-32 pb-20 px-6">
                {error && (
                    <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <span className="material-symbols-outlined">error</span>
                        <div className="flex-1">
                            <p className="font-bold">Error al procesar</p>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                        <button onClick={handleReset} className="text-sm font-bold underline">Reintentar</button>
                    </div>
                )}

                {!result ? (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <section className="max-w-4xl mx-auto text-center mb-16 space-y-6">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-background-dark">
                                Tus reuniones, <br />
                                <span className="text-primary italic">claras y optimizadas.</span>
                            </h2>
                            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                Procesa archivos VTT para obtener métricas de participación y reportes limpios en segundos.
                            </p>
                        </section>

                        <FileUploader
                            onUpload={handleUpload}
                            isUploading={isUploading}
                            progress={progress}
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="max-w-6xl mx-auto flex justify-start">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors group"
                            >
                                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Subir otro archivo
                            </button>
                        </div>
                        <MetricsDashboard data={result} />
                    </div>
                )}
            </main>

            <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 grayscale opacity-50">
                    <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[10px]">analytics</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">VTT Hub Engine</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">© 2026 VTT-AI Optimizer & Metrics Hub. Desarrollado para análisis de eficiencia.</p>
            </footer>
        </div>
    );
}

export default App;
