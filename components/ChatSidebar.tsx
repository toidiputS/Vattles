import React from 'react';
import { ChatMessage } from '../types';
import { SearchIcon } from './icons';

interface ChatSidebarProps {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ messages, inputValue, onInputChange, onSendMessage }) => {
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 h-full p-4 flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h3 className="font-orbitron text-lg font-semibold text-white">Live Chat</h3>
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-grow my-4 space-y-4 overflow-y-auto pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-700 font-bold ${msg.color}`}>
              {msg.avatar}
            </div>
            <div>
              <p className={`font-semibold text-sm ${msg.color}`}>{msg.user}</p>
              <p className="text-gray-300 text-sm leading-tight break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <form onSubmit={handleFormSubmit}>
          <input 
            type="text"
            placeholder="Say something..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;