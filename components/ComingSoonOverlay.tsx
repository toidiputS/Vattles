
import React from 'react';
import { SparklesIcon } from './icons';

interface ComingSoonOverlayProps {
    title: string;
    onClick: () => void;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({ title, onClick }) => {
    return (
        <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 opacity-90 hover:opacity-100 group"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <div className="bg-purple-900/40 border border-purple-500/50 px-4 py-2 rounded-full flex items-center gap-2 transform transition-transform group-hover:scale-105 shadow-lg shadow-purple-900/20">
                <SparklesIcon className="h-5 w-5 text-purple-300 animate-pulse" />
                <span className="font-orbitron font-bold text-sm text-white tracking-widest uppercase">{title}</span>
            </div>
            <p className="mt-4 text-xs text-gray-400 font-semibold tracking-wider group-hover:text-purple-300 transition-colors">Click to join waitlist</p>
        </div>
    );
};

export default ComingSoonOverlay;
