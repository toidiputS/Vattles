import React from 'react';
import { TournamentRound } from '../types';

interface BracketProps {
    rounds: TournamentRound[];
}

const Bracket: React.FC<BracketProps> = ({ rounds }) => {
    return (
        <div className="flex space-x-6 sm:space-x-12 overflow-x-auto p-4 sm:p-6 bg-black/20 rounded-b-lg">
            {rounds.map(round => (
                <div key={round.id} className="flex flex-col items-center flex-shrink-0">
                    <h3 className="font-orbitron text-lg sm:text-xl text-purple-300 mb-6 tracking-wider">{round.name}</h3>
                    <div className="flex flex-col justify-around h-full space-y-8">
                        {round.matches.map(match => {
                            const [p1, p2] = match.participants;
                            const p1Winner = match.winnerId && p1 && match.winnerId === p1.id;
                            const p2Winner = match.winnerId && p2 && match.winnerId === p2.id;
                            
                            return (
                                <div key={match.id} className="bg-gray-800/70 rounded-lg p-3 w-48 border border-gray-700/50 shadow-lg">
                                    <div className={`flex justify-between items-center text-sm transition-all ${p1Winner ? 'font-bold text-white scale-105' : 'text-gray-400'}`}>
                                        <div className="flex items-center gap-2 truncate">
                                            {p1 && <img src={p1.avatarUrl} className="h-5 w-5 rounded-full" />}
                                            <span className="truncate">{p1?.name || 'TBD'}</span>
                                        </div>
                                        {match.score && <span className={`font-semibold ${p1Winner ? 'text-teal-300' : 'text-gray-300'}`}>{match.score[0]}</span>}
                                    </div>
                                    <div className="border-t border-gray-600/50 my-2"></div>
                                    <div className={`flex justify-between items-center text-sm transition-all ${p2Winner ? 'font-bold text-white scale-105' : 'text-gray-400'}`}>
                                         <div className="flex items-center gap-2 truncate">
                                            {p2 && <img src={p2.avatarUrl} className="h-5 w-5 rounded-full" />}
                                            <span className="truncate">{p2?.name || 'TBD'}</span>
                                        </div>
                                        {match.score && <span className={`font-semibold ${p2Winner ? 'text-teal-300' : 'text-gray-300'}`}>{match.score[1]}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Bracket;
