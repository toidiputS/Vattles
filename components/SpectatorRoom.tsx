
import React, { useState, useMemo, useEffect } from 'react';
import { VattleConfig, ChatMessage, UserProfile } from '../types';
import BattleTimer from './BattleTimer';
import ChatSidebar from './ChatSidebar';
import { HtmlIcon, CssIcon, JsIcon, CursorArrowRaysIcon, ChevronRightIcon, CodeBracketIcon, EyeIcon, MonitorIcon } from './icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SpectatorRoomProps {
  vattle: VattleConfig;
  onExit: () => void;
  userProfile: UserProfile;
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
    <h1>Welcome to the Vattle!</h1>
    <p>Start building your vibe.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>` },
    { name: 'style.css', language: 'css', icon: <CssIcon className="h-4 w-4 text-blue-400" />, content: `body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #1a1a2e;
  color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.container { text-align: center; }
h1 {
  color: #c084fc;
  text-shadow: 0 0 15px rgba(192, 132, 252, 0.5);
  font-size: 3rem;
  margin-bottom: 0.5rem;
}` },
    { name: 'script.js', language: 'javascript', icon: <JsIcon className="h-4 w-4 text-yellow-300" />, content: `console.log("Vattle script loaded!");

document.querySelector('h1').addEventListener('click', () => {
  document.body.style.backgroundColor = '#0f0c1a';
  alert('Vibe shifted!');
});` },
];

const initialFilesP2: ProjectFile[] = [
    { name: 'index.html', language: 'html', icon: <HtmlIcon className="h-4 w-4 text-orange-400" />, content: `<!DOCTYPE html>
<html>
<head>
  <title>Vattle App B</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>A Challenger Appears!</h1>
  <p>Vibing on a different frequency.</p>
  <script src="script.js"></script>
</body>
</html>` },
    { name: 'style.css', language: 'css', icon: <CssIcon className="h-4 w-4 text-blue-400" />, content: `body {
  font-family: monospace;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  margin: 0;
}

