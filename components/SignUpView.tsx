
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface SignUpViewProps {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
}

const DEBOUNCE_DELAY = 500;

const SignUpView: React.FC<SignUpViewProps> = ({ onSuccess, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

    // Basic username availability check (Mocked as Supabase check might require Edge Function)
    // In a real app, you'd select count from profiles where username = x
    useEffect(() => {
        if (username.length < 3) {
            setUsernameStatus('idle');
            return;
        }
        setUsernameStatus('checking');
        const handler = setTimeout(async () => {
            // Check if username exists in profiles
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('username', username);
            
            if (error) {
                console.error(error);
                setUsernameStatus('idle'); // Fallback
            } else {
                setUsernameStatus(count && count > 0 ? 'invalid' : 'valid');
            }
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [username]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameStatus === 'invalid') {
            setErrorMsg('Username is taken.');
            return;
        }
        
        setIsLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        full_name: displayName,
                    }
                }
            });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            setErrorMsg(error.message || 'Sign up failed');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";

    return (
        <form onSubmit={handleSignUp} className="space-y-4">
            {errorMsg && <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">{errorMsg}</div>}
            
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">Username</label>
                <div className="relative">
                    <input 
                        type="text" 
                        id="username" 
                        className={inputStyles} 
                        placeholder="VibeMaster42"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        required
                        minLength={3}
                    />
                    <div className="absolute right-3 top-2.5">
                        {usernameStatus === 'checking' && <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>}
                        {usernameStatus === 'valid' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
                        {usernameStatus === 'invalid' && <XCircleIcon className="h-5 w-5 text-red-400" />}
                    </div>
                </div>
                {usernameStatus === 'invalid' && <p className="text-xs text-red-400 mt-1">Username already taken.</p>}
            </div>

            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-purple-300 mb-2">Display Name (Optional)</label>
                <input 
                    type="text" 
                    id="displayName" 
                    className={inputStyles} 
                    placeholder="John Doe" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </div>

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
                    minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
            </div>

            <button 
                type="submit" 
                disabled={isLoading || usernameStatus === 'invalid'} 
                className="w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/40 hover:shadow-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="text-center mt-6">
                <button type="button" onClick={onSwitchToLogin} className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                    Already have an account? Log In
                </button>
            </div>
        </form>
    );
};

export default SignUpView;
