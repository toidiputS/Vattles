import React, { useState, useEffect } from 'react';
import { useSystem } from '../../stores/system';
import { useLibrary } from '../../stores/library';

type Props = {
    onEnterWorld: () => void;
};

export const LandingPage = ({ onEnterWorld }: Props) => {
    const login = useSystem(s => s.login);
    const setLibraryCard = useLibrary(s => s.setLibraryCard);
    
    // Reference the image directly from the public folder
    const portalBg = '/assets/portals-1.png';
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // Phases: 'form' -> 'greeting' (Audio plays) -> 'entering' (Fade to library)
    const [phase, setPhase] = useState<'form' | 'greeting' | 'entering'>('form');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        // 1. Set Identity & Start Background Loading immediately
        setLibraryCard(name);
        onEnterWorld();

        // 2. Transition to Greeting Phase
        setPhase('greeting');

        // 3. Play Audio Greeting
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Hello, ${name}. Welcome to the Archives.`);
            utterance.rate = 0.9;
            utterance.pitch = 0.9;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }

        // 4. Sequence Transitions
        setTimeout(() => {
            setPhase('entering');
        }, 2500);

        setTimeout(() => {
            login(name, email);
        }, 4500);
    };

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden font-sans text-white transition-opacity duration-[2000ms] ease-in-out ${phase === 'entering' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: '#000' }}>
            
            {/* BACKGROUND LAYER: Portal Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={portalBg}
                    className="w-full h-full object-cover"
                    alt="Portal Atmosphere"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30 z-[1]"></div>
            </div>
            
            {/* CONTENT LAYER */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center transition-transform duration-[3000ms] ease-in-out ${phase === 'entering' ? 'scale-110' : 'scale-100'}`}>
                
                {/* LOGIN CARD */}
                <div className={`w-full max-w-[420px] p-6 text-center transition-all duration-1000 ${phase !== 'form' ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                    
                    {/* The Reference UI Card - Dark Minimalist */}
                    <div className="bg-[#050505]/80 backdrop-blur-md border border-[#333] rounded-[32px] p-10 shadow-2xl">
                        <div className="mb-10 space-y-2">
                            <h3 className="text-white text-lg font-medium tracking-wide">Welcome to</h3>
                            <h1 className="text-4xl font-bold text-white tracking-tight">The Youniverse</h1>
                            <p className="text-[#666] text-xs font-medium pt-2 tracking-wide">No Hero. No Guru. Just a New You.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#111] border border-[#222] hover:border-[#444] focus:border-[#666] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:outline-none transition-all text-left"
                                    placeholder="First Name"
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#111] border border-[#222] hover:border-[#444] focus:border-[#666] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:outline-none transition-all text-left"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full mt-4 group relative flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:bg-[#222] hover:border-[#555] text-white rounded-full py-4 font-medium tracking-wide transition-all overflow-hidden"
                            >
                                {/* Sparkle Icon */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transition-colors">
                                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
                                </svg>
                                <span>EnterTheYouniverse</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* GREETING PHASE */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'greeting' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] mb-4 px-4 text-center">
                        Welcome, {name}
                    </h1>
                    <div className="h-1 w-24 bg-cyan-500 rounded-full mb-4 animate-pulse"></div>
                </div>

            </div>
        </div>
    );
};