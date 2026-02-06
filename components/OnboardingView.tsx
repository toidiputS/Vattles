
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, CameraIcon } from './icons';

const DEBOUNCE_DELAY = 500;
const TAKEN_USERNAMES = ['admin', 'root', 'vibemaster', 'codeninja', 'vattles'];

interface OnboardingViewProps {
    userProfile: UserProfile;
    onComplete: (username: string, avatar: string) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ userProfile, onComplete }) => {
    // Pre-fill username for quick access
    const [username, setUsername] = useState('VibeCoder');
    const [avatar, setAvatar] = useState(userProfile.avatarUrl);
    const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'short'>('idle');
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced username validation
    useEffect(() => {
        setValidationStatus('idle');
        if (username.length < 3) {
            if (username.length > 0) {
                setValidationStatus('short');
            }
            return;
        }

        setValidationStatus('checking');
        const handler = setTimeout(() => {
            if (TAKEN_USERNAMES.includes(username.toLowerCase())) {
                setValidationStatus('invalid');
            } else {
                setValidationStatus('valid');
            }
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(handler);
        };
    }, [username]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setAvatar(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validationStatus === 'valid') {
            onComplete(username, avatar);
        }
    };
    
    const getValidationMessage = () => {
        switch (validationStatus) {
            case 'checking':
                return <p className="text-sm text-yellow-400 flex items-center gap-1"><svg className="animate-spin h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Checking...</p>;
            case 'valid':
                return <p className="text-sm text-green-400 flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> Username is available!</p>;
            case 'invalid':
                return <p className="text-sm text-red-400 flex items-center gap-1"><XCircleIcon className="h-4 w-4" /> Sorry, this username is taken.</p>;
            case 'short':
                return <p className="text-sm text-gray-400">Username must be at least 3 characters.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0B14] text-gray-200 flex flex-col items-center justify-center p-4 animate-fade-in relative">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, rgba(13, 11, 20, 0) 70%)' }}></div>
            <main className="relative z-10 w-full max-w-lg bg-black/20 rounded-lg border border-gray-700/50 p-8 text-center">
                <SparklesIcon className="h-16 w-16 mx-auto text-purple-400" />
                <h1 className="font-orbitron text-3xl font-bold text-white mt-4">Welcome to Vattles!</h1>
                <p className="text-gray-400 mt-2 mb-8">Let's set up your profile.</p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <img src={avatar} alt="Profile Avatar" className="w-32 h-32 rounded-full border-4 border-purple-500/50 object-cover" />
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <CameraIcon className="h-8 w-8" />
                            </label>
                            <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                        </div>
                        <p className="text-sm text-gray-500">Click image to upload a new avatar.</p>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">Choose your unique @username</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">@</span>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                placeholder="YourVibeHandle"
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-md pl-8 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                minLength={3}
                                maxLength={20}
                                pattern="^[a-zA-Z0-9_]{3,20}$"
                                ref={inputRef}
                            />
                        </div>
                        <div className="h-5 mt-2 ml-1">
                            {getValidationMessage()}
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={validationStatus !== 'valid'}
                        className="w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-400 hover:shadow-teal-400/50 disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        Complete Setup
                    </button>
                </form>
            </main>
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
export default OnboardingView;
    