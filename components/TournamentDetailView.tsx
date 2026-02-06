import React, { useState } from 'react';
import { Tournament } from '../types';
import { LogoIcon, TrophyIcon, UserGroupIcon, UserPlusIcon, CheckCircleIcon } from './icons';
import Bracket from './Bracket';

interface TournamentDetailViewProps {
    tournament: Tournament;
    onBack: () => void;
    onRegister: (tournamentId: string) => void;
    onCheckIn: (tournamentId: string) => void;
    isRegistered: boolean;
    isCheckedIn: boolean;
}

const TournamentDetailView: React.FC<TournamentDetailViewProps> = ({ tournament, onBack, onRegister, onCheckIn, isRegistered, isCheckedIn }) => {
    const [activeTab, setActiveTab] = useState<'bracket' | 'participants' | 'rules'>('bracket');

    const statusColors = {
        upcoming: 'text-yellow-300',
        live: 'text-red-300 animate-pulse',
        completed: 'text-gray-400'
    };

    const renderActionButton = () => {
        if (tournament.status === 'upcoming') {
            if (isRegistered) {
                return (
                    <button disabled className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 font-semibold rounded-lg text-base transition-all bg-green-800/50 border border-green-600 text-green-300 cursor-not-allowed">
                        <CheckCircleIcon className="h-5 w-5" />
                        Registered
                    </button>
                );
            }
            return (
                 <button onClick={() => onRegister(tournament.id)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 font-semibold rounded-lg text-base transition-all bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/30">
                    <UserPlusIcon className="h-5 w-5" />
                    Register Now
                </button>
            );
        }
        if (tournament.status === 'live' && isRegistered) {
             if (isCheckedIn) {
                return (
                    <button disabled className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 font-semibold rounded-lg text-base transition-all bg-green-800/50 border border-green-600 text-green-300 cursor-not-allowed">
                        <CheckCircleIcon className="h-5 w-5" />
                        Checked-in
                    </button>
                );
             }
             return (
                <button onClick={() => onCheckIn(tournament.id)} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 font-semibold rounded-lg text-base transition-all bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/30 animate-pulse">
                    <CheckCircleIcon className="h-5 w-5" />
                    Check-in for Match
                </button>
             )
        }
        return null;
    }

    const renderContent = () => {
        return (
            <>
                <div role="tabpanel" id="panel-bracket" aria-labelledby="tab-bracket" hidden={activeTab !== 'bracket'}>
                    {tournament.rounds.length > 0 ? <Bracket rounds={tournament.rounds} /> : <p className="text-center text-gray-500 py-10">Bracket will be generated once the tournament starts.</p>}
                </div>
                <div role="tabpanel" id="panel-participants" aria-labelledby="tab-participants" hidden={activeTab !== 'participants'}>
                    {tournament.participants.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No participants have registered yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {tournament.participants.map(p => (
                                <div key={p.id} className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3 border border-gray-700/50">
                                    <img src={p.avatarUrl} alt={p.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-white">{p.name}</p>
                                        <p className="text-xs text-gray-400">Seed #{p.seed}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 <div role="tabpanel" id="panel-rules" aria-labelledby="tab-rules" hidden={activeTab !== 'rules'}>
                    <div className="p-6 text-gray-300 bg-black/20 rounded-b-lg"><p>1. Each Vattle will have a unique theme.<br/>2. Submissions are judged by the community.<br/>3. Be respectful and have fun!</p></div>
                 </div>
            </>
        )
    };
    
    return (
        <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in text-gray-200">
             <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Tournaments
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase truncate">{tournament.title}</h1>
                </div>
                <div className="w-[200px] hidden sm:block"></div> {/* Spacer */}
            </header>

            <main>
                <div className="bg-black/20 rounded-lg border border-gray-700/50 p-6 flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div className="flex-grow">
                        <p className="text-purple-300 font-semibold">Theme</p>
                        <h2 className="font-orbitron text-2xl font-bold text-white">{tournament.theme}</h2>
                    </div>
                     <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">Prize Pool</p>
                            <p className="font-orbitron text-xl font-bold text-yellow-300 flex items-center gap-2"><TrophyIcon className="h-5 w-5"/>{tournament.prizePool}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">Participants</p>
                            <p className="font-orbitron text-xl font-bold text-white flex items-center gap-2"><UserGroupIcon className="h-5 w-5"/>{tournament.participants.length} / {tournament.maxParticipants}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-gray-400 text-sm">Status</p>
                            <p className={`font-orbitron text-xl font-bold uppercase ${statusColors[tournament.status]}`}>{tournament.status}</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        {renderActionButton()}
                    </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg border border-gray-700/50">
                     <div role="tablist" aria-label="Tournament details" className="flex border-b border-gray-700">
                        <TabButton id="tab-bracket" controls="panel-bracket" label="Bracket" isActive={activeTab === 'bracket'} onClick={() => setActiveTab('bracket')} />
                        <TabButton id="tab-participants" controls="panel-participants" label="Participants" isActive={activeTab === 'participants'} onClick={() => setActiveTab('participants')} />
                        <TabButton id="tab-rules" controls="panel-rules" label="Rules" isActive={activeTab === 'rules'} onClick={() => setActiveTab('rules')} />
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
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

const TabButton: React.FC<{id: string, controls: string, label: string, isActive: boolean, onClick: () => void}> = ({ id, controls, label, isActive, onClick }) => (
    <button role="tab" id={id} aria-controls={controls} aria-selected={isActive} onClick={onClick} className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${isActive ? 'text-purple-300 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'}`}>
        {label}
    </button>
);

export default TournamentDetailView;