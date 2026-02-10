import React, { useState } from 'react';
import { useLibrary, BookLite } from '../../stores/library';
import { useUI } from '../../stores/ui';

export const Catalog = () => {
  const books = useLibrary((s) => s.books);
  const select = useLibrary((s) => s.select);
  const setCatalogOpen = useUI((s) => s.setCatalogOpen);
  const [search, setSearch] = useState('');

  const filteredBooks = (Object.values(books) as BookLite[]).filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#f5f5f5] w-full max-w-4xl h-[80vh] flex flex-col rounded shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#2c1810] text-[#f5f5f5] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-serif tracking-widest">CATALOG SEARCH</h2>
            <p className="text-xs opacity-70 font-mono mt-1">SYSTEM v1.1 ACCESS TERMINAL</p>
          </div>
          <button 
            onClick={() => setCatalogOpen(false)}
            className="text-xs md:text-sm font-mono hover:text-amber-500 uppercase tracking-wider"
          >
            [ Close ]
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-neutral-300 bg-[#e5e5e5]">
          <input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-400 p-3 font-mono text-neutral-800 placeholder-neutral-500 focus:outline-none focus:border-[#2c1810]"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-neutral-800 text-neutral-600">
                <th className="pb-2 pl-2 hidden md:table-cell">ID</th>
                <th className="pb-2">TITLE</th>
                <th className="pb-2 hidden sm:table-cell">AUTHOR</th>
                <th className="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="border-b border-neutral-300 hover:bg-neutral-200/50 transition-colors group">
                  <td className="py-3 pl-2 text-neutral-500 text-xs hidden md:table-cell">{book.id}</td>
                  <td className="py-3 font-bold text-[#2c1810]">
                      <div className="flex flex-col">
                          <span>{book.title}</span>
                          {/* Mobile only author display */}
                          <span className="sm:hidden text-xs text-neutral-500 font-normal">{book.author}</span>
                      </div>
                  </td>
                  <td className="py-3 text-neutral-600 hidden sm:table-cell">{book.author || 'Unknown'}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        select(book.id);
                        setCatalogOpen(false);
                      }}
                      className="text-xs bg-[#2c1810] text-[#f5f5f5] px-3 py-2 md:py-1 hover:bg-amber-700 transition-colors"
                    >
                      RETRIEVE
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500 italic">
                    No records found matching query sequence.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};