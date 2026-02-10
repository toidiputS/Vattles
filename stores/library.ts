
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Shelf = { id: string; title: string; bookIds: string[] };
export type BookLite = { 
  id: string; 
  title: string; 
  spineColor?: string;
  spineLetter?: string; // New property for spine display
  author?: string;
  summary?: string;
  isLocked?: boolean;
};

export type BookLocationState = 'shelf' | 'flying' | 'held';

type LibraryState = {
  // Auth
  libraryCardName: string | null;
  setLibraryCard: (name: string) => void;

  books: Record<string, BookLite>;
  shelves: Record<string, Shelf>;
  bookStates: Record<string, BookLocationState>; 
  flyingTimers: Record<string, number>; 
  selectedBookId: string | null; 
  lastFloatedBookId: string | null; // Track the last book that floated
  
  upsertBook: (b: BookLite) => void;
  addToShelf: (shelfId: string, bookId: string) => void;
  initShelves: (titles: string[]) => void;
  seedSpecs: () => void;
  select: (bookId: string | null) => void; 
  
  setBookState: (bookId: string, state: BookLocationState) => void;
  floatBook: (bookId: string) => void; 
  summonBook: () => void; 
  returnBookToShelf: (bookId: string) => void;
  clearLibrary: () => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      libraryCardName: null,
      setLibraryCard: (name) => set({ libraryCardName: name }),

      books: {},
      shelves: {},
      bookStates: {},
      flyingTimers: {},
      selectedBookId: null,
      lastFloatedBookId: null,

      upsertBook: (b) =>
        set((s) => ({
          books: { ...s.books, [b.id]: { ...s.books[b.id], ...b } },
        })),

      addToShelf: (shelfId, bookId) =>
        set((s) => ({
          shelves: {
            ...s.shelves,
            [shelfId]: {
              ...s.shelves[shelfId],
              bookIds: Array.from(
                new Set([...(s.shelves[shelfId]?.bookIds ?? []), bookId])
              ),
            },
          },
          bookStates: { ...s.bookStates, [bookId]: 'shelf' }
        })),

      initShelves: (titles) => 
        set((s) => {
            const newShelves = { ...s.shelves };
            titles.forEach(title => {
                 const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                 if (!newShelves[id]) {
                     newShelves[id] = { id, title, bookIds: [] };
                 }
            });
            return { shelves: newShelves };
        }),

      seedSpecs: () => set((s) => {
          const newBooks = { ...s.books };
          const newShelves = { ...s.shelves };
          const newStates = { ...s.bookStates };

          const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
          // Dark, leather-like colors for spines
          const COLORS = ['#1a1a1a', '#2c1810', '#1F140C', '#0E0B0A', '#1C1C1C', '#261C15', '#140F0B', '#2B2118', '#121212', '#1E1E1E'];

          // Populate the first 28 shelves (Level 1 and Level 2) to "letter all the books" in the visible vicinity
          const shelfIdsToSeed = Object.keys(newShelves).slice(0, 28);
          
          shelfIdsToSeed.forEach((shelfId) => {
              const newIds = [];
              for(let i=0; i<10; i++) {
                  const letter = LETTERS[i];
                  const bookId = `unit-${shelfId}-${letter}`;
                  
                  // DEFINE BOOK METADATA
                  let title = `UNIT ${letter}`;
                  let summary = `Encrypted Data Unit ${letter}`;

                  // Special content for the primary stack (Level 1)
                  if (shelfId === 'stack-01-lvl-01') {
                      if (i === 0) { title = "AGENT SPEC"; summary = "Autonomous Agent Specification v4.0"; }
                      else if (i === 1) { title = "FLOWS & HANDOFFS"; summary = "A Record of Inter-Agent Connectivity"; }
                      else if (i === 2) { title = "SOLOPRENEUR"; summary = "Case Study: Indie / Solopreneur Deployment"; }
                      else if (i === 3) { title = "SMALL TEAM / AGENCY"; summary = "Case Study: Small Team / Agency Implementation"; }
                      else if (i === 4) { title = "VC-BACKED SAAS"; summary = "Case Study: High Growth Edition"; }
                      else if (i === 5) { title = "ENTERPRISE"; summary = "Case Study: Enterprise / Large Org"; }
                      else if (i === 6) { title = "NONPROFIT MISSION"; summary = "Case Study: Nonprofit / Mission-Driven"; }
                      else if (i === 7) { title = "MARKETPLACE"; summary = "Case Study: Marketplace / Platform Model"; }
                      else if (i === 8) { title = "CREATOR / COACH"; summary = "Case Study: Creator Economy / Info Product"; }
                      else if (i === 9) { title = "LOCAL ENCYCLOPEDIA"; summary = "Reference: Shared Glossary & Index"; }
                  }

                  if(!newBooks[bookId]) {
                      newBooks[bookId] = {
                          id: bookId,
                          title, 
                          spineLetter: letter,
                          spineColor: COLORS[i % COLORS.length],
                          author: 'SYSTEM',
                          summary,
                          isLocked: false 
                      };
                  }
                  newIds.push(bookId);
                  if (!newStates[bookId]) newStates[bookId] = 'shelf';
              }
              newShelves[shelfId].bookIds = newIds;
          });

          return { books: newBooks, shelves: newShelves, bookStates: newStates };
      }),

      select: (bookId) => set({ selectedBookId: bookId }),

      setBookState: (bookId, state) => set(s => {
          const updates: Partial<LibraryState> = {
              bookStates: { ...s.bookStates, [bookId]: state }
          };
          if (state === 'flying') {
               // Update last floated when it enters flying state
               updates.lastFloatedBookId = bookId;
          }
          return updates;
      }),

      floatBook: (bookId) => {
          const now = Date.now();
          const duration = 20000 + Math.random() * 10000;
          
          set(s => ({
              bookStates: { ...s.bookStates, [bookId]: 'flying' },
              flyingTimers: { ...s.flyingTimers, [bookId]: now + duration },
              lastFloatedBookId: bookId 
          }));
      },

      returnBookToShelf: (bookId) => {
          set(s => {
              const newTimers = { ...s.flyingTimers };
              delete newTimers[bookId];
              return {
                  bookStates: { ...s.bookStates, [bookId]: 'shelf' },
                  flyingTimers: newTimers
              };
          });
      },

      summonBook: () => {
          const s = get();
          const targetId = s.lastFloatedBookId;
          
          if (targetId) {
              const currentState = s.bookStates[targetId];
              
              if (currentState === 'held') {
                  // Toggle: Return to Shelf
                  s.returnBookToShelf(targetId);
              } else {
                  // Toggle: Summon (from shelf or flying)
                  set(state => ({
                      bookStates: { ...state.bookStates, [targetId]: 'held' }
                  }));
              }
          }
      },

      clearLibrary: () => set({ books: {}, shelves: {}, selectedBookId: null, bookStates: {}, flyingTimers: {}, libraryCardName: null, lastFloatedBookId: null }),
    }),
    {
      name: 'books-os:library-v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
