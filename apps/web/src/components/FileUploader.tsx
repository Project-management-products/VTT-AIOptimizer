import { useState, useCallback } from 'react';

interface FileUploaderProps {
    onUpload: (file: File) => void;
    isUploading: boolean;
    progress: number;
}

export const FileUploader = ({ onUpload, isUploading, progress }: FileUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onUpload(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onUpload(files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative overflow-hidden
          bg-white rounded-3xl p-12 text-center 
          border-4 border-dashed transition-all duration-300
          ${isDragging ? 'border-primary bg-blue-50/50 scale-[1.01]' : 'border-gray-100 hover:border-blue-200'}
          ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}
        `}
            >
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                    accept=".vtt,.txt"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-8 py-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-primary rounded-full transition-all duration-500"
                                style={{ clipPath: `inset(0 0 0 0)`, transform: `rotate(${progress * 3.6}deg)` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-primary">
                                {progress}%
                            </div>
                        </div>

                        <div className="max-w-xs mx-auto">
                            <h3 className="text-xl font-bold mb-2">Procesando archivo...</h3>
                            <p className="text-gray-400 text-sm mb-6">Estamos limpiando etiquetas y calculando métricas.</p>

                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <button
                                className="mt-8 text-sm font-bold text-red-500 hover:text-red-600 transition-colors inline-flex items-center gap-2"
                                onClick={(e) => { e.stopPropagation(); window.location.reload(); }}
                            >
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Cancelar Carga
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className={`
              w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-primary text-white' : 'bg-blue-50 text-primary'}
            `}>
                            <span className="material-symbols-outlined text-4xl">
                                {isDragging ? 'file_upload' : 'cloud_upload'}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black mb-2">Sube tu archivo para optimizarlo</h3>
                            <p className="text-gray-400 font-medium">Arrastra tu archivo VTT aquí o haz clic para buscar</p>
                        </div>

                        <div className="pt-6 flex flex-wrap justify-center gap-6">
                            {[
                                { icon: 'lock', label: '100% Privado' },
                                { icon: 'verified_user', label: 'GDPR Ready' },
                                { icon: 'auto_clean', label: 'Auto-limpieza' }
                            ].map((badge) => (
                                <div key={badge.label} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm">{badge.icon}</span>
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!isUploading && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: 'Carga el VTT', desc: 'Sube tu archivo generado por Teams o Zoom.' },
                        { step: '02', title: 'Procesamiento AI', desc: 'Consolidamos oradores y limpiamos ruido.' },
                        { step: '03', title: 'Genera Reporte', desc: 'Obtén métricas y el MD listo para usar.' }
                    ].map((item) => (
                        <div key={item.step} className="p-8 bg-white/50 border border-white rounded-3xl hover:bg-white transition-colors">
                            <span className="text-primary/20 text-4xl font-black mb-4 block">{item.step}</span>
                            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
