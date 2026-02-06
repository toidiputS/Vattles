
import React, { useState, useMemo } from 'react';
import { VattleConfig, UserProfile, PromptLibraryItem } from '../types';
import BattleTimer from './BattleTimer';
import SubmissionModal from './SubmissionModal';
import { HtmlIcon, CssIcon, JsIcon, RefreshIcon, CodeBracketIcon, EyeIcon, DocumentArrowUpIcon, LockClosedIcon } from './icons';

interface BattleRoomProps {
  vattle: VattleConfig;
  onExit: () => void;
  onSubmit: (result: { files: any[], submissionUrl: string, description: string }) => void;
  userProfile: UserProfile;
  onSavePrompt: (prompt: PromptLibraryItem) => void;
  onDeletePrompt: (promptId: string) => void;
  onUpdateVibeTrack: (track: { title: string; isPlaying: boolean }) => void;
}

interface ProjectFile {
    name: 'index.html' | 'style.css' | 'script.js';
    language: 'html' | 'css' | 'javascript';
    content: string;
    icon: React.ReactNode;
}

const initialFiles: ProjectFile[] = [
    { name: 'index.html', language: 'html', icon: <HtmlIcon className="h-4 w-4 text-orange-400" />, content: `<!DOCTYPE html>
<html>
<head>
  <title>Vattle App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to the Arena</h1>
    <p>Start coding your vibe.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>` },
    { name: 'style.css', language: 'css', icon: <CssIcon className="h-4 w-4 text-blue-400" />, content: `body {
  font-family: sans-serif;
  background-color: #1a1a2e;
  color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
  padding: 2rem;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(0,0,0,0.2);
}

h1 {
  color: #c084fc;
}` },
    { name: 'script.js', language: 'javascript', icon: <JsIcon className="h-4 w-4 text-yellow-300" />, content: `console.log("System initialized.");` },
];

