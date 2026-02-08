
import React, { useState } from 'react';
import Modal from './Modal';
import SignUpView from './SignUpView';
import { LogoIcon, GoogleIcon, GithubIcon, CodeBracketIcon, SparklesIcon, TrophyIcon, ShieldCheckIcon, StarIcon } from './icons';
import { LeaderboardUser } from '../types';
import { supabase } from '../lib/supabase';

const features = [
    {
        icon: <CodeBracketIcon className="h-10 w-10 text-teal-300" />,
        title: 'Code at the Speed of Vibe',
        description: 'Go head-to-head in timed coding challenges. Flex your frontend skills and create stunning web apps under pressure.',
    },
    {
        icon: <SparklesIcon className="h-10 w-10 text-purple-300" />,
        title: 'Vibe Lab Prototyping',
        description: 'Enter the Vibe Lab to experiment with AI-generated components. Rapidly prototype ideas and discover new aesthetics for your creations.',
    },
    {
        icon: <TrophyIcon className="h-10 w-10 text-yellow-300" />,
        title: 'Community Judged, Vibe Approved',
        description: 'After the timer runs out, the community votes on whose creation has the best vibe. Climb the leaderboards and become a Vattle legend.',
    },
];

const featuredVattlers: Pick<LeaderboardUser, 'username' | 'avatarUrl' | 'mainVibe' | 'status'>[] = [
    {
        username: 'CodeNinja',
        avatarUrl: 'https://i.pravatar.cc/150?u=CodeNinja',
        mainVibe: 'Cyberpunk',
        status: 'pro',
    },
    {
        username: 'Vibemaster',
        avatarUrl: 'https://i.pravatar.cc/150?u=Vibemaster',
        mainVibe: 'Sci-Fi',
        status: 'featured',
    },
    {
        username: 'GlitchArtisan',
        avatarUrl: 'https://i.pravatar.cc/150?u=GlitchArtisan',
        mainVibe: 'Retro',
        status: 'featured',
    },
];

const StatusBadge: React.FC<{ status: 'pro' | 'featured' }> = ({ status }) => status === 'pro' ? (
    <div className="flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-900/50 border border-cyan-700 px-2 py-0.5 rounded-full"><ShieldCheckIcon className="h-3 w-3" /> Pro</div>
) : (
    <div className="flex items-center gap-1 text-xs font-bold text-yellow-300 bg-yellow-900/50 border border-yellow-700 px-2 py-0.5 rounded-full"><StarIcon className="h-3 w-3" /> Featured</div>
);

