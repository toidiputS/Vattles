import React from 'react';
import { Tournament } from '../types';
import { LogoIcon, TrophyIcon, UserGroupIcon, UserPlusIcon, CheckCircleIcon } from './icons';

interface TournamentsViewProps {
    tournaments: Tournament[];
    onBack: () => void;
    onSelectTournament: (tournament: Tournament) => void;
    onRegister: (tournamentId: string) => void;
    registeredTournaments: { [key: string]: boolean };
}

const TournamentCard: React.FC<{ 
    tournament: Tournament, 
    onSelect: (t: Tournament) => void,
    onRegister: (id: string) => void,
    isRegistered: boolean,
}> = ({ tournament, onSelect, onRegister, isRegistered }) => {
    const typeStyles = {
        official: {
            bg: 'bg-purple-900/50',
            border: 'border-purple-500/80',
            shadow: 'hover:shadow-purple-900/40',
            label: 'text-purple-300'
        },
        sponsored: {
            bg: 'bg-yellow-900/50',
            border: 'border-yellow-500/80',
            shadow: 'hover:shadow-yellow-900/40',
            label: 'text-yellow-300'
        },
        community: {
            bg: 'bg-teal-900/50',
            border: 'border-teal-500/80',
            shadow: 'hover:shadow-teal-900/40',
            label: 'text-teal-300'
        }
    };
    const styles = typeStyles[tournament.type];

    const statusColors = {
        upcoming: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        live: 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse',
        completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    
    const isClickable = tournament.status !== 'upcoming';

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isClickable || (e.target as HTMLElement).closest('button')) {
            return;
        }
        onSelect(tournament);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(tournament);
        }
    }

    return (
        <div 
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : -1}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            aria-label={`View details for ${tournament.title}`}
            className={`rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 ${styles.bg} ${styles.border} ${styles.shadow} ${isClickable ? 'cursor-pointer' : ''} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D0B14] focus:ring-purple-500`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className={`font-semibold text-sm uppercase tracking-wider ${styles.label}`}>{tournament.type} Event</p>
                    <h3 className="font-orbitron text-xl font-bold text-white">{tournament.title}</h3>
                    <p className="text-sm text-gray-400">Theme: {tournament.theme}</p>
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${statusColors[tournament.status]}`}>
                    {tournament.status}
                </div>
            </div>
            
            <div className="flex-grow"></div>
            
            {tournament.status === 'upcoming' && (
                <div className="mt-2">
                    {isRegistered ? (
                        <button disabled className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg text-base transition-all bg-green-800/50 border border-green-600 text-green-300 cursor-not-allowed">
                            <CheckCircleIcon className="h-5 w-5" />
                            Registered
                        </button>
                    ) : (
                        <button 
                            onClick={() => onRegister(tournament.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg text-base transition-all bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                        >
                            <UserPlusIcon className="h-5 w-5" />
                            Register Now
                        </button>
                    )}
                </div>
            )}


            <div className="flex items-center justify-between text-sm text-gray-300 border-t border-gray-700/50 pt-4 mt-2">
                 <div className="flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">{tournament.prizePool}</span>
                </div>
                <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4 text-gray-400" />
                    <span>{tournament.participants.length} / {tournament.maxParticipants}</span>
                </div>
            </div>
        </div>
    );
};

const TournamentsView: React.FC<TournamentsViewProps> = ({ tournaments, onBack, onSelectTournament, onRegister, registeredTournaments }) => {
    return (
         <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in text-gray-200">
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">Tournaments</h1>
                </div>
                <div className="w-[150px]"></div> {/* Spacer */}
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map(t => (
                    <TournamentCard 
                        key={t.id} 
                        tournament={t} 
                        onSelect={onSelectTournament}
                        onRegister={onRegister}
                        isRegistered={!!registeredTournaments[t.id]}
                    />
                ))}
            </main>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default TournamentsView;