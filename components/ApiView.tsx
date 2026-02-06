
import React from 'react';
import { LogoIcon } from './icons';

interface ApiViewProps {
    onBack: () => void;
}

const ApiView: React.FC<ApiViewProps> = ({ onBack }) => {
    return (
        <div className="w-full max-w-screen-lg mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in text-gray-200">
             <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">API Access</h1>
                </div>
                <div className="w-[150px]"></div>
            </header>
            <main className="bg-black/20 rounded-lg border border-gray-700/50 p-8 text-center">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-4">Vattles API</h2>
                <p className="text-gray-400">
                    API access and documentation are coming soon. This will allow you to integrate Vattles data and functionality into your own applications.
                </p>
            </main>
        </div>
    );
};

export default ApiView;