const BattleRoom: React.FC<BattleRoomProps> = ({ vattle, onExit, onSubmit, userProfile }) => {
    const isExpired = vattle.startTime ? Date.now() > vattle.startTime + vattle.timeLimit * 60 * 1000 : false;
    
    // Editor State
    const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
    const [activeFileName, setActiveFileName] = useState<ProjectFile['name']>('index.html');
    const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Used for visual feedback in modal
    
    // UI State
    const [mobileView, setMobileView] = useState<'code' | 'preview'>('code');
    const [refreshKey, setRefreshKey] = useState(0); // Forces iframe reload

    // Quick Battle Logic
    const isQuickBattle = vattle.timeLimit === 1;
    const [isLocked, setIsLocked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false); // Track if at least one submission made

    // --- MEMOIZED PREVIEWS ---
    const buildSrcDoc = (htmlContent: string, cssContent: string, jsContent: string) => `
        <!DOCTYPE html>
        <html>
            <head><style>${cssContent}</style></head>
            <body>
                ${htmlContent.replace(/<link.*href="style.css".*>/, '').replace(/<script.*src="script.js".*><\/script>/, '')}
                <script>${jsContent}</script>
            </body>
        </html>`;

    const previewSrcDoc = useMemo(() => {
        const html = files.find(f => f.name === 'index.html')?.content || '';
        const css = files.find(f => f.name === 'style.css')?.content || '';
        const js = files.find(f => f.name === 'script.js')?.content || '';
        return buildSrcDoc(html, css, js);
    }, [files, refreshKey]); // Depend on refreshKey to re-render if needed (though srcDoc update handles most)
    
    const activeFile = files.find(f => f.name === activeFileName)!;
    
    const handleSubmit = (submission: { submissionUrl: string; description: string }) => {
        setIsSubmitted(true); // Shows success in modal
        setTimeout(() => {
            setSubmissionModalOpen(false);
            setIsSubmitted(false); // Reset modal success state so it can be opened again for Standard battles
            
            if (isQuickBattle) {
                setIsLocked(true);
            }
            setHasSubmitted(true);
            
            onSubmit({
                files,
                submissionUrl: submission.submissionUrl,
                description: submission.description
            });
        }, 1500);
    };

    const handleFileContentChange = (newContent: string) => {
        if (isLocked) return;
        setFiles(currentFiles => currentFiles.map(file => file.name === activeFileName ? { ...file, content: newContent } : file));
    };
    
    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-full bg-[#0D0B14] text-white overflow-hidden">
            {/* --- HEADER --- */}
            {/* Increased height to h-20 to accommodate larger timer */}
            <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-800 bg-[#0D0B14] relative z-20">
                <div className="flex items-center gap-4 z-20">
                    <div className="font-orbitron font-bold text-lg text-purple-400 tracking-wider hidden sm:block">VATTLE</div>
                    <div className="bg-gray-800/50 px-3 py-1 rounded text-sm text-gray-300 border border-gray-700 truncate max-w-[100px] sm:max-w-xs" title={vattle.theme}>
                        {vattle.theme}
                    </div>
                </div>
                
                {/* Timer Centered & Prominent */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full flex flex-col items-center justify-center pointer-events-none">
                    {isQuickBattle && (
                        <div className="text-yellow-400 font-bold text-[10px] uppercase tracking-widest mb-1 shadow-black drop-shadow-md animate-pulse">
                            ⚡ QUICK BATTLE
                        </div>
                    )}
                    <div className="pointer-events-auto">
                        <BattleTimer startTime={vattle.startTime || Date.now()} timeLimit={vattle.timeLimit} size="lg" showIcon />
                    </div>
                </div>

                <button onClick={onExit} className="z-20 text-sm text-gray-500 hover:text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">
                    Exit
                </button>
            </header>

            {/* --- MAIN WORKSPACE --- */}
            <main className="flex-grow flex relative overflow-hidden">
                {/* CODE PANE */}
                <div className={`flex flex-col h-full w-full md:w-[55%] border-r border-gray-800 bg-[#100D20] ${mobileView === 'preview' ? 'hidden md:flex' : 'flex'}`}>
                    {/* File Tabs */}
                    <div className="h-10 flex bg-[#0D0B14] border-b border-gray-800">
                        {files.map(file => (
                            <button
                                key={file.name}
                                onClick={() => setActiveFileName(file.name)}
                                className={`flex items-center gap-2 px-4 text-sm border-r border-gray-800 transition-colors ${activeFileName === file.name ? 'bg-[#100D20] text-purple-300 border-t-2 border-t-purple-500' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                            >
                                {file.icon}
                                {file.name}
                            </button>
                        ))}
                    </div>
                    {/* Editor */}
                    <textarea 
                        value={activeFile.content}
                        onChange={(e) => handleFileContentChange(e.target.value)}
                        className={`flex-grow w-full bg-transparent p-4 font-mono text-sm text-gray-300 focus:outline-none resize-none leading-relaxed ${isLocked ? 'cursor-not-allowed opacity-70' : ''}`}
                        spellCheck="false"
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        readOnly={isLocked}
                    />
                </div>

                {/* PREVIEW PANE */}
                <div className={`flex flex-col h-full w-full md:w-[45%] bg-white ${mobileView === 'code' ? 'hidden md:flex' : 'flex'}`}>
                    {/* Preview Toolbar */}
                    <div className="h-10 flex items-center justify-between px-3 bg-gray-100 border-b border-gray-200 text-gray-500">
                        <div className="text-xs font-mono">localhost:3000</div>
                        <button onClick={triggerRefresh} className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Refresh Preview">
                            <RefreshIcon className="h-4 w-4" />
                        </button>
                    </div>
                    {/* Iframe */}
                    <div className="flex-grow relative bg-white">
                        <iframe 
                            key={refreshKey}
                            srcDoc={previewSrcDoc}
                            title="Live Preview"
                            className="absolute inset-0 w-full h-full border-0"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="h-14 flex-shrink-0 border-t border-gray-800 bg-[#0D0B14] flex items-center justify-between px-4">
                {/* Mobile Toggles */}
                <div className="flex md:hidden bg-gray-800 p-1 rounded-lg">
                    <button 
                        onClick={() => setMobileView('code')}
                        className={`p-2 rounded-md transition-colors ${mobileView === 'code' ? 'bg-gray-700 text-white shadow' : 'text-gray-400'}`}
                    >
                        <CodeBracketIcon className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setMobileView('preview')}
                        className={`p-2 rounded-md transition-colors ${mobileView === 'preview' ? 'bg-gray-700 text-white shadow' : 'text-gray-400'}`}
                    >
                        <EyeIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                     <div className="hidden md:block text-xs text-gray-500">
                        Auto-saved
                    </div>
                    {isLocked && <div className="text-green-400 text-xs sm:text-sm font-bold flex items-center gap-2 animate-pulse">✅ Submission locked! Waiting for results...</div>}
                </div>

                <button 
                    onClick={() => setSubmissionModalOpen(true)}
                    disabled={isLocked || isExpired}
                    className={`flex items-center gap-2 font-bold py-2 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isLocked ? 'bg-gray-700 text-gray-400 shadow-none' : hasSubmitted ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20'}`}
                >
                    {isLocked ? (
                         <><LockClosedIcon className="h-5 w-5" /> Locked</>
                    ) : hasSubmitted ? (
                         <><DocumentArrowUpIcon className="h-5 w-5" /> Update Code</>
                    ) : (
                         <><DocumentArrowUpIcon className="h-5 w-5" /> Submit Code</>
                    )}
                </button>
            </footer>

            <SubmissionModal isOpen={isSubmissionModalOpen} onClose={() => setSubmissionModalOpen(false)} onSubmit={handleSubmit} isExpired={isExpired} isSubmitted={isSubmitted}/>
        </div>
    );
};

export default BattleRoom;
