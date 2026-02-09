
import React, { useState } from 'react';
import { VattleConfig, UserProfile } from '../types';
import { TrophyIcon, BookOpenIcon, FlameIcon, SwordsIcon, UserPlusIcon, BrainCircuitIcon, UserIcon, EyeIcon } from './icons';
import BattleTimer from './BattleTimer';
import Modal from './Modal';
import ComingSoonOverlay from './ComingSoonOverlay';

interface VattleArenaProps {
    userProfile: UserProfile;
    userBattles: VattleConfig[]; // Real data for "Your Battles"
    showcaseBattles: VattleConfig[]; // Mock data for "Live & Recent"
    onEnterBattle: (vattle: VattleConfig) => void;
    onSpectateBattle: (vattle: VattleConfig) => void;
    onViewVattle: (vattle: VattleConfig) => void;
    onJoinVattle: (vattle: VattleConfig) => void;
    onWaitlist: (feature: string, description: string) => void;
    onRequestBattle: () => void;
    onEnterVibeLab: () => void;
}

const SpotlightVattleCard: React.FC<{ vattle: VattleConfig; onSpectate: () => void; }> = ({ vattle, onSpectate }) => {
    return (
        <div
            className="relative shrink-0 w-[420px] h-[260px] rounded-2xl overflow-hidden group border border-purple-500/30 bg-[#151221] shadow-xl shadow-black/50 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-600/20 hover:border-purple-400/60 cursor-pointer"
            onClick={onSpectate}
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={`https://picsum.photos/seed/${vattle.id}/800/500`}
                    alt={vattle.theme}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                />
            </div>

            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-vattles-bg via-vattles-bg/40 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-r from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <div className="bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse border border-red-400/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Live Now
                </div>
                {vattle.isFeatured && (
                    <div className="bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-purple-400/30">
                        Featured
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <span className="text-teal-300 text-xs font-bold tracking-widest uppercase">
                            {vattle.mode === 'coaching' ? 'Coaching Session' : 'Battle Arena'}
                        </span>
                        {vattle.isTrending && <FlameIcon className="h-3 w-3 text-orange-400" />}
                    </div>

                    <h3 className="font-orbitron text-2xl font-bold text-white leading-tight drop-shadow-md group-hover:text-purple-100 transition-colors">
                        {vattle.theme}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-xs font-bold text-white relative z-10" title={vattle.creatorName}>
                                    {vattle.creatorName.charAt(0)}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 relative z-0" title={vattle.invitedOpponent}>
                                    {vattle.opponent === 'ai' ? 'AI' : vattle.invitedOpponent?.charAt(0) || '?'}
                                </div>
                            </div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-semibold">{vattle.creatorName}</span>
                                <span className="mx-1 text-gray-500">vs</span>
                                <span className="text-white font-semibold">{vattle.opponent === 'ai' ? 'AI Agent' : vattle.invitedOpponent}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover Action / Timer */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between opacity-90">
                    {vattle.startTime ? (
                        <BattleTimer startTime={vattle.startTime} timeLimit={vattle.timeLimit} size="sm" />
                    ) : (
                        <span className="text-xs text-gray-400 font-mono">Starting Soon</span>
                    )}

                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-all shadow-lg shadow-purple-900/20 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                        <EyeIcon className="h-3 w-3" /> Watch
                    </button>
                </div>
            </div>
        </div>
    );
};


const VattleCard: React.FC<{
    vattle: VattleConfig;
    onEnter: () => void;
    onSpectate: () => void;
    onView: () => void;
    onJoin: () => void;
    isCreator: boolean;
    isParticipant: boolean;
    isComingSoon?: boolean;
    onWaitlist?: () => void;
}> = ({ vattle, onEnter, onSpectate, onView, onJoin, isCreator, isParticipant, isComingSoon, onWaitlist }) => {

    const isCoaching = vattle.mode === 'coaching';
    const isAi = vattle.opponent === 'ai';
    const isOpenChallenge = vattle.status === 'pending';
    const isQuickBattle = vattle.timeLimit === 1;

    // Status-based styling configuration
    const statusConfig = {
        pending: {
            label: 'Open Challenge',
            border: 'border-teal-500/40 hover:border-teal-400',
            bg: 'bg-gradient-to-br from-gray-900/90 to-teal-900/20',
            badge: 'bg-teal-500/20 text-teal-300 border-teal-500/50 animate-pulse',
            shadow: 'shadow-lg shadow-teal-900/10 hover:shadow-teal-500/20'
        },
        active: {
            label: 'Live',
            border: 'border-red-500/40 hover:border-red-400',
            bg: 'bg-gradient-to-br from-gray-900/90 to-red-900/20',
            badge: 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse',
            shadow: 'shadow-lg shadow-red-900/10 hover:shadow-red-500/20'
        },
        voting: {
            label: 'Voting',
            border: 'border-yellow-500/40 hover:border-yellow-400',
            bg: 'bg-gradient-to-br from-gray-900/90 to-yellow-900/20',
            badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
            shadow: 'shadow-lg shadow-yellow-900/10 hover:shadow-yellow-500/20'
        },
        completed: {
            label: 'Completed',
            border: 'border-purple-500/40 hover:border-purple-400',
            bg: 'bg-gradient-to-br from-gray-900/90 to-purple-900/20',
            badge: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
            shadow: 'shadow-lg shadow-purple-900/10 hover:shadow-purple-500/20'
        }
    };

    // Coaching override
    const currentStyle = isCoaching ? {
        label: vattle.status === 'active' ? 'Live Session' : (vattle.status === 'completed' ? 'Reviewed' : vattle.status),
        border: 'border-blue-500/40 hover:border-blue-400',
        bg: 'bg-gradient-to-br from-gray-900/90 to-blue-900/20',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        shadow: 'shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20'
    } : statusConfig[vattle.status];

    return (
        <div className={`relative rounded-xl border p-6 flex flex-col gap-4 transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${currentStyle.bg} ${currentStyle.border} ${currentStyle.shadow}`}>

            {isComingSoon && onWaitlist && (
                <ComingSoonOverlay title="🚀 LIVE BATTLES - COMING Q2 2026" onClick={onWaitlist} />
            )}

            {vattle.isRivalryMatch && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border-2 border-red-400 z-10">
                    <SwordsIcon className="h-3 w-3" />
                    Rivalry Match
                </div>
            )}
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                {isQuickBattle && (
                    <div className="p-1.5 bg-yellow-500/20 rounded-full border border-yellow-500/50 text-xs font-bold text-yellow-300 px-2" title="Quick 60s Battle">
                        ⚡ QUICK
                    </div>
                )}
                {vattle.isTrending && (
                    <div className="p-1.5 bg-orange-500/20 rounded-full border border-orange-500/50" title="Trending Vattle">
                        <FlameIcon className="h-4 w-4 text-orange-400" />
                    </div>
                )}
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-start mt-2">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-orbitron text-xl font-bold text-white truncate" title={vattle.theme}>{vattle.theme}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        {isCoaching ? (
                            <>
                                <span className="flex items-center gap-1"><BookOpenIcon className="h-3 w-3 text-blue-400" /> Coach: <span className="text-blue-200">{vattle.creatorName}</span></span>
                            </>
                        ) : (
                            <>
                                <span className="flex items-center gap-1 truncate"><UserIcon className="h-3 w-3 text-purple-400" /> {vattle.creatorName}</span>
                                <span className="text-gray-600 font-bold">vs</span>
                                {isAi ? (
                                    <span className="flex items-center gap-1 text-teal-300"><BrainCircuitIcon className="h-3 w-3" /> AI Agent</span>
                                ) : isOpenChallenge ? (
                                    <span className="text-teal-400 font-bold animate-pulse flex items-center gap-1"><UserPlusIcon className="h-3 w-3" /> Waiting...</span>
                                ) : (
                                    <span className="flex items-center gap-1 truncate"><UserIcon className="h-3 w-3 text-red-400" /> {vattle.invitedOpponent}</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className={`shrink-0 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${currentStyle.badge}`}>
                    {currentStyle.label}
                </div>
            </div>

            <div className="grow"></div>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-sm text-gray-300 border-t border-gray-700/50 pt-4 mt-2">
                <div className="flex items-center gap-2">
                    {isCoaching ? <BookOpenIcon className="h-5 w-5 text-blue-300" aria-hidden="true" /> : <TrophyIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />}
                    <span>{vattle.timeLimit} min</span>
                </div>
                {vattle.status === 'active' && vattle.startTime ? (
                    <BattleTimer startTime={vattle.startTime} timeLimit={vattle.timeLimit} size="sm" />
                ) : vattle.status === 'pending' ? (
                    <span className="text-gray-400 font-orbitron text-sm tracking-wider">Ready to Start</span>
                ) : null}
            </div>

            {/* Actions */}
            {!isComingSoon && (
                <div className="mt-1">
                    {vattle.status === 'pending' && (
                        <button
                            onClick={onJoin}
                            disabled={isCreator}
                            className="w-full py-2.5 font-semibold rounded-lg transition-all bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isCreator ? 'Waiting for Challenger...' : 'ACCEPT CHALLENGE'}
                        </button>
                    )}

                    {vattle.status === 'active' && isParticipant && (
                        <button onClick={onEnter} className="w-full py-2.5 font-semibold rounded-lg transition-all bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 active:translate-y-0">Enter Arena</button>
                    )}

                    {vattle.status === 'active' && !isParticipant && (
                        <button onClick={onSpectate} className="w-full py-2.5 font-semibold rounded-lg transition-all bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:translate-y-0">Watch Live</button>
                    )}

                    {vattle.status === 'voting' && <button onClick={onView} className="w-full py-2.5 font-semibold rounded-lg transition-all bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:translate-y-0">Vote Now</button>}
                    {vattle.status === 'completed' && <button onClick={onView} className={`w-full py-2.5 font-semibold rounded-lg transition-all text-white hover:-translate-y-0.5 active:translate-y-0 ${isCoaching ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20' : 'bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-900/20'}`}>{isCoaching ? 'View Review' : 'View VOD'}</button>}
                </div>
            )}

            {isComingSoon && (
                <button disabled className="w-full py-2.5 font-semibold rounded-lg transition-all bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700">
                    Viewing Unavailable
                </button>
            )}
        </div>
    );
};


const VattleArena: React.FC<VattleArenaProps> = ({ userProfile, userBattles, showcaseBattles, onEnterBattle, onSpectateBattle, onViewVattle, onJoinVattle, onWaitlist, onRequestBattle, onEnterVibeLab }) => {
    const [vattleToJoin, setVattleToJoin] = useState<VattleConfig | null>(null);
    const winRate = userProfile.stats.vattlesPlayed > 0 ? ((userProfile.stats.wins / userProfile.stats.vattlesPlayed) * 100).toFixed(0) : 0;

    // Featured are from showcaseBattles
    const featuredVattles = showcaseBattles.filter(v => v.isFeatured && v.status === 'active');

    // Helper to check participation
    const checkIsParticipant = (vattle: VattleConfig, username: string) => {
        return vattle.creatorName === username ||
            vattle.invitedOpponent === username ||
            vattle.studentName === username;
    };

    return (
        <div className="animate-fade-in">
            {/* Stats Header */}
            <section className="mb-10 p-6 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 flex items-center justify-between flex-wrap gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative">
                        <img src={userProfile.avatarUrl} className="w-16 h-16 rounded-full border-2 border-purple-500/50 shadow-lg shadow-purple-500/10" alt="Avatar" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-vattles-bg rounded-full" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="font-orbitron text-2xl font-black text-white tracking-tight">System.auth({userProfile.name})</h2>
                            {userProfile.isWarStarter && <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-orange-500/30">War Starter</span>}
                        </div>
                        <p className="text-purple-400/80 font-mono text-xs mt-1 tracking-tighter uppercase">Uplink Status: Optimized // Rank: {userProfile.rankTier.replace('-', ' ')}</p>
                    </div>
                </div>

                <div className="flex gap-10 text-center relative z-10">
                    <div className="group cursor-default">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1 group-hover:text-teal-400 transition-colors">Combat Wins</p>
                        <p className="text-3xl font-black font-orbitron text-white">{userProfile.stats.wins}</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1 group-hover:text-purple-400 transition-colors">Success Rate</p>
                        <p className="text-3xl font-black font-orbitron text-white">{winRate}%</p>
                    </div>
                    <div className="group cursor-default">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1 group-hover:text-yellow-400 transition-colors">Total Vattles</p>
                        <p className="text-3xl font-black font-orbitron text-white">{userProfile.stats.vattlesPlayed}</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={onEnterVibeLab}
                        className="flex flex-col items-center justify-center gap-1 group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center transition-all group-hover:bg-purple-600/30 group-hover:border-purple-400 group-hover:-translate-y-1 shadow-lg shadow-purple-900/20">
                            <BrainCircuitIcon className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                        </div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Vibe Lab</span>
                    </button>
                </div>
            </section>

            {/* Spotlight / Featured Section */}
            {featuredVattles.length > 0 && (
                <section className="mb-12">
                    <h2 className="font-orbitron text-3xl font-bold text-white mb-4">Spotlight</h2>
                    {/* Increased vertical padding (py-6) to prevent hover scale clipping */}
                    <div className="flex gap-6 overflow-x-auto py-6 -mx-4 px-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 #1f2937' }}>
                        {featuredVattles.map(vattle => (
                            <SpotlightVattleCard
                                key={vattle.id}
                                vattle={vattle}
                                onSpectate={() => onSpectateBattle(vattle)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* YOUR BATTLES SECTION */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
                    <h3 className="font-orbitron text-xl font-bold text-teal-300 flex items-center gap-2">
                        YOUR BATTLES
                    </h3>
                    <button onClick={onRequestBattle} className="flex items-center gap-2 px-4 py-2 bg-teal-600/20 text-teal-300 hover:bg-teal-600/40 border border-teal-500/50 rounded-lg text-sm font-bold transition-all">
                        <UserPlusIcon className="h-4 w-4" /> Request Battle
                    </button>
                </div>

                {userBattles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userBattles.map(vattle => (
                            <VattleCard
                                key={vattle.id}
                                vattle={vattle}
                                onEnter={() => onEnterBattle(vattle)}
                                onSpectate={() => onSpectateBattle(vattle)}
                                onView={() => onViewVattle(vattle)}
                                onJoin={() => setVattleToJoin(vattle)}
                                isCreator={userProfile.name === vattle.creatorName}
                                isParticipant={checkIsParticipant(vattle, userProfile.name)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-black/10 rounded-lg border border-dashed border-gray-700">
                        <SwordsIcon className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <p className="font-semibold text-gray-400 text-lg">No battles yet.</p>
                        <button onClick={onRequestBattle} className="mt-4 text-teal-400 hover:text-teal-300 underline font-semibold">Request a battle to start!</button>
                    </div>
                )}
            </section>

            {/* LIVE & RECENT SECTION */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
                    <h3 className="font-orbitron text-xl font-bold text-purple-300 flex items-center gap-2">
                        LIVE & RECENT
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showcaseBattles.map(vattle => (
                        <VattleCard
                            key={vattle.id}
                            vattle={vattle}
                            onEnter={() => onEnterBattle(vattle)}
                            onSpectate={() => onSpectateBattle(vattle)}
                            onView={() => onViewVattle(vattle)}
                            onJoin={() => setVattleToJoin(vattle)}
                            isCreator={userProfile.name === vattle.creatorName}
                            isParticipant={checkIsParticipant(vattle, userProfile.name)}
                        />
                    ))}
                </div>
            </section>

            <Modal
                isOpen={!!vattleToJoin}
                onClose={() => setVattleToJoin(null)}
                title="Join Vattle"
            >
                <div>
                    <p className="text-gray-300 mb-6 text-center">
                        You are about to enter the Vattle: <strong className="text-white">{vattleToJoin?.theme}</strong>. The clock will start immediately. Are you ready?
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setVattleToJoin(null)}
                            className="w-full py-2 font-semibold rounded-lg transition-all bg-gray-700/80 hover:bg-gray-700 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (vattleToJoin) {
                                    onJoinVattle(vattleToJoin);
                                }
                                setVattleToJoin(null);
                            }}
                            className="w-full py-2 font-semibold rounded-lg transition-all bg-teal-600 hover:bg-teal-500 text-white"
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </Modal>
            <style>{`
                .overflow-x-auto::-webkit-scrollbar {
                    height: 8px;
                }
                .overflow-x-auto::-webkit-scrollbar-track {
                    background: #1f2937;
                    border-radius: 10px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background: #4c1d95;
                    border-radius: 10px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                    background: #5b21b6;
                }
             `}</style>
        </div>
    );
};

export default VattleArena;
