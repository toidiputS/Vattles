import React, { useState, useMemo } from 'react';
import { LeaderboardUser } from '../types';
import { LogoIcon, TrophyIcon, UserIcon, ShieldCheckIcon, StarIcon, SparklesIcon, MedalIcon, FounderBadge, WarStarterBadge } from './icons';
import { getRankTier } from '../lib/rankUtils';

const VIBE_CATEGORIES: LeaderboardUser['mainVibe'][] = ['Cyberpunk', 'Sci-Fi', 'Minimalist', 'Retro', 'Nature'];

const mockLeaderboardData: LeaderboardUser[] = Array.from({ length: 100 }, (_, i) => {
    const mmr = 3000 - i * 25;
    return {
        id: `user-${i + 1}`,
        rank: i + 1,
        username: `Vattler_${String(i + 1).padStart(3, '0')}`,
        avatarUrl: `https://i.pravatar.cc/80?u=user${i + 1}`,
        status: i === 0 ? 'pro' : (i > 0 && i < 4) ? 'featured' : undefined,
        mmr: mmr,
        wins: Math.floor(Math.random() * 50) + 10,
        losses: Math.floor(Math.random() * 30) + 5,
        rankTier: getRankTier(mmr),
        isFounder: i < 50, // Half of them are founders
        isWarStarter: i === 0,
        mainVibe: VIBE_CATEGORIES[i % VIBE_CATEGORIES.length],
    };
});

const StatusBadge: React.FC<{ status: 'pro' | 'featured' }> = ({ status }) => status === 'pro' ? (
    <div className="flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-900/50 border border-cyan-700 px-2 py-0.5 rounded-full"><ShieldCheckIcon className="h-3 w-3" /> Pro</div>
) : (
    <div className="flex items-center gap-1 text-xs font-bold text-yellow-300 bg-yellow-900/50 border border-yellow-700 px-2 py-0.5 rounded-full"><StarIcon className="h-3 w-3" /> Featured</div>
);

interface RankingsViewProps {
    onBack: () => void;
}

const RankingsView: React.FC<RankingsViewProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'global' | 'vibe' | 'friends'>('global');
    const [selectedVibe, setSelectedVibe] = useState<LeaderboardUser['mainVibe'] | 'all'>('all');

    const featuredVattlers = useMemo(() => mockLeaderboardData.filter(u => u.status === 'featured' || u.status === 'pro').slice(0, 3), []);
    const filteredData = useMemo(() => {
        if (activeTab === 'vibe' && selectedVibe !== 'all') {
            return mockLeaderboardData.filter(user => user.mainVibe === selectedVibe);
        }
        return mockLeaderboardData;
    }, [activeTab, selectedVibe]);

    const LeaderboardRow: React.FC<{ user: LeaderboardUser }> = ({ user }) => (
        <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
            <td className="p-4 text-center font-bold text-white w-16">
                <div className="flex flex-col items-center gap-1">
                    <span>{user.rank}</span>
                    <MedalIcon tier={user.rankTier} className="h-6 w-6" />
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={user.avatarUrl} alt={user.username} className="h-10 w-10 rounded-full border-2 border-purple-500/50" />
                        {user.isWarStarter && <WarStarterBadge className="absolute -top-1.5 -right-1.5 h-5 w-5 drop-shadow-[0_0_5px_#FB923C]" />}
                        {user.isFounder && !user.isWarStarter && <FounderBadge className="absolute -top-1 -right-1 h-4 w-4 drop-shadow-[0_0_2px_#FCD34D]" />}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{user.username}</p>
                            {user.isWarStarter && <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter bg-orange-900/30 px-1 rounded animate-pulse">War Starter</span>}
                            {user.isFounder && !user.isWarStarter && <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter bg-yellow-900/30 px-1 rounded">Founder</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            {user.status && <StatusBadge status={user.status} />}
                            <p className="text-sm text-gray-400 capitalize">{user.isWarStarter ? 'The Architect' : user.rankTier.replace('-', ' ')}</p>
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-center font-semibold text-teal-300 hidden md:table-cell">{user.mmr}</td>
            <td className="p-4 text-center text-green-400 hidden sm:table-cell">{user.wins}</td>
            <td className="p-4 text-center text-red-400 hidden sm:table-cell">{user.losses}</td>
        </tr>
    );

    const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; id: string; controls: string; }> = ({ label, icon, isActive, onClick, id, controls }) => (
        <button role="tab" id={id} aria-controls={controls} aria-selected={isActive} onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${isActive ? 'text-purple-300 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'}`}>
            {icon} {label}
        </button>
    );

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">Rankings</h1>
                </div>
                <div className="w-[150px]"></div> {/* Spacer */}
            </header>

            <main>
                <section className="mb-10">
                    <h3 className="font-orbitron text-2xl font-bold text-white mb-4">Featured Vattlers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredVattlers.map(vattler => (
                            <div key={vattler.id} className="bg-black/20 p-4 rounded-xl border border-gray-800/50 flex items-center gap-4 transform transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50">
                                <img src={vattler.avatarUrl} alt={vattler.username} className="w-16 h-16 rounded-full border-2 border-gray-700/50" />
                                <div>
                                    <h4 className="font-orbitron text-lg font-bold text-white">{vattler.username}</h4>
                                    {vattler.status && <div className="mt-1"><StatusBadge status={vattler.status} /></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div role="tablist" aria-label="Rankings categories" className="flex border-b border-gray-700 mb-6">
                    <TabButton id="tab-global" controls="panel-global" label="Global Top 100" icon={<TrophyIcon className="h-5 w-5" aria-hidden="true" />} isActive={activeTab === 'global'} onClick={() => setActiveTab('global')} />
                    <TabButton id="tab-vibe" controls="panel-vibe" label="Vibe Masters" icon={<SparklesIcon className="h-5 w-5" aria-hidden="true" />} isActive={activeTab === 'vibe'} onClick={() => setActiveTab('vibe')} />
                    <TabButton id="tab-friends" controls="panel-friends" label="Friends" icon={<UserIcon className="h-5 w-5" aria-hidden="true" />} isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
                </div>

                <div role="tabpanel" id="panel-global" aria-labelledby="tab-global" hidden={activeTab !== 'global'}>
                    {/* Content is the table below, shown based on filter */}
                </div>
                <div role="tabpanel" id="panel-vibe" aria-labelledby="tab-vibe" hidden={activeTab !== 'vibe'}>
                    {/* Content is the table below, shown based on filter */}
                </div>
                <div role="tabpanel" id="panel-friends" aria-labelledby="tab-friends" hidden={activeTab !== 'friends'}>
                    {activeTab === 'friends' && <p className="text-center text-gray-500 py-10">Friends leaderboard coming soon!</p>}
                </div>

                {activeTab !== 'friends' && (
                    <>
                        {activeTab === 'vibe' && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                <button onClick={() => setSelectedVibe('all')} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedVibe === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>All Vibes</button>
                                {VIBE_CATEGORIES.map(vibe => (
                                    <button key={vibe} onClick={() => setSelectedVibe(vibe)} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedVibe === vibe ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>{vibe}</button>
                                ))}
                            </div>
                        )}

                        <div className="bg-black/20 rounded-lg border border-gray-700/50 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-center w-16">Rank</th>
                                        <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider">Player</th>
                                        <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-center hidden md:table-cell">MMR</th>
                                        <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-center hidden sm:table-cell">Wins</th>
                                        <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-center hidden sm:table-cell">Losses</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredData.slice(0, 100).map(user => <LeaderboardRow key={user.id} user={user} />)}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default RankingsView;