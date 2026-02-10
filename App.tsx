
import React, { useEffect, useState, useRef } from 'react';
import { Scene3D } from './components/3d/Scene';
import { useLibrary, BookLite } from './stores/library';
import { useUI } from './stores/ui';
import { useSystem, KeyMap } from './stores/system';
import { Catalog } from './components/ui/Catalog';
import { LandingPage } from './components/ui/LandingPage';
import { BookOpenOverlay } from './components/ui/BookOpenOverlay';

// Augment global JSX to include React Three Fiber elements and standard HTML elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // React Three Fiber
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      sphereGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      torusGeometry: any;
      ambientLight: any;
      pointLight: any;
      hemisphereLight: any;
      fog: any;
      color: any;
      gridHelper: any;

      // Standard HTML
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      button: any;
      input: any;
      form: any;
      label: any;
      ul: any;
      li: any;
      a: any;
      img: any;
      video: any; // Added video type
      source: any; // Added source type
      table: any;
      thead: any;
      tbody: any;
      tr: any;
      th: any;
      td: any;
      textarea: any; // Added textarea type
      svg: any;
      path: any;
      nav: any;
    }
  }
}

// --- COMPONENTS ---

const MobileControls = () => {
    const { keys } = useSystem();
    const intervalRef = useRef<number | null>(null);

    const triggerKey = (code: string, active: boolean) => {
        const eventType = active ? 'keydown' : 'keyup';
        window.dispatchEvent(new KeyboardEvent(eventType, { code }));
    };

    const handleTouchStart = (code: string) => (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scroll/zoom
        triggerKey(code, true);
    };

    const handleTouchEnd = (code: string) => (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKey(code, false);
    };

    // Style for glass buttons
    const btnClass = "w-16 h-16 rounded-full bg-neutral-900/50 backdrop-blur-md border border-amber-500/30 active:bg-amber-500/40 active:border-amber-500 flex items-center justify-center text-amber-500/80 font-bold select-none touch-none shadow-lg";

    return (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end pb-8 px-6">
            <div className="flex justify-between items-end w-full pointer-events-auto">
                {/* D-PAD Area */}
                <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <button 
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.forward)}
                        onTouchEnd={handleTouchEnd(keys.forward)}
                    >▲</button>
                    <div></div>
                    
                    <button 
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.left)}
                        onTouchEnd={handleTouchEnd(keys.left)}
                    >◀</button>
                    <button 
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.backward)}
                        onTouchEnd={handleTouchEnd(keys.backward)}
                    >▼</button>
                    <button 
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.right)}
                        onTouchEnd={handleTouchEnd(keys.right)}
                    >▶</button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-4 items-end">
                    <button 
                        className={`${btnClass} w-20 h-20 border-amber-400/50 bg-amber-900/20`}
                        onTouchStart={handleTouchStart(keys.interact)}
                        onTouchEnd={handleTouchEnd(keys.interact)}
                    >
                        OPEN
                    </button>
                    <div className="flex gap-4">
                        <button 
                            className={`${btnClass} w-14 h-14 text-xs`}
                            onTouchStart={handleTouchStart(keys.up)}
                            onTouchEnd={handleTouchEnd(keys.up)}
                        >ASC</button>
                         <button 
                            className={`${btnClass} w-14 h-14 text-xs`}
                            onTouchStart={handleTouchStart(keys.down)}
                            onTouchEnd={handleTouchEnd(keys.down)}
                        >DSC</button>
                    </div>
                     <button 
                        className={`${btnClass} w-12 h-12 text-[10px] opacity-70`}
                        onTouchStart={handleTouchStart(keys.summon)}
                        onTouchEnd={handleTouchEnd(keys.summon)}
                    >SUM</button>
                </div>
            </div>
            {/* Center Hint */}
            <div className="absolute bottom-32 left-0 right-0 text-center pointer-events-none opacity-40 text-[10px] text-amber-200 font-mono">
                DRAG SCREEN TO LOOK
            </div>
        </div>
    );
};