interface AuthViewProps {
    onGuestLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onGuestLogin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOpenModal = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsModalOpen(true);
        setErrorMsg('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            setIsModalOpen(false);
        } catch (error: any) {
            setErrorMsg(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    }

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
            });
            if (error) throw error;
        } catch (error: any) {
            alert('OAuth Error: ' + error.message);
        }
    };

    const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";
    const buttonStyles = "w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-[#0D0B14] text-gray-200 flex flex-col items-center p-4 animate-fade-in relative overflow-x-hidden pt-10 sm:pt-16">
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, rgba(13, 11, 20, 0) 70%)',
                }}
            ></div>

            <div className="relative z-10 w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-12">
                    <LogoIcon className="h-32 w-32 sm:h-40 sm:w-40 mx-auto" />
                    <h1 className="font-orbitron text-4xl sm:text-5xl font-bold tracking-widest text-white uppercase mt-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300" style={{ textShadow: '0 0 20px rgba(192, 132, 252, 0.3)' }}>
                        VATTLES
                    </h1>
                    <p className="text-lg sm:text-xl text-cyan-300 tracking-[0.2em] uppercase mt-1">
                        Vibe Code. Battle. Create.
                    </p>
                    <p className="max-w-2xl mx-auto mt-6 text-gray-300">
                        The ultimate arena where creative coding meets AI-powered artistry. Challenge opponents, build stunning web apps against the clock, and let the community decide who has the superior vibe.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => handleOpenModal('login')} className="px-10 py-4 font-orbitron text-xl font-bold rounded-lg transition-all duration-300 bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/40 hover:shadow-teal-400/60 transform hover:scale-105">
                            Log In
                        </button>
                        <button onClick={() => handleOpenModal('signup')} className="px-10 py-4 font-orbitron text-xl font-bold rounded-lg transition-all duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/40 hover:shadow-purple-500/60 transform hover:scale-105">
                            Sign Up
                        </button>
                    </div>
                    <div className="mt-6">
                        <button onClick={onGuestLogin} className="text-cyan-400 hover:text-cyan-300 font-orbitron tracking-widest text-sm uppercase transition-all duration-300 border-b border-transparent hover:border-cyan-300 pb-1">
                            &mdash; Or Try Guest Mode &mdash;
                        </button>
                    </div>
                </header>

                <main>
                    <section className="mb-24">
                        <h2 className="font-orbitron text-4xl font-bold text-center text-white mb-12">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <div key={feature.title} className="bg-black/20 p-8 rounded-xl border border-gray-800/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/40">
                                    <div className="flex justify-center items-center h-20 w-20 rounded-full bg-gray-900/50 border-2 border-gray-700/50 mx-auto mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-orbitron text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-24">
                        <h2 className="font-orbitron text-4xl font-bold text-center text-white mb-12">Featured Vattlers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredVattlers.map(vattler => (
                                <div key={vattler.username} className="bg-black/20 p-6 rounded-xl border border-gray-800/50 text-center transform transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/40">
                                    <img src={vattler.avatarUrl} alt={vattler.username} className="w-24 h-24 rounded-full mx-auto border-4 border-gray-700/50" />
                                    <h3 className="font-orbitron text-xl font-bold text-white mt-4">{vattler.username}</h3>
                                    <div className="flex justify-center mt-2">
                                        {vattler.status && <StatusBadge status={vattler.status} />}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3">
                                        <span className="font-semibold text-purple-300">Main Vibe:</span> {vattler.mainVibe}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="font-orbitron text-4xl font-bold text-center text-white mb-12">Hall of Vibes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="group relative overflow-hidden rounded-xl border border-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/50">
                                    <img src={`https://picsum.photos/seed/showcase${i}/500/350`} alt="Showcase item" className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <h3 className="font-orbitron text-2xl font-bold text-white">Project Vibe-{i + 1}</h3>
                                        <p className="text-sm text-purple-300">by Vattler_00{i + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={authMode === 'login' ? 'Log In to Vattles' : 'Create Account'}>
                {authMode === 'signup' ? (
                    <SignUpView onSuccess={() => { alert('Account created! Please check your email.'); setIsModalOpen(false); }} onSwitchToLogin={() => { setAuthMode('login'); setErrorMsg(''); }} />
                ) : (
                    <>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {errorMsg && <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">{errorMsg}</div>}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={inputStyles}
                                    placeholder="you@vattles.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={inputStyles}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button type="submit" disabled={isLoading} className={`${buttonStyles} bg-teal-500 text-white shadow-teal-500/30 hover:bg-teal-400 hover:shadow-teal-400/50`}>
                                {isLoading ? 'Processing...' : 'Log In'}
                            </button>
                        </form>
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => handleOAuthLogin('google')} className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-800/50 border border-gray-600 text-white hover:bg-gray-700/80 transition-colors">
                                <GoogleIcon className="h-5 w-5" /> Google
                            </button>
                            <button onClick={() => handleOAuthLogin('github')} className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-800/50 border border-gray-600 text-white hover:bg-gray-700/80 transition-colors">
                                <GithubIcon className="h-5 w-5" /> GitHub
                            </button>
                        </div>
                        <div className="text-center mt-6">
                            <button onClick={() => { setAuthMode('signup'); setErrorMsg(''); }} className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                                Don't have an account? Sign Up
                            </button>
                        </div>
                    </>
                )}
            </Modal>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AuthView;
