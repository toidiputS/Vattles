
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrainIcon, ClipboardIcon, CodeBracketIcon, HistoryIcon, TrashIcon, MonitorIcon, ChevronRightIcon } from './icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface LabEditorProps {
    initialPrompt?: string;
}

interface Generation {
  id: string;
  prompt: string;
  code: { html: string; css: string; js: string };
  timestamp: number;
}

const LabEditor: React.FC<LabEditorProps> = ({ initialPrompt }) => {
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [history, setHistory] = useLocalStorage<Generation[]>('vibe-labs-history', []);
    const [currentGen, setCurrentGen] = useState<Generation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if(initialPrompt) {
            setPrompt(initialPrompt);
        }
    }, [initialPrompt]);

    useEffect(() => {
        // Load latest generation if available and not currently set
        if (history.length > 0 && !currentGen && !initialPrompt) {
            setCurrentGen(history[0]);
        }
        
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [history, currentGen, initialPrompt]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        if (isMobile) setActiveTab('preview');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemPrompt = `You are an expert web development assistant. 
            Generate a component based on the user prompt.
            Return STRICT JSON with keys: "html", "css", "js".
            
            IMPORTANT: 
            1. Write robust Vanilla JS.
            2. Use event.stopPropagation() in event listeners if the component has interactive child elements (like dropdowns) to prevent bubbling issues.
            3. Do not include markdown formatting.`;
            
            const response = await ai.models.generateContent({ 
                model: 'gemini-3-pro-preview', 
                contents: `${systemPrompt}\n\nUser Prompt: "${prompt}"`, 
                config: { responseMimeType: 'application/json' }
            });

            // The response.text should be a JSON string.
            const jsonResponse = JSON.parse(response.text || "{}");
            
            const newGen: Generation = {
                id: Date.now().toString(),
                prompt,
                code: {
                  html: jsonResponse.html || '',
                  css: jsonResponse.css || '',
                  js: jsonResponse.js || ''
                },
                timestamp: Date.now()
            };

            setHistory(prev => [newGen, ...prev]);
            setCurrentGen(newGen);

        } catch (e) {
            console.error(e);
            alert('Failed to generate component. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory(prev => prev.filter(g => g.id !== id));
        if (currentGen?.id === id) setCurrentGen(null);
    };

    const handleCopy = () => {
        if (!currentGen) return;
        const fullCode = `
<style>
${currentGen.code.css}
</style>
${currentGen.code.html}
<script>
${currentGen.code.js}
</script>
        `;
        navigator.clipboard.writeText(fullCode);
    };

    const constructPreview = () => {
        if (!currentGen) return '';
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: transparent; font-family: sans-serif; }
                /* Hide scrollbar in preview */
                ::-webkit-scrollbar { display: none; }
                ${currentGen.code.css}
              </style>
            </head>
            <body>
              ${currentGen.code.html}
              <script>
                try {
                  ${currentGen.code.js}
                } catch(e) { console.error("Preview JS Error:", e); }
              </script>
            </body>
          </html>
        `;
    };

    const HistoryList = () => (
        <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 transparent' }}>
          {history.map(gen => (
            <div 
              key={gen.id} 
              onClick={() => { setCurrentGen(gen); if(isMobile) setActiveTab('preview'); }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${currentGen?.id === gen.id ? 'bg-purple-900/40 border-purple-500' : 'bg-gray-800/40 border-gray-700 hover:border-gray-500'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-purple-300 font-mono">{new Date(gen.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <button onClick={(e) => handleDeleteHistory(gen.id, e)} className="text-gray-500 hover:text-red-400 transition-colors"><TrashIcon className="h-3 w-3"/></button>
              </div>
              <p className="text-xs text-gray-300 line-clamp-2">{gen.prompt}</p>
            </div>
          ))}
          {history.length === 0 && <p className="text-center text-xs text-gray-500 mt-4">No history yet.</p>}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[500px]">
            {/* Left Panel: Editor & History */}
            <div className={`col-span-1 lg:col-span-4 flex flex-col gap-4 h-full ${isMobile && activeTab === 'preview' ? 'hidden' : 'flex'}`}>
                
                {/* Mobile Tabs */}
                {isMobile && (
                    <div className="flex border-b border-gray-700 mb-2">
                        <button onClick={() => setActiveTab('editor')} className={`flex-1 py-2 text-sm font-bold ${activeTab === 'editor' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500'}`}>EDITOR</button>
                        <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-sm font-bold ${activeTab === 'history' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500'}`}>HISTORY</button>
                    </div>
                )}

                {/* Editor Tab Content */}
                <div className={`${(isMobile && activeTab !== 'editor') ? 'hidden' : 'flex'} flex-col h-full`}>
                    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 flex-grow flex flex-col">
                        <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2"><CodeBracketIcon className="h-4 w-4 text-teal-400"/> INPUT PARAMETERS</h3>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your component (e.g., 'A glassmorphism credit card with a holographic sheen')..."
                            className="w-full flex-grow bg-black/50 border border-gray-600 rounded-md p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 font-orbitron font-bold rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 text-white transition-all shadow-lg"
                        >
                            {isLoading ? 'Synthesizing...' : <><BrainIcon className="h-5 w-5"/> GENERATE VIBE</>}
                        </button>
                    </div>

                    {/* Desktop History (Bottom Left) */}
                    {!isMobile && (
                        <div className="h-1/3 mt-4 border-t border-gray-700 pt-4 flex flex-col min-h-0">
                            <h3 className="font-orbitron text-xs font-bold text-gray-500 mb-2 flex items-center gap-2"><HistoryIcon className="h-3 w-3"/> RECENT VIBES</h3>
                            <HistoryList />
                        </div>
                    )}
                </div>

                {/* Mobile History Tab Content */}
                {isMobile && activeTab === 'history' && <HistoryList />}
            </div>

            {/* Right Panel: Preview & Code */}
            <div className={`col-span-1 lg:col-span-8 flex flex-col h-full ${isMobile && activeTab !== 'preview' ? 'hidden' : 'flex'}`}>
                {/* Mobile Back Button */}
                {isMobile && (
                    <button onClick={() => setActiveTab('editor')} className="text-gray-400 flex items-center gap-1 text-sm mb-2 hover:text-white">
                        <ChevronRightIcon className="rotate-180 h-4 w-4" /> Back to Editor
                    </button>
                )}

                <div className="bg-black/40 rounded-lg border border-gray-700 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-3 right-3 z-20">
                         {currentGen && (
                            <button onClick={handleCopy} className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md transition-all shadow-lg" title="Copy Code">
                                <ClipboardIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                            <div className="text-center">
                                <svg className="animate-spin h-10 w-10 text-purple-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="font-orbitron text-purple-300 animate-pulse tracking-widest text-sm">ASSEMBLING VIBE...</p>
                            </div>
                        </div>
                    ) : !currentGen ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col gap-3">
                            <MonitorIcon className="h-16 w-16 opacity-20" />
                            <p className="font-orbitron tracking-widest text-sm opacity-50">SYSTEM IDLE</p>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                            <iframe 
                                srcDoc={constructPreview()}
                                title="Component Preview"
                                className="w-full h-full border-0"
                                sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
                            />
                        </div>
                    )}
                </div>
                
                {/* Code Snippet Preview (Bottom Right) - Optional or Toggleable */}
                {currentGen && !isMobile && (
                    <div className="mt-4 h-32 bg-gray-900/80 rounded-lg border border-gray-700 p-3 overflow-auto font-mono text-xs text-gray-400">
                        <div className="mb-1 text-purple-400 font-bold uppercase">Generated CSS Preview:</div>
                        <pre>{currentGen.code.css}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LabEditor;
