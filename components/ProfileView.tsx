
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, ProfileTheme } from '../types';
import { LogoIcon, TrophyIcon, SparklesIcon, UserIcon, PinIcon, ShieldCheckIcon, BrainCircuitIcon, FirstWinIcon, WinStreakIcon, CyberpunkMasterIcon, PromptVirtuosoIcon, HandThumbUpIcon, SwordsIcon } from './icons';

interface ProfileViewProps {
    userProfile: UserProfile;
    onBack: () => void;
    onEdit: () => void;
    onPinItem: (vattleId: string) => void;
    onUnpinItem: (vattleId: string) => void;
    onUpdateVibeAnalysis: (analysis: string) => void;
    onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const badgeIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    FirstWinIcon,
    WinStreakIcon,
    CyberpunkMasterIcon,
    PromptVirtuosoIcon,
    TrophyIcon // fallback
};

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; className?: string; }> = ({ label, value, icon, className = '' }) => (
    <div className={`p-4 rounded-lg flex items-center gap-4 ${className}`}>
        <div className="text-purple-400" aria-hidden="true">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const VibeAnalysisCard: React.FC<{ userProfile: UserProfile; onUpdate: (analysis: string) => void; className?: string }> = ({ userProfile, onUpdate, className = '' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cooldownTime, setCooldownTime] = useState('');

    const COOLDOWN_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

    useEffect(() => {
        if (!userProfile.lastVibeRecalibration) {
            setCooldownTime('');
            return;
        }

        const lastRecalibration = new Date(userProfile.lastVibeRecalibration).getTime();
        const cooldownEndTime = lastRecalibration + COOLDOWN_DURATION;
        
        const updateCooldown = () => {
            const now = Date.now();
            if (now < cooldownEndTime) {
                const remaining = cooldownEndTime - now;
                const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                setCooldownTime(`${days}d ${hours}h ${minutes}m`);
            } else {
                setCooldownTime('');
            }
        };

        updateCooldown();
        const interval = setInterval(updateCooldown, 60000); // Update every minute
        return () => clearInterval(interval);

    }, [userProfile.lastVibeRecalibration]);

    const handleRecalibrate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const portfolioSummary = userProfile.portfolio
                .slice(0, 20) // Use last 20 Vattles
                .map(p => `- Title: "${p.title}", Theme: "${p.theme}", Result: ${p.result}`)
                .join('\n');
            
            const prompt = `You are a "Vibe Analyst" for a creative coding competition platform called Vattles. Analyze the following Vattle history for a user and provide a short, insightful, and flavorful summary of their creative and coding style. Focus on recurring themes, aesthetic choices, and overall "vibe". Keep it concise (2-3 sentences). Do not use markdown.

User's Vattle History (most recent):
${portfolioSummary}`;

            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            onUpdate(response.text);

        } catch (e) {
            console.error("Vibe analysis failed:", e);
            setError('Failed to recalibrate vibe. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const isButtonDisabled = isLoading || !!cooldownTime;
    const buttonText = isLoading ? 'Analyzing...' : cooldownTime ? `Recalibrate in ${cooldownTime}` : 'Recalibrate Vibe';

    return (
        <section className={`${className} p-6 sm:p-8 relative overflow-hidden`}>
             <div className="absolute -top-10 -right-10 text-purple-900/50">
                <BrainCircuitIcon className="h-40 w-40 transform-gpu rotate-12" />
            </div>
             <div className="relative z-10">
                <h3 className="font-orbitron text-3xl font-bold text-white flex items-center gap-3">
                    <SparklesIcon className="h-7 w-7 text-purple-400"/>
                    AI Vibe Analysis
                </h3>
                <p className="text-gray-300 mt-4 mb-6 italic min-h-[48px]">
                    {userProfile.vibeAnalysis || "No vibe analysis generated yet. Click 'Recalibrate Vibe' to get your AI-powered coding persona summary!"}
                </p>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                    onClick={handleRecalibrate}
                    disabled={isButtonDisabled}
                    className="flex items-center justify-center gap-2 px-6 py-2 font-semibold rounded-lg text-base transition-all bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:text-gray-400"
                >
                    {isLoading && <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {buttonText}
                </button>
            </div>
        </section>
    );
};


const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onBack, onEdit, onPinItem, onUnpinItem, onUpdateVibeAnalysis, onUpdateProfile }) => {
    const { name, avatarUrl, joinDate, stats, portfolio, showcase, status, rivalries } = userProfile;
    const winRate = stats.vattlesPlayed > 0 ? ((stats.wins / stats.vattlesPlayed) * 100).toFixed(0) : 0;
    const showcasedIds = new Set(showcase.map(item => item.vattleId));

    const themes: { [key in ProfileTheme]: { name: string; classes: string; sectionClasses: string; accentText: string; headerClasses: string; } } = {
        default: { name: "Default", classes: "bg-[#0D0B14]", sectionClasses: "bg-black/20 border border-gray-700/50 rounded-lg", accentText: "text-purple-300", headerClasses: `border-purple-500 shadow-purple-900/40`},
        synthwave: { name: "Synthwave", classes: "bg-gradient-to-br from-[#2c134d] to-[#130f2b]", sectionClasses: "bg-black/30 border border-pink-500/40 backdrop-blur-sm rounded-lg", accentText: "text-cyan-300", headerClasses: "border-pink-500 shadow-pink-900/40"},
        matrix: { name: "Matrix", classes: "bg-[#021a02] text-green-400", sectionClasses: "bg-black/40 border border-green-500/40 backdrop-blur-sm rounded-lg", accentText: "text-green-300", headerClasses: "border-green-500 shadow-green-900/40"},
        'brutalist-dark': { name: "Brutalist", classes: "bg-black font-mono", sectionClasses: "bg-black border-2 border-white/80", accentText: "text-white", headerClasses: "border-2 border-white/80"},
    };

    const currentTheme = themes[userProfile.profileTheme || 'default'];

    const handleThemeChange = (theme: ProfileTheme) => {
        onUpdateProfile({ profileTheme: theme });
    };

    return (
        <div className={`w-full max-w-screen-lg mx-auto animate-fade-in ${currentTheme.classes}`}>
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-10 w-10" />
                    <h1 className="font-orbitron text-xl md:text-2xl font-bold tracking-widest text-white uppercase">My Profile</h1>
                </div>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-purple-600/80 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Edit Profile</span>
                </button>
            </header>

            <main className="space-y-12">
                <section className={`${currentTheme.sectionClasses} p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6`}>
                    <img src={avatarUrl} alt={name} className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 shadow-lg ${status === 'pro' ? `border-cyan-400 shadow-cyan-900/60` : currentTheme.headerClasses}`} />
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-4 justify-center sm:justify-start flex-wrap">
                            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white">{name}</h2>
                            {status === 'pro' && (
                                <div className="flex items-center gap-2 text-cyan-300 bg-cyan-900/50 border border-cyan-700 px-3 py-1 rounded-full text-sm font-bold">
                                    <ShieldCheckIcon className="h-5 w-5" /> PRO VATTLER
                                </div>
                            )}
                        </div>
                        <p className={`${currentTheme.accentText} font-semibold mt-1`}>Member Since: {new Date(joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </section>
                
                {userProfile.status === 'pro' && (
                    <section className={`${currentTheme.sectionClasses} p-6 sm:p-8`}>
                        <h3 className="font-orbitron text-2xl font-bold text-white mb-4">Profile Theme Customization</h3>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(themes).map(([key, theme]) => (
                                <button
                                    key={key}
                                    onClick={() => handleThemeChange(key as ProfileTheme)}
                                    className={`px-4 py-2 rounded-lg font-semibold border-2 transition-colors ${
                                        userProfile.profileTheme === key 
                                        ? 'bg-teal-500 border-teal-400 text-white' 
                                        : 'bg-gray-800/50 border-gray-600 hover:border-teal-400'
                                    }`}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <VibeAnalysisCard userProfile={userProfile} onUpdate={onUpdateVibeAnalysis} className={`${currentTheme.sectionClasses} border-purple-500/30`} />

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Vattles Played" value={stats.vattlesPlayed} icon={<TrophyIcon className="h-8 w-8"/>} className={`${currentTheme.sectionClasses}`} />
                    <StatCard label="Wins" value={stats.wins} icon={<SparklesIcon className="h-8 w-8"/>} className={`${currentTheme.sectionClasses}`} />
                    <StatCard label="Losses" value={stats.losses} icon={<UserIcon className="h-8 w-8"/>} className={`${currentTheme.sectionClasses}`} />
                    <StatCard label="Win Rate" value={`${winRate}%`} icon={<TrophyIcon className="h-8 w-8"/>} className={`${currentTheme.sectionClasses}`} />
                </section>

                {rivalries && rivalries.length > 0 && (
                <section>
                    <h3 className="font-orbitron text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <SwordsIcon className="h-7 w-7 text-red-400" />
                        Rivalries
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rivalries.map(rival => (
                            <div key={rival.opponentId} className={`${currentTheme.sectionClasses} p-6 flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" />
                                    <div>
                                        <p className="font-semibold text-white">{userProfile.name}</p>
                                        <p className="font-orbitron text-2xl font-bold text-green-400">{rival.wins}</p>
                                    </div>
                                </div>

                                <span className="font-orbitron text-xl text-gray-500">VS</span>

                                <div className="flex items-center gap-4 text-right">
                                    <div>
                                        <p className="font-semibold text-white">{rival.opponentName}</p>
                                        <p className="font-orbitron text-2xl font-bold text-red-400">{rival.losses}</p>
                                    </div>
                                    <img src={rival.opponentAvatarUrl} alt={rival.opponentName} className="w-12 h-12 rounded-full border-2 border-gray-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {userProfile.endorsements && userProfile.endorsements.length > 0 && (
                    <section>
                        <h3 className="font-orbitron text-3xl font-bold text-white mb-6">Top Endorsements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {userProfile.endorsements.sort((a, b) => b.count - a.count).slice(0, 3).map(endorsement => (
                                <div key={endorsement.skill} className={`${currentTheme.sectionClasses} p-6 text-center`}>
                                    <HandThumbUpIcon className={`h-8 w-8 mx-auto mb-3 ${currentTheme.accentText}`} />
                                    <p className="text-lg font-semibold text-white">{endorsement.skill}</p>
                                    <p className="text-2xl font-bold font-orbitron text-gray-300">{endorsement.count} endorsements</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {userProfile.achievements && userProfile.achievements.length > 0 && (
                    <section>
                        <h3 className="font-orbitron text-3xl font-bold text-white mb-6">Achievements</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {userProfile.achievements.map(ach => {
                                const IconComponent = badgeIcons[ach.icon] || TrophyIcon;
                                return (
                                    <div key={ach.id} className={`${currentTheme.sectionClasses} p-4 text-center group relative flex flex-col items-center justify-center`}>
                                        <IconComponent className={`h-16 w-16 mx-auto ${currentTheme.accentText} transition-transform group-hover:scale-110`} />
                                        <p className="text-sm font-semibold text-white mt-2 h-10 flex items-center">{ach.name}</p>
                                        <div className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                            <span className="bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg">{ach.description}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-6">
                         <h3 className="font-orbitron text-3xl font-bold text-white">{status === 'pro' ? 'Pro Showcase' : 'Showcase'}</h3>
                         {status === 'pro' && (
                            <p className={`${currentTheme.accentText === 'text-purple-300' ? 'text-cyan-300' : currentTheme.accentText} text-sm`}>As a Pro Vattler, you can showcase up to 6 of your best creations.</p>
                         )}
                    </div>
                     {showcase.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {showcase.map((item) => (
                                <div 
                                    key={item.vattleId} 
                                    className={`group relative overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${currentTheme.sectionClasses.replace('rounded-lg', 'rounded-xl')} ${status === 'pro' ? 'border-cyan-800/80 hover:shadow-cyan-900/50' : 'hover:shadow-purple-900/50'}`}
                                >
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                                    <div className="absolute top-0 right-0 p-2">
                                        <button onClick={() => onUnpinItem(item.vattleId)} className="p-2 bg-black/50 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100" aria-label="Unpin item"><PinIcon className="h-5 w-5"/></button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h4 className="font-orbitron text-lg font-bold text-white">{item.title}</h4>
                                        <p className={`text-sm ${status === 'pro' ? 'text-cyan-300' : currentTheme.accentText}`}>{item.theme}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                         <div className={`text-center p-8 border-dashed ${currentTheme.sectionClasses}`}>
                            <PinIcon className="h-12 w-12 mx-auto text-gray-600" />
                            <p className="mt-4 text-gray-400">Your showcase is empty.</p>
                            <p className="text-sm text-gray-500">Pin your best Vattles from your history below to feature them here. You can pin up to {status === 'pro' ? 6 : 3} items.</p>
                         </div>
                     )}
                </section>

                <section>
                    <h3 className="font-orbitron text-3xl font-bold text-white mb-6">Vattle History</h3>
                    <div className={`${currentTheme.sectionClasses} overflow-hidden`}>
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider">Title</th>
                                    <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider hidden md:table-cell">Date</th>
                                    <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider hidden md:table-cell">Opponent</th>
                                    <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-center">Result</th>
                                    <th scope="col" className="p-4 text-sm font-semibold uppercase text-gray-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {portfolio.map(item => (
                                    <tr key={item.vattleId} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-white">{item.title}</p>
                                            <p className="text-sm text-gray-400">{item.theme}</p>
                                        </td>
                                        <td className="p-4 text-gray-300 hidden md:table-cell">{item.date}</td>
                                        <td className="p-4 text-gray-300 hidden md:table-cell">{item.opponentName}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.result === 'win' ? 'bg-green-500/20 text-green-300' : item.result === 'loss' ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                                {item.result.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {!showcasedIds.has(item.vattleId) && (
                                                <button onClick={() => onPinItem(item.vattleId)} className="flex items-center gap-2 ml-auto bg-gray-700/80 hover:bg-purple-600 text-white font-semibold px-3 py-1.5 text-sm rounded-lg transition-all" aria-label="Pin item">
                                                    <PinIcon className="h-4 w-4" /> <span className="hidden lg:inline">Pin</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
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

export default ProfileView;
