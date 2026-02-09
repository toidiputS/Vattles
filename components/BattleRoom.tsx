
import React, { useState, useEffect, useRef } from 'react';
import { VattleConfig, UserProfile, PromptLibraryItem } from '../types';
import BattleTimer from './BattleTimer';
import SubmissionModal from './SubmissionModal';
import { SparklesIcon, DocumentArrowUpIcon, LockClosedIcon, EyeIcon, CodeBracketIcon } from './icons';
import { getRandomTheme } from '../lib/themes';
import { GoogleGenAI } from '@google/genai';

interface BattleRoomProps {
    vattle: VattleConfig;
    onExit: () => void;
    onSubmit: (result: { files: any[], submissionUrl: string, description: string }) => void;
    userProfile: UserProfile;
    onSavePrompt: (prompt: PromptLibraryItem) => void;
    onDeletePrompt: (promptId: string) => void;
    onUpdateVibeTrack: (track: { title: string; isPlaying: boolean }) => void;
}

const BattleRoom: React.FC<BattleRoomProps> = ({ vattle, onExit, onSubmit, userProfile }) => {
    const isExpired = vattle.startTime ? Date.now() > vattle.startTime + vattle.timeLimit * 60 * 1000 : false;

    // --- VIBE STATE ---
    const [prompt, setPrompt] = useState('');
    const [promptHistory, setPromptHistory] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState({ html: '', css: '', js: '' });
    const [previewSrcDoc, setPreviewSrcDoc] = useState('<html><body style="background:#1a1a2e;color:#e0e0e0;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;"><p style="opacity:0.5;">Your vibe will appear here...</p></body></html>');
    const [showCode, setShowCode] = useState(false);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    // --- SUBMISSION STATE ---
    const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // --- THEME REVEAL ---
    const isRevealingInitial = vattle.theme === 'RANDOM_SECRET' && vattle.status === 'active' && !isExpired;
    const [revealedTheme, setRevealedTheme] = useState<string>(vattle.theme === 'RANDOM_SECRET' ? '???' : vattle.theme);
    const [isRevealing, setIsRevealing] = useState(isRevealingInitial);
    const [shuffledChars, setShuffledChars] = useState('');

    useEffect(() => {
        if (vattle.theme === 'RANDOM_SECRET' && isRevealingInitial) {
            const actual = getRandomTheme();
            const revealDuration = 3000;
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                elapsed += interval;
                if (elapsed >= revealDuration) {
                    setRevealedTheme(actual);
                    setIsRevealing(false);
                    clearInterval(timer);
                } else {
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
                    let randomStr = "";
                    for (let i = 0; i < 15; i++) randomStr += chars[Math.floor(Math.random() * chars.length)];
                    setShuffledChars(randomStr);
                }
            }, interval);
            return () => clearInterval(timer);
        } else if (vattle.theme === 'RANDOM_SECRET') {
            setRevealedTheme(getRandomTheme());
            setIsRevealing(false);
        }
    }, [vattle.theme, vattle.status, isExpired]);

    // --- AUTO-SUBMIT ON TIMEOUT ---
    useEffect(() => {
        if (!vattle.startTime || isLocked) return;

        const battleEndTime = vattle.startTime + vattle.timeLimit * 60 * 1000;
        const timeRemaining = battleEndTime - Date.now();

        if (timeRemaining <= 0) {
            if (generatedCode.html && !isLocked) {
                handleAutoSubmit();
            }
            return;
        }

        const autoSubmitTimer = setTimeout(() => {
            if (generatedCode.html && !isLocked) {
                handleAutoSubmit();
            }
        }, timeRemaining);

        return () => clearTimeout(autoSubmitTimer);
    }, [vattle.startTime, vattle.timeLimit, isLocked, generatedCode.html]);

    const handleAutoSubmit = () => {
        if (isLocked) return;
        setIsLocked(true);
        onSubmit({
            files: [{ name: 'index.html', content: generatedCode.html }],
            submissionUrl: '',
            description: `Auto-submitted vibe for theme: ${revealedTheme}`
        });
    };

    // Mock vibe generator for when API is unavailable
    const generateMockVibe = (userPrompt: string) => {
        const colors = ['#c084fc', '#22d3ee', '#f472b6', '#facc15', '#4ade80', '#fb923c'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const mockHtml = `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    background: linear-gradient(135deg, #0D0B14 0%, #1a1a2e 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', sans-serif;
    color: #fff;
    padding: 20px;
    text-align: center;
}
.vibe-card {
    background: rgba(255,255,255,0.05);
    border: 2px solid ${randomColor};
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    box-shadow: 0 0 40px ${randomColor}40, inset 0 0 20px ${randomColor}10;
    animation: float 3s ease-in-out infinite;
}
h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    background: linear-gradient(90deg, ${randomColor}, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.theme-badge {
    display: inline-block;
    background: ${randomColor}30;
    border: 1px solid ${randomColor};
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.8em;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
}
.prompt-text {
    font-size: 1.2em;
    color: #ccc;
    line-height: 1.6;
    margin-top: 15px;
}
.mock-notice {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #f59e0b30;
    border: 1px solid #f59e0b;
    color: #fbbf24;
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 0.75em;
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
</style>
</head>
<body>
    <div class="mock-notice">⚠️ Demo Mode (API Quota Exceeded)</div>
    <div class="vibe-card">
        <div class="theme-badge">${revealedTheme}</div>
        <h1>Your Vibe</h1>
        <p class="prompt-text">"${userPrompt}"</p>
    </div>
</body>
</html>`;
        setPreviewSrcDoc(mockHtml);
        setGeneratedCode({ html: mockHtml, css: '', js: '' });
    };

    // --- GEMINI INTEGRATION ---
    const generateVibe = async () => {
        if (!prompt.trim() || isGenerating || isLocked) return;

        const currentPrompt = prompt;
        setIsGenerating(true);
        setPromptHistory(prev => [...prev, currentPrompt]);
        setPrompt('');

        const systemPrompt = `You are a creative web developer AI. The user is in a 60-second "Vibe Coding" battle.
The theme is: "${revealedTheme}".
The user's request is: "${currentPrompt}".

Generate a SINGLE, visually stunning, self-contained HTML page that matches the user's vibe request and the theme.
- Use inline <style> for CSS.
- Use inline <script> for JS if needed.
- Make it VISUALLY IMPRESSIVE. Use gradients, animations, shadows, and modern CSS.
- The design should feel premium and high-vibe.
- Do NOT use any external libraries or CDNs.
- Do NOT include any explanations, just the raw HTML code.
- The output MUST be a complete, valid HTML document starting with <!DOCTYPE html>.`;

        try {
            // Access Vite environment variable - same pattern as LabEditor
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            console.log('[Vattles] API Key present:', !!apiKey);

            if (!apiKey) {
                console.warn('[Vattles] No API key found - using mock mode');
                generateMockVibe(currentPrompt);
                setIsGenerating(false);
                promptInputRef.current?.focus();
                return;
            }

            console.log('[Vattles] Calling Gemini API...');
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp', // Correct model name for v1beta
                contents: systemPrompt,
            });

            console.log('[Vattles] API Response received:', response);
            let rawOutput = response.text || '';
            console.log('[Vattles] Raw output length:', rawOutput.length);

            rawOutput = rawOutput.replace(/```html\n?/gi, '').replace(/```\n?/gi, '').trim();

            if (rawOutput.startsWith('<!DOCTYPE html>') || rawOutput.startsWith('<html')) {
                setPreviewSrcDoc(rawOutput);
                setGeneratedCode({ html: rawOutput, css: '', js: '' });
            } else {
                const wrappedHtml = `<!DOCTYPE html><html><head><style>body{background:#1a1a2e;color:#e0e0e0;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;}</style></head><body>${rawOutput}</body></html>`;
                setPreviewSrcDoc(wrappedHtml);
                setGeneratedCode({ html: wrappedHtml, css: '', js: '' });
            }
        } catch (err: any) {
            console.error('[Vattles] Gemini Error:', err);
            console.error('[Vattles] Error message:', err.message);
            console.error('[Vattles] Full error object:', JSON.stringify(err, null, 2));

            // Check if it's a quota error
            const errorMsg = err.message?.toLowerCase() || '';
            if (errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('resource_exhausted') || errorMsg.includes('rate')) {
                console.warn('[Vattles] API Quota exceeded - using mock mode');
                generateMockVibe(currentPrompt);
            } else {
                setPreviewSrcDoc(`<html><body style="background:#1a1a2e;color:red;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;padding:20px;"><div><p style="font-size:1.2em;">Vibe Generation Failed</p><p style="opacity:0.7;font-size:0.9em;">${err.message || 'Unknown error'}</p></div></body></html>`);
            }
        } finally {
            setIsGenerating(false);
            promptInputRef.current?.focus();
        }
    };

    const handleSubmit = (submission: { submissionUrl: string; description: string }) => {
        setIsSubmitted(true);
        setTimeout(() => {
            setSubmissionModalOpen(false);
            setIsSubmitted(false);
            setIsLocked(true);
            onSubmit({
                files: [{ name: 'index.html', content: generatedCode.html }],
                submissionUrl: submission.submissionUrl,
                description: submission.description
            });
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateVibe();
        }
    };

    return (
        <div className="flex flex-col h-full bg-vattles-bg text-white overflow-hidden">
            {/* --- HEADER --- */}
            <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-800/50 bg-vattles-bg relative z-20">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <div className="font-orbitron font-black text-xl text-white tracking-tighter flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            VATTLE <span className="text-purple-500 opacity-50 font-normal">VIBE</span>
                        </div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em] -mt-1 ml-4 opacity-70">Prompt-Driven Battle</div>
                    </div>

                    <div className="h-8 w-px bg-gray-800 hidden sm:block" />

                    <div className={`relative px-4 py-1 rounded-full border transition-all duration-500 flex items-center gap-3 overflow-hidden ${isRevealing ? 'bg-purple-900/20 border-purple-500/30' : 'bg-gray-900/40 border-gray-800'}`}>
                        {isRevealing && <div className="absolute inset-0 bg-linear-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />}
                        <div className="flex flex-col">
                            <span className="text-[8px] font-orbitron text-purple-400 uppercase tracking-widest leading-none">
                                {isRevealing ? 'Decrypting...' : 'Battle Theme'}
                            </span>
                            <div className={`text-xs font-bold truncate max-w-[200px] ${isRevealing ? 'font-mono text-purple-200 animate-pulse' : 'text-gray-100'}`}>
                                {isRevealing ? shuffledChars : revealedTheme}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <BattleTimer startTime={vattle.startTime || Date.now()} timeLimit={vattle.timeLimit} size="md" showIcon />
                    <div className="w-px h-6 bg-gray-800 ml-2" />
                    <button onClick={onExit} className="text-xs font-bold text-gray-500 hover:text-white px-4 py-1.5 rounded-full border border-transparent hover:border-gray-700 hover:bg-gray-800/50 transition-all uppercase tracking-widest">
                        Abort
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="grow flex flex-col lg:flex-row overflow-hidden">
                {/* PREVIEW PANE - THE STAR OF THE SHOW */}
                <div className="grow flex flex-col bg-white relative order-1 lg:order-2 h-1/2 lg:h-full">
                    <div className="h-10 flex items-center justify-between px-4 bg-gray-100 border-b border-gray-200 text-gray-600">
                        <div className="text-xs font-mono flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-2">live-preview</span>
                        </div>
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className="flex items-center gap-1 text-xs hover:text-gray-900 transition-colors"
                            title="Toggle Code View"
                        >
                            {showCode ? <EyeIcon className="h-4 w-4" /> : <CodeBracketIcon className="h-4 w-4" />}
                            {showCode ? 'Hide Code' : 'View Code'}
                        </button>
                    </div>
                    <div className="grow relative">
                        {showCode ? (
                            <pre className="absolute inset-0 overflow-auto p-4 bg-gray-900 text-green-400 text-xs font-mono">{generatedCode.html || '// No code generated yet'}</pre>
                        ) : (
                            <iframe
                                srcDoc={previewSrcDoc}
                                title="Vibe Preview"
                                className="absolute inset-0 w-full h-full border-0"
                                sandbox="allow-scripts"
                            />
                        )}
                    </div>
                </div>

                {/* PROMPT CONSOLE */}
                <div className="w-full lg:w-[400px] flex flex-col bg-vattles-bg border-t lg:border-t-0 lg:border-r border-gray-800 order-2 lg:order-1 h-1/2 lg:h-full">
                    {/* Prompt History */}
                    <div className="grow overflow-y-auto p-4 space-y-3">
                        {promptHistory.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p className="font-semibold">Describe Your Vibe</p>
                                <p className="text-sm mt-1 opacity-70">Type what you want to see and hit Enter.</p>
                                <p className="text-xs mt-4 text-purple-400/60 italic">Theme: {revealedTheme}</p>
                            </div>
                        ) : (
                            promptHistory.map((p, i) => (
                                <div key={i} className="bg-purple-900/20 border border-purple-500/20 rounded-lg px-4 py-3 text-sm text-purple-200">
                                    <span className="text-purple-500 font-bold mr-2">#{i + 1}</span>
                                    {p}
                                </div>
                            ))
                        )}
                        {isGenerating && (
                            <div className="flex items-center gap-3 text-purple-400 animate-pulse">
                                <SparklesIcon className="h-5 w-5 animate-spin" />
                                <span>Generating vibe...</span>
                            </div>
                        )}
                    </div>

                    {/* Prompt Input */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="relative">
                            <textarea
                                ref={promptInputRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Describe your ${revealedTheme} vibe...`}
                                disabled={isLocked || isGenerating || isExpired}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={generateVibe}
                                disabled={!prompt.trim() || isGenerating || isLocked || isExpired}
                                className="absolute bottom-3 right-3 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30"
                                title="Generate Vibe (Enter)"
                            >
                                <SparklesIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to generate • Shift+Enter for new line</p>
                    </div>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="h-14 shrink-0 border-t border-gray-800 bg-vattles-bg flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {isLocked && (
                        <div className="text-green-400 text-sm font-bold flex items-center gap-2 animate-pulse">
                            <LockClosedIcon className="h-4 w-4" /> Vibe Locked! Waiting for results...
                        </div>
                    )}
                    {!isLocked && promptHistory.length > 0 && (
                        <div className="text-gray-500 text-xs">
                            {promptHistory.length} prompt{promptHistory.length > 1 ? 's' : ''} sent
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setSubmissionModalOpen(true)}
                    disabled={isLocked || isExpired || !generatedCode.html}
                    className={`flex items-center gap-2 font-bold py-2 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isLocked ? 'bg-gray-700 text-gray-400 shadow-none' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20'}`}
                >
                    {isLocked ? (
                        <><LockClosedIcon className="h-5 w-5" /> Locked</>
                    ) : (
                        <><DocumentArrowUpIcon className="h-5 w-5" /> Submit Vibe</>
                    )}
                </button>
            </footer>

            <SubmissionModal isOpen={isSubmissionModalOpen} onClose={() => setSubmissionModalOpen(false)} onSubmit={handleSubmit} isExpired={isExpired} isSubmitted={isSubmitted} />
        </div>
    );
};

export default BattleRoom;
