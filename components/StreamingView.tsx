
import React, { useState } from 'react';
import { LogoIcon, ClipboardIcon } from './icons';

const CopyableUrlField: React.FC<{ url: string }> = ({ url }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center mt-4 bg-gray-900/70 border border-gray-600 rounded-md">
            <input 
                type="text" 
                readOnly 
                value={url} 
                className="flex-grow bg-transparent px-3 py-2 text-sm text-gray-400 font-mono focus:outline-none"
            />
            <button 
                onClick={handleCopy}
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-r-md transition-colors text-sm w-24 text-center"
                aria-label="Copy URL"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

const OverlayCard: React.FC<{ title: string; description: string; urlPath: string; }> = ({ title, description, urlPath }) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vattles.app';
    const fullUrl = `${baseUrl}${urlPath}`;

    return (
        <div className="bg-black/20 rounded-lg border border-gray-700/50 p-6">
            <h3 className="font-orbitron text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 mt-2 text-sm max-w-prose">{description}</p>
            <CopyableUrlField url={fullUrl} />
        </div>
    );
};

interface StreamingViewProps {
    onBack: () => void;
}

const StreamingView: React.FC<StreamingViewProps> = ({ onBack }) => {
    return (
        <div className="w-full max-w-screen-lg mx-auto animate-fade-in text-gray-200">
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">Streaming Overlays</h1>
                </div>
                <div className="w-[150px]"></div>
            </header>
            <main className="space-y-8">
                <p className="text-gray-300 text-center">
                    Use these URLs as a "Browser Source" in streaming software like OBS or Streamlabs to display live Vattle info on your stream.
                </p>
                <OverlayCard 
                    title="Live Vattle Stats" 
                    description="Shows the current Vattle theme and the live countdown timer. Ideal for the top corner of your stream during a battle. Replace 'YOUR_VATTLE_ID' with the actual ID of a live Vattle."
                    urlPath="/overlay/live-stats/YOUR_VATTLE_ID"
                />
                <OverlayCard 
                    title="Voting Results"
                    description="Displays the two app submissions side-by-side with live vote counts. Perfect for the voting phase of a Vattle. Replace 'YOUR_VATTLE_ID' with the ID of a Vattle in the voting phase."
                    urlPath="/overlay/voting/YOUR_VATTLE_ID"
                />
            </main>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default StreamingView;
