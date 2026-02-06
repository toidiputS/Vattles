import React from 'react';
import LabEditor from './LabEditor';

interface VibeLabsViewProps {
    onBack: () => void;
    initialPrompt?: string;
}

const VibeLabsView: React.FC<VibeLabsViewProps> = ({ onBack, initialPrompt }) => {
    return (
        <div className="animate-fade-in text-white">
             <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">Vibe Labs</h1>
                <div className="w-[150px]"></div>
            </header>
            <div className="bg-black/20 rounded-lg border border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold font-orbitron mb-4">AI-Powered Vibe Prototyping</h2>
                <p className="text-gray-400 mb-6">This is the Vibe Lab, a creative sandbox to experiment with generative AI tools and build components for your Vattles.</p>
                <LabEditor initialPrompt={initialPrompt} />
            </div>
        </div>
    );
};

export default VibeLabsView;