h1 {
  color: #27ae60;
  text-shadow: 0 0 8px #27ae60;
  font-size: 2.5rem;
}` },
    { name: 'script.js', language: 'javascript', icon: <JsIcon className="h-4 w-4 text-yellow-300" />, content: `console.log("Challenger script loaded!");` },
];

const getInitialChatMessages = (theme: string): ChatMessage[] => [
    { 
        id: 1,
        user: 'System', 
        avatar: 'SYS', 
        message: `Welcome to the Vattle: "${theme}"! The chat is now live. Be respectful and have fun.`, 
        color: 'text-gray-500' 
    }
];

const SpectatorRoom: React.FC<SpectatorRoomProps> = ({ vattle, onExit, userProfile }) => {
    // --- SPECTATOR STATE ---
    const isExpired = vattle.startTime ? Date.now() > vattle.startTime + vattle.timeLimit * 60 * 1000 : false;
    const p1Name = vattle.creatorName;
    const p2Name = vattle.studentName || vattle.invitedOpponent;

    const [spectatorView, setSpectatorView] = useState<'side-by-side' | 'p1' | 'p2'>('side-by-side');
    const [filesP1] = useState<ProjectFile[]>(initialFiles);
    const [activeFileNameP1, setActiveFileNameP1] = useState<ProjectFile['name']>('index.html');
    const [filesP2] = useState<ProjectFile[]>(initialFilesP2);
    const [activeFileNameP2, setActiveFileNameP2] = useState<ProjectFile['name']>('index.html');
    const [pingToolActive, setPingToolActive] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Chat State (Global)
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>(`vattles-chat-${vattle.id}`, getInitialChatMessages(vattle.theme));
    const [newMessage, setNewMessage] = useState('');

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
    
    const previewSrcDocP1 = useMemo(() => {
        const html = filesP1.find(f => f.name === 'index.html')?.content || '';
        const css = filesP1.find(f => f.name === 'style.css')?.content || '';
        const js = filesP1.find(f => f.name === 'script.js')?.content || '';
        return buildSrcDoc(html, css, js);
    }, [filesP1]);

    const previewSrcDocP2 = useMemo(() => {
        const html = filesP2.find(f => f.name === 'index.html')?.content || '';
        const css = filesP2.find(f => f.name === 'style.css')?.content || '';
        const js = filesP2.find(f => f.name === 'script.js')?.content || '';
        return buildSrcDoc(html, css, js);
    }, [filesP2]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const userMessage: ChatMessage = { id: Date.now(), user: userProfile.name, avatar: userProfile.name.substring(0,2).toUpperCase(), message: newMessage.trim(), color: 'text-yellow-300' };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
    };

    const ReadOnlyWorkspace: React.FC<{
        participantName: string;
        participantId: 'p1' | 'p2';
        files: ProjectFile[];
        activeFileName: ProjectFile['name'];
        setActiveFileName: (name: ProjectFile['name']) => void;
        previewSrc: string;
        initialViewMode?: 'split' | 'code' | 'preview';
    }> = ({ participantName, participantId, files, activeFileName, setActiveFileName, previewSrc, initialViewMode = 'split' }) => {
        const activeFile = files.find(f => f.name === activeFileName)!;
        const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>(initialViewMode);
        
        const handlePing = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!pingToolActive) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            localStorage.setItem(`vattle-ping-${vattle.id}-${participantId}`, JSON.stringify({ x, y, timestamp: Date.now() }));
            setPingToolActive(false);
        };
        
        return (
            <div className="bg-[#151221] rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col h-full relative group transition-all duration-300 hover:border-purple-500/60">
                {/* Header */}
                <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 p-2 sm:p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white border border-white/20 shadow-inner flex-shrink-0">
                                {participantName.charAt(0)}
                            </div>
                            <span className="font-orbitron font-bold text-white tracking-wide truncate">{participantName}</span>
                         </div>
                    </div>
                    
                    {/* View Toggles */}
                    <div className="flex bg-black/40 rounded-lg p-1 border border-gray-700/50 flex-shrink-0">
                        <button onClick={() => setViewMode('code')} className={`p-1.5 rounded transition-all ${viewMode === 'code' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`} title="Code Only"><CodeBracketIcon className="h-4 w-4"/></button>
                        <button onClick={() => setViewMode('split')} className={`p-1.5 rounded transition-all ${viewMode === 'split' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`} title="Split View"><MonitorIcon className="h-4 w-4"/></button>
                        <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded transition-all ${viewMode === 'preview' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`} title="Preview Only"><EyeIcon className="h-4 w-4"/></button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow flex min-h-0 relative">
                     {/* Code Editor Side */}
                     <div className={`${viewMode === 'preview' ? 'hidden' : viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-800 bg-[#0D0B14] transition-all duration-300`}>
                        {/* Compact File Tabs */}
                        <div className="flex bg-[#0D0B14] border-b border-gray-800 overflow-x-auto scrollbar-hide">
                            {files.map(file => (
                                <button
                                    key={file.name}
                                    onClick={() => setActiveFileName(file.name)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-r border-gray-800 transition-colors whitespace-nowrap ${activeFileName === file.name ? 'bg-[#151221] text-purple-300 border-t-2 border-t-purple-500' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                                >
                                    {file.icon}
                                    {file.name}
                                </button>
                            ))}
                        </div>
                        <textarea value={activeFile.content} readOnly className="w-full h-full bg-transparent p-4 text-gray-300 font-mono text-xs sm:text-sm focus:outline-none resize-none" />
                     </div>

                     {/* Preview Side */}
                     <div className={`${viewMode === 'code' ? 'hidden' : viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-white relative transition-all duration-300`} onClick={handlePing}>
                         {pingToolActive && (
                            <div className="absolute inset-0 bg-teal-500/20 z-10 flex items-center justify-center text-white font-bold text-lg animate-pulse cursor-crosshair backdrop-blur-[1px]">
                                Click to Ping
                            </div>
                        )}
                        <iframe srcDoc={previewSrc} title={`${participantName} Live Preview`} className="w-full h-full border-0" sandbox="allow-scripts" />
                     </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-[#0D0B14] overflow-hidden text-gray-200">
            {/* Header */}
            <header className="h-16 flex-shrink-0 bg-[#151221]/90 border-b border-gray-700/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-20 relative shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold">
                        &larr; Exit
                    </button>
                    <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>
                    <div>
                        <h1 className="font-orbitron text-lg sm:text-xl text-white font-bold tracking-wider truncate max-w-[200px] sm:max-w-md">{vattle.theme}</h1>
                        <p className="text-gray-400 text-xs hidden sm:block">{p1Name} vs. {p2Name}</p>
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {isExpired ? (
                        <div className="font-orbitron text-2xl font-bold text-red-500 animate-pulse">ENDED</div>
                    ) : (
                        <BattleTimer startTime={vattle.startTime || Date.now()} timeLimit={vattle.timeLimit} size="md" />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-gray-700/50">
                        <button onClick={() => setSpectatorView('side-by-side')} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${spectatorView === 'side-by-side' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Split</button>
                        <button onClick={() => setSpectatorView('p1')} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${spectatorView === 'p1' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{p1Name}</button>
                        <button onClick={() => setSpectatorView('p2')} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${spectatorView === 'p2' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>{p2Name}</button>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className={`p-2 rounded-lg transition-colors border ${isSidebarOpen ? 'bg-purple-600 text-white border-purple-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'}`}
                        aria-label="Toggle Sidebar"
                    >
                        <ChevronRightIcon className={`h-5 w-5 transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
                    </button>
                </div>
            </header>

            <div className="flex-grow flex overflow-hidden relative">
                {/* Main Content Area */}
                <main className="flex-grow flex flex-col min-w-0 transition-all duration-300 ease-in-out p-4 gap-4">
                    {/* View Controls Mobile (if needed) could go here */}
                    
                    <div className="flex-grow relative">
                        {spectatorView === 'side-by-side' && (
                            <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <ReadOnlyWorkspace participantName={p1Name} participantId="p1" files={filesP1} activeFileName={activeFileNameP1} setActiveFileName={setActiveFileNameP1} previewSrc={previewSrcDocP1} />
                                <ReadOnlyWorkspace participantName={p2Name || "Opponent"} participantId="p2" files={filesP2} activeFileName={activeFileNameP2} setActiveFileName={setActiveFileNameP2} previewSrc={previewSrcDocP2} />
                            </div>
                        )}
                        {spectatorView === 'p1' && (
                            <div className="absolute inset-0">
                                <ReadOnlyWorkspace participantName={p1Name} participantId="p1" files={filesP1} activeFileName={activeFileNameP1} setActiveFileName={setActiveFileNameP1} previewSrc={previewSrcDocP1} initialViewMode="split" />
                            </div>
                        )}
                        {spectatorView === 'p2' && (
                            <div className="absolute inset-0">
                                <ReadOnlyWorkspace participantName={p2Name || "Opponent"} participantId="p2" files={filesP2} activeFileName={activeFileNameP2} setActiveFileName={setActiveFileNameP2} previewSrc={previewSrcDocP2} initialViewMode="split" />
                            </div>
                        )}
                    </div>
                </main>

                {/* Sidebar */}
                <aside 
                    className={`${isSidebarOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 translate-x-10 opacity-0'} transition-all duration-300 flex-shrink-0 border-l border-gray-700/50 bg-[#100D20]/95 backdrop-blur-md flex flex-col z-10`}
                    style={{ overflow: 'hidden' }} // Prevent content spill when collapsing
                >
                    <div className="p-4 flex flex-col h-full gap-4 w-80">
                        <div className="bg-black/40 rounded-xl border border-gray-700/50 p-4 shadow-lg">
                            <h3 className="font-orbitron text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <MonitorIcon className="h-4 w-4" /> Spectator Tools
                            </h3>
                            <button onClick={() => setPingToolActive(true)} disabled={pingToolActive} className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg text-sm transition-all bg-teal-600 hover:bg-teal-500 text-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20 hover:shadow-teal-900/40">
                                <CursorArrowRaysIcon className="h-4 w-4"/> 
                                {pingToolActive ? 'Click Preview to Ping' : 'Ping Participant'}
                            </button>
                            <p className="mt-3 text-center text-[10px] text-gray-500 uppercase tracking-widest">Select a preview window to highlight</p>
                        </div>
                        
                        <div className="flex-grow min-h-0">
                            <ChatSidebar messages={messages} inputValue={newMessage} onInputChange={setNewMessage} onSendMessage={handleSendMessage} />
                        </div>
                    </div>
                </aside>
            </div>
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default SpectatorRoom;
