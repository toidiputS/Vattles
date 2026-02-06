
import React, { useState } from 'react';
import { VattleConfig } from '../types';
import { SparklesIcon, ClockIcon } from './icons';

interface CreateVattleViewProps {
  onCreate: (vattleConfig: Omit<VattleConfig, 'id' | 'status' | 'startTime' | 'creatorName'>) => void;
  onClose: () => void;
  isCoach: boolean;
}

const CreateVattleView: React.FC<CreateVattleViewProps> = ({ onCreate, onClose, isCoach }) => {
  const [theme, setTheme] = useState('');
  const [invitedOpponent, setInvitedOpponent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [opponentType, setOpponentType] = useState<'player' | 'ai'>('player');
  const [vattleMode, setVattleMode] = useState<'standard' | 'coaching'>('standard');
  const [battleType, setBattleType] = useState<'standard' | 'quick'>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) {
      alert("Please provide a theme for the Vattle.");
      return;
    }

    if (vattleMode === 'coaching' && !studentName.trim()) {
      alert("Please provide a student's username.");
      return;
    }

    // Force 1 minute for quick battles, otherwise use selected timeLimit
    const finalTimeLimit = battleType === 'quick' ? 1 : timeLimit;

    onCreate({
      theme,
      invitedOpponent: vattleMode === 'coaching' ? studentName : (opponentType === 'ai' ? 'AI Opponent' : invitedOpponent || 'Open Invite'),
      timeLimit: finalTimeLimit,
      opponent: opponentType,
      mode: vattleMode,
      studentName: vattleMode === 'coaching' ? studentName : undefined,
    });
  };

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Battle Type Toggle */}
      <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Battle Type</label>
          <div className="flex gap-4">
              <button type="button" onClick={() => setBattleType('standard')} className={`flex-1 py-3 rounded-md text-sm font-semibold transition-all border ${battleType === 'standard' ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40' : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-600/50'}`}>
                  Standard Battle
              </button>
              <button type="button" onClick={() => setBattleType('quick')} className={`flex-1 py-3 rounded-md text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${battleType === 'quick' ? 'bg-yellow-600 text-white border-yellow-400 shadow-lg shadow-yellow-900/40' : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-600/50'}`}>
                  <span>⚡</span> Quick Battle (60s)
              </button>
          </div>
      </div>

      {isCoach && (
        <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Session Type</label>
            <div className="flex gap-4">
                <button type="button" onClick={() => setVattleMode('standard')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${vattleMode === 'standard' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
                    Standard Vattle
                </button>
                <button type="button" onClick={() => setVattleMode('coaching')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${vattleMode === 'coaching' ? 'bg-blue-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
                    Coaching Session
                </button>
            </div>
        </div>
      )}

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-purple-300 mb-2">{vattleMode === 'coaching' ? 'Session Theme' : 'Vattle Theme'}</label>
        <input type="text" id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g., Retro Arcade Game" className={inputStyles} required />
      </div>
      
      {vattleMode === 'standard' && (
        <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">Opponent</label>
            <div className="flex gap-4">
                <button type="button" onClick={() => setOpponentType('player')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${opponentType === 'player' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
                    Challenge Player
                </button>
                <button type="button" onClick={() => setOpponentType('ai')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${opponentType === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
                    Challenge AI
                </button>
            </div>
        </div>
      )}

      {vattleMode === 'standard' && opponentType === 'player' && (
        <div>
          <label htmlFor="opponent" className="block text-sm font-medium text-purple-300 mb-2">Opponent's Username</label>
          <input type="text" id="opponent" value={invitedOpponent} onChange={(e) => setInvitedOpponent(e.target.value)} placeholder="Leave blank for an open challenge" className={inputStyles} />
        </div>
      )}

      {vattleMode === 'coaching' && (
         <div>
          <label htmlFor="student" className="block text-sm font-medium text-purple-300 mb-2">Student's Username</label>
          <input type="text" id="student" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter student's username" className={inputStyles} required/>
        </div>
      )}
      
      <div>
        <label htmlFor="timeLimit" className="block text-sm font-medium text-purple-300 mb-2">Time Limit</label>
        {battleType === 'quick' ? (
             <div className="w-full bg-yellow-900/20 border border-yellow-500/50 rounded-md px-4 py-3 text-yellow-300 flex items-center gap-2 animate-pulse">
                <SparklesIcon className="h-5 w-5" />
                <span className="font-bold font-orbitron">⚡ QUICK BATTLE - 60 Seconds</span>
            </div>
        ) : (
            <select id="timeLimit" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className={inputStyles}>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
            </select>
        )}
      </div>
      
      <div className="group relative">
        <button 
            type="submit" 
            className={`w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 shadow-lg ${battleType === 'quick' ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-500/30 hover:shadow-yellow-500/50' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/30 hover:shadow-teal-500/50'}`}
        >
            {vattleMode === 'coaching' ? 'Start Coaching Session' : (battleType === 'quick' ? 'Start Quick Battle' : 'Request Battle')}
        </button>
      </div>
    </form>
  );
};

export default CreateVattleView;
