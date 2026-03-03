export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-2xl">analytics</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-background-dark">VTT Hub</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Metrics & Optimizer</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-primary transition-colors">Documentación</a>
                    <a href="#" className="hover:text-primary transition-colors">Historias de Usuario</a>
                    <a href="#" className="hover:text-primary transition-colors">PDR</a>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-primary/10">
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        Comenzar
                    </button>
                </div>
            </div>
        </header>
    );
};