const AuthModal = () => {
    // Legacy modal kept for Desk interaction, but main login is now LandingPage
    const libraryCardName = useLibrary(s => s.libraryCardName);
    const setLibraryCard = useLibrary(s => s.setLibraryCard);
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-auth', handleOpen);
        return () => window.removeEventListener('open-auth', handleOpen);
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()) {
            setLibraryCard(name.trim());
            setIsOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto">
            <div className="bg-[#050505] w-full max-w-md p-8 border border-amber-500 shadow-[0_0_100px_rgba(217,119,6,0.2)]">
                <h2 className="text-xl font-mono mb-8 text-amber-500 uppercase tracking-[0.2em] text-center border-b border-amber-900/50 pb-4">
                    Identity Verification
                </h2>
                
                {libraryCardName ? (
                     <div className="text-center space-y-8">
                         <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Active User</div>
                         <div className="text-4xl font-serif text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{libraryCardName}</div>
                         <div className="flex justify-center">
                            <span className="px-3 py-1 bg-green-900/20 text-green-500 text-[10px] font-mono border border-green-900/50">ACCESS GRANTED</span>
                         </div>
                         <button onClick={() => setIsOpen(false)} className="w-full mt-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 py-3 font-mono text-xs uppercase transition-colors">Close</button>
                     </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <input 
                                autoFocus
                                className="w-full bg-transparent border-b-2 border-neutral-800 p-3 font-mono text-2xl text-amber-500 text-center focus:border-amber-500 focus:outline-none placeholder-neutral-800 uppercase"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="ENTER NAME"
                            />
                        </div>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 font-mono text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                            Print Library Card
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const KeyBindButton = ({ action, label, currentKey, listening, onClick }: any) => {
    const isActive = listening === action;
    return (
        <button 
            onClick={() => onClick(action)}
            className={`
                relative h-24 flex flex-col justify-between p-4 border transition-all duration-200 group
                ${isActive 
                    ? 'border-amber-500 bg-amber-900/20 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-105 z-10' 
                    : 'border-neutral-800 bg-[#0a0a0a] hover:border-neutral-600 hover:bg-[#111]'}
            `}
        >
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest group-hover:text-neutral-300">{label}</span>
            <span className={`text-2xl font-mono font-bold ${isActive ? 'text-amber-500 animate-pulse' : 'text-neutral-300'}`}>
                {isActive ? '[_]' : currentKey.replace('Key', '')}
            </span>
            {isActive && <div className="absolute inset-0 border border-amber-500 animate-ping opacity-20"></div>}
        </button>
    );
};

const SettingsMenu = () => {
    const { isSettingsOpen, setSettingsOpen } = useUI();
    const { cameraSpeed, setCameraSpeed, keys, setKey, resetKeys } = useSystem();
    const clearLibrary = useLibrary((s) => s.clearLibrary);
    const initShelves = useLibrary((s) => s.initShelves);
    const [listening, setListening] = useState<keyof KeyMap | null>(null);

    if (!isSettingsOpen) return null;

    const handleReset = () => {
        if(confirm("WARNING: COMPLETE SYSTEM PURGE. PROCEED?")) {
            clearLibrary();
            // Force reload to trigger re-seeding
            window.location.reload();
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (listening) {
            e.preventDefault();
            setKey(listening, e.code);
            setListening(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-8 bg-black/95 backdrop-blur-xl pointer-events-auto" onKeyDown={onKeyDown}>
            <div className="w-full max-w-5xl h-full max-h-[90vh] flex flex-col border border-neutral-800 bg-black shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <div className="p-4 md:p-8 border-b border-neutral-800 flex justify-between items-end relative z-10">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-mono text-amber-500 uppercase tracking-widest">System Config</h2>
                        <div className="flex gap-4 mt-2 text-[10px] font-mono text-neutral-500">
                            <span>KERNEL: ONLINE</span>
                            <span>INPUT: ACTIVE</span>
                        </div>
                    </div>
                    <button onClick={() => setSettingsOpen(false)} className="text-neutral-500 hover:text-white font-mono text-lg px-4 py-2 border border-transparent hover:border-neutral-700 transition-all">&times; CLOSE</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono text-amber-700 uppercase border-b border-amber-900/30 pb-2">Movement Matrix</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <KeyBindButton action="forward" label="Forward Thrust" currentKey={keys.forward} listening={listening} onClick={setListening} />
                                <KeyBindButton action="backward" label="Reverse Thrust" currentKey={keys.backward} listening={listening} onClick={setListening} />
                                <KeyBindButton action="left" label="Port Strafe" currentKey={keys.left} listening={listening} onClick={setListening} />
                                <KeyBindButton action="right" label="Starboard Strafe" currentKey={keys.right} listening={listening} onClick={setListening} />
                                <KeyBindButton action="up" label="Ascend" currentKey={keys.up} listening={listening} onClick={setListening} />
                                <KeyBindButton action="down" label="Descend" currentKey={keys.down} listening={listening} onClick={setListening} />
                                <div className="col-span-2">
                                    <KeyBindButton action="run" label="Turbo Boost" currentKey={keys.run} listening={listening} onClick={setListening} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-xs font-mono text-amber-700 uppercase border-b border-amber-900/30 pb-2">Interaction Protocols</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <KeyBindButton action="summon" label="Toggle Held Book" currentKey={keys.summon} listening={listening} onClick={setListening} />
                                    <KeyBindButton action="interact" label="Open / Access" currentKey={keys.interact} listening={listening} onClick={setListening} />
                                </div>
                                
                                <h3 className="text-xs font-mono text-amber-700 uppercase border-b border-amber-900/30 pb-2 mt-8">Neural Sensitivity</h3>
                                <div className="bg-neutral-900/50 p-6 border border-neutral-800">
                                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-4">
                                        <span>DAMPENED</span>
                                        <span>{Math.round(cameraSpeed * 100)}%</span>
                                        <span>RESPONSIVE</span>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="3" step="0.1" 
                                        value={cameraSpeed}
                                        onChange={(e) => setCameraSpeed(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-black rounded-none border border-neutral-700 appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                                    />
                                </div>
                            </div>

                             <div className="space-y-6">
                                <h3 className="text-xs font-mono text-red-900 uppercase border-b border-red-900/30 pb-2">Danger Zone</h3>
                                <button 
                                    onClick={handleReset}
                                    className="w-full py-6 border border-red-900/50 bg-red-950/10 text-red-700 font-mono text-xs uppercase tracking-[0.3em] hover:bg-red-900/30 hover:text-red-500 transition-all flex items-center justify-center gap-4 group"
                                >
                                    <span className="w-2 h-2 bg-red-900 rounded-full group-hover:bg-red-500"></span>
                                    Initiate Factory Reset
                                    <span className="w-2 h-2 bg-red-900 rounded-full group-hover:bg-red-500"></span>
                                </button>
                                <p className="text-[10px] font-mono text-neutral-600 text-center">
                                    ACTION IRREVERSIBLE. ARCHIVE WILL BE REBUILT.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookReader = ({ book, onClose }: { book: BookLite, onClose: () => void }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div className={`fixed inset-0 z-40 flex items-center justify-center p-0 md:p-12 transition-all duration-500 ease-out ${mounted ? 'bg-black/80 backdrop-blur-md opacity-100' : 'bg-black/0 opacity-0'}`}>
      <div className={`relative w-full h-full md:h-auto max-w-4xl bg-[#e3dacb] shadow-2xl flex flex-col md:flex-row overflow-hidden ${mounted ? 'scale-100' : 'scale-95'}`}>
          <div className="w-full md:w-16 bg-[#2c1810] flex md:flex-col justify-between md:justify-center items-center p-4 border-r border-black/20 shrink-0">
               {/* Mobile Close Button in spine area */}
              <button onClick={onClose} className="md:hidden text-white/50 text-xl font-mono">←</button>
              <div className="w-full h-px md:h-full md:w-px border-l border-white/10"></div>
          </div>
          
          <div className="flex-1 p-6 md:p-12 overflow-y-auto max-h-[100vh] md:max-h-[80vh]">
              <div className="flex justify-between items-start border-b-2 border-neutral-300 pb-6 mb-8">
                  <div>
                      <h1 className="text-2xl md:text-4xl font-serif text-neutral-900 mb-2">{book.title}</h1>
                      <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">{book.author}</p>
                  </div>
                  <button onClick={onClose} className="hidden md:block text-neutral-400 hover:text-red-600 font-mono text-xl">&times;</button>
              </div>
              <div className="prose prose-lg prose-stone font-serif">
                   <p className="lead">{book.summary}</p>
                   <p className="text-sm text-neutral-400 mt-12 font-mono">Archive ID: {book.id}</p>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const { view, setView, isCatalogOpen, setCatalogOpen, isSettingsOpen } = useUI();
  const { initShelves, summonBook, bookStates, books, select, selectedBookId, libraryCardName, clearLibrary, seedSpecs, returnBookToShelf } = useLibrary();
  const { keys, user } = useSystem();
  const [isMobile, setIsMobile] = useState(false);
  
  // World loading state removed - we now load immediately in background

  const selectedBook = selectedBookId ? books[selectedBookId] : null;

  // Detect which book is held (if any)
  const heldBookId = Object.keys(bookStates).find(id => bookStates[id] === 'held');
  const heldBook = heldBookId ? books[heldBookId] : null;
  
  // SPECIAL TREATMENT: Books A-J open the special overlay
  const isHeldBookSpec = heldBook && ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(heldBook.spineLetter || '');

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (isCatalogOpen || isSettingsOpen || selectedBookId) return; 

          if (e.code === keys.summon) {
              e.preventDefault();
              summonBook();
          }

          if (e.code === keys.interact) {
              e.preventDefault();
              const heldId = Object.keys(bookStates).find(id => bookStates[id] === 'held');
              if (heldId) {
                  const book = books[heldId];
                  if (!libraryCardName) {
                      alert("ACCESS DENIED: NO LIBRARY CARD. PLEASE LOG IN AT THE DESK.");
                  } else if (book && !book.isLocked) {
                      // Only allow 'reading' mode via select() if it's NOT a Spec Book (A-J)
                      // Spec books open via the overlay condition in render
                      if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(book.spineLetter || '') === false) {
                        select(heldId);
                      }
                  }
              }
          }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [summonBook, bookStates, books, select, isCatalogOpen, isSettingsOpen, selectedBookId, libraryCardName, keys]);

  const seedEmptyShelves = () => {
    // 14 stacks logic
    const categories = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'];
    const shelfNames: string[] = [];
    
    // NEW STRUCTURE: 20 levels * 14 stacks = 280 shelves
    for (let level = 0; level < 20; level++) {
        for (let seg = 0; seg < 14; seg++) {
            // Keep the name empty by default unless specifically needed, 
            // but generate a unique ID
            const cat = categories[seg];
            const id = `STACK-${cat}-LVL-${(level + 1).toString().padStart(2, '0')}`;
            shelfNames.push(id);
        }
    }
    initShelves(shelfNames);
    
    // Populate with specs
    seedSpecs();
  };

  useEffect(() => {
    const t = setTimeout(() => {
       // Check if shelf count matches the new target (280)
       // If the old store has 420 (or other number), we must reset to fit new topology.
       const count = Object.keys(useLibrary.getState().shelves).length;
       const TARGET_SHELVES = 280; // 20 levels * 14 stacks

       if (count !== TARGET_SHELVES) {
           console.log("Library topology mismatch. Re-seeding universe...");
           clearLibrary(); // Clear old layout
           seedEmptyShelves();
       }
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const isOverlayOpen = isCatalogOpen || isSettingsOpen || selectedBook || !user.isAuthenticated || isHeldBookSpec;

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-sans box-border select-none overscroll-none touch-none border-4 border-[#8b5cf6]">
      
      {/* 3D SCENE CONTAINER - MOUNTED IMMEDIATELY IN BACKGROUND */}
      <div className="absolute inset-0 z-10 fade-in-active">
        <Scene3D isMobile={isMobile} />
      </div>

      {/* LANDING PAGE / LOGIN - OVERLAY */}
      {!user.isAuthenticated && (
        <LandingPage onEnterWorld={() => { /* No-op, world already loaded */ }} />
      )}

      {/* SPECIAL BOOK OVERLAY FOR BOOK A-J */}
      {isHeldBookSpec && heldBook && (
          <BookOpenOverlay 
              book={heldBook} 
              onClose={() => returnBookToShelf(heldBook.id)} 
          />
      )}

      {isCatalogOpen && <Catalog />}
      {isSettingsOpen && <SettingsMenu />}
      <AuthModal />

      {selectedBook && <BookReader book={selectedBook} onClose={() => select(null)} />}

      {/* Mobile Controls Layer */}
      {user.isAuthenticated && !isOverlayOpen && isMobile && (
          <MobileControls />
      )}

      {/* HUD Layer - Now persistent over Spec Book overlays as shown in screenshot */}
      {user.isAuthenticated && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Top Right: Search Index */}
          {!isCatalogOpen && !isSettingsOpen && !selectedBookId && (
            <div className="absolute top-0 right-0 p-4 md:p-8 pointer-events-auto flex gap-4">
               <button 
                onClick={() => setCatalogOpen(true)}
                className="bg-black/50 backdrop-blur border border-amber-900/50 hover:border-amber-500 text-amber-500 hover:text-amber-300 px-4 md:px-6 py-2 font-mono text-xs uppercase tracking-widest transition-all"
               >
                 Search Index
               </button>
            </div>
          )}

          {/* Bottom Left: Controls HUD */}
          {!isMobile && !isCatalogOpen && !isSettingsOpen && !selectedBookId && (
            <div className="absolute bottom-8 left-8 text-yellow-500 pointer-events-none hidden md:block">
               <div className="text-[10px] font-mono space-y-2 drop-shadow-md">
                  <p className="text-amber-300 font-bold border-b border-amber-800 pb-1 mb-2">CONTROLS_V1.3</p>
                  <p>CLICK SCREEN : LOCK CURSOR</p>
                  <p>ESC : UNLOCK CURSOR</p>
                  <p>{keys.forward.replace('Key', '')}{keys.left.replace('Key', '')}{keys.backward.replace('Key', '')}{keys.right.replace('Key', '')} : VECTOR MOVEMENT</p>
                  <p>HOVER 2s : FLOAT BOOK</p>
                  <p>{keys.summon} : HOLD / RETURN LAST BOOK</p>
                  <p>{keys.interact} : OPEN BOOK (REQ. AUTH)</p>
               </div>
            </div>
          )}

          {/* Bottom Right: Teal Branding Box (Requested Edit) */}
          {!isMobile && heldBook?.spineLetter === 'A' && (
            <div className="absolute bottom-8 right-8 text-[#2dd4bf] pointer-events-none hidden md:block text-right">
               <div className="text-[10px] font-mono space-y-2 drop-shadow-md">
                  <p className="text-[#2dd4bf] font-bold border-b border-[#2dd4bf]/40 pb-1 mb-2">CHPT A itsaiagent.solutions</p>
                  <p>Alpha Commander: Ops / Infrastructure / Automation</p>
               </div>
            </div>
          )}
          
          {/* Aim Dot */}
          {!isOverlayOpen && (
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
          )}
        </div>
      )}

    </div>
  );
}
