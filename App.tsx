
import React, { useState, useEffect } from 'react';
import { UserProfile, VattleConfig, Ratings, Tournament, PortfolioItem, Achievement, Endorsement, Rivalry, PromptLibraryItem, ShowcaseItem, RankTier } from './types';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Views
import AuthView from './components/AuthView';
import VattleArena from './components/VattleArena';
import BattleRoom from './components/BattleRoom';
import SpectatorRoom from './components/SpectatorRoom';
import VotingView from './components/VotingView';
import ProfileView from './components/ProfileView';
import RankingsView from './components/RankingsView';
import TournamentsView from './components/TournamentsView';
import TournamentDetailView from './components/TournamentDetailView';
import VibeLabsView from './components/VibeLabsView';
import ApiView from './components/ApiView';
import StreamingView from './components/StreamingView';
import OnboardingView from './components/OnboardingView';
import LiveStatsOverlay from './components/LiveStatsOverlay';
import VotingOverlay from './components/VotingOverlay';
import { getLocalBattles, saveLocalBattle, updateLocalBattle } from './lib/db';

// Components
import Header from './components/Header';
import CreateVattleModal from './components/CreateVattleModal';
import ProfileModal from './components/ProfileModal';
import WaitlistModal from './components/WaitlistModal';

import { getRankTier } from './lib/rankUtils';

// --- MOCK DATA FALLBACKS (Used if DB is empty or for UI scaffolding) ---
const mockPortfolio: PortfolioItem[] = [
    { vattleId: 'vattle-3', title: 'Galactic Glider', theme: 'Vaporwave Space', date: '2023-10-22', opponentName: 'CodeNinja', result: 'win' },
];
const mockAchievements: Achievement[] = [
    { id: 'ach-1', name: 'First Win', description: 'Achieved your first victory in a Vattle.', icon: 'FirstWinIcon' },
];
const initialUserProfile: UserProfile = {
    id: 'guest',
    name: 'Guest',
    avatarUrl: 'https://i.pravatar.cc/150?u=Guest',
    joinDate: new Date().toISOString(),
    role: 'player',
    status: 'pro',
    hasCompletedOnboarding: false,
    stats: { vattlesPlayed: 0, wins: 0, losses: 0, mmr: 1200 },
    rankTier: 'silver',
    isFounder: true,
    isWarStarter: true,
    portfolio: mockPortfolio,
    showcase: [],
    achievements: mockAchievements,
    endorsements: [],
    profileTheme: 'default',
    rivalries: [],
    promptLibrary: [],
    currentVibeTrack: { title: 'No track generated', isPlaying: false },
};

const mockTournaments: Tournament[] = [
    { id: 't1', title: 'Vibe Masters Winter Circuit', theme: 'Winter Wonderland', type: 'official', status: 'live', prizePool: '$5,000', maxParticipants: 64, participants: Array.from({ length: 60 }, (_, i) => ({ id: `p${i}`, name: `Vattler${i}`, seed: i + 1, avatarUrl: `https://i.pravatar.cc/40?u=p${i}` })), rounds: [] },
];

type View = 'auth' | 'arena' | 'battle' | 'spectate' | 'voting' | 'profile' | 'rankings' | 'tournaments' | 'tournament_detail' | 'vibelabs' | 'api' | 'streaming' | 'onboarding' | 'overlay_stats' | 'overlay_voting';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
    const [authLoading, setAuthLoading] = useState(true);
    const [view, setView] = useState<View>('auth');
    const [overlayId, setOverlayId] = useState<string>('');

    // Data State
    const [vattles, setVattles] = useState<VattleConfig[]>([
        { id: 'vattle-1', theme: 'Neon Jungle Interface', creatorName: 'VibeMaster', invitedOpponent: 'Guest', status: 'active', mode: 'standard', opponent: 'player', timeLimit: 15, startTime: Date.now() - 300000, isFeatured: true, isTrending: true },
        { id: 'vattle-2', theme: 'Minimalist Zen Dashboard', creatorName: 'CodeZen', invitedOpponent: 'Open Invite', status: 'pending', mode: 'standard', opponent: 'player', timeLimit: 10, isFeatured: true },
        { id: 'vattle-3', theme: 'Retro Arcade Components', creatorName: 'PixelArtist', invitedOpponent: 'Vattler001', status: 'voting', mode: 'standard', opponent: 'player', timeLimit: 12 },
        { id: 'vattle-4', theme: 'AI Assistant Personalities', creatorName: 'AICoach', studentName: 'Newbie', status: 'active', mode: 'coaching', opponent: 'ai', timeLimit: 30, startTime: Date.now() - 600000 },
        { id: 'vattle-quick', theme: '60s Header Challenge', creatorName: 'SpeedCoder', invitedOpponent: 'Open Invite', status: 'pending', mode: 'standard', opponent: 'player', timeLimit: 1, isTrending: true }
    ]);
    const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);

    // Active View State
    const [activeVattle, setActiveVattle] = useState<VattleConfig | null>(null);
    const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);

    // Modal State
    const [isCreateVattleModalOpen, setCreateVattleModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isWaitlistModalOpen, setWaitlistModalOpen] = useState(false);
    const [waitlistFeature, setWaitlistFeature] = useState('');
    const [waitlistDescription, setWaitlistDescription] = useState('');

    // Local State Prefs
    const [votedOn, setVotedOn] = useState<{ [key: string]: boolean }>({});
    const [registeredTournaments, setRegisteredTournaments] = useState<{ [key: string]: boolean }>({});
    const [labInitialPrompt, setLabInitialPrompt] = useState<string>('');

    // --- AUTH & PROFILE EFFECTS ---

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else setAuthLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
            } else {
                setUserProfile(initialUserProfile);
                setView('auth');
                setAuthLoading(false);
            }
        });

        // 3. Simple Routing for Overlays
        const path = window.location.pathname;
        if (path.startsWith('/overlay/')) {
            const segments = path.split('/');
            const type = segments[2];
            const id = segments[3];

            if (id) {
                setOverlayId(id);
                if (type === 'live-stats') setView('overlay_stats');
                if (type === 'voting') setView('overlay_voting');

                // If we're in an overlay, we might need a "guest" session to keep logic happy
                if (!session) handleGuestLogin();
            }
        }

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        if (userId === 'guest') {
            setUserProfile({
                ...initialUserProfile,
                name: 'Guest Vattler'
            });
            setAuthLoading(false);
            return;
        }

        try {
            console.log('Attempting to fetch profile for:', userId);
            const { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Supabase Profile Fetch Error:', {
                    status,
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });

                if (status === 406) {
                    console.warn('406 Error detected. This usually means the "profiles" table is missing or columns mismatch.');
                }
            }

            if (data) {
                setUserProfile({
                    ...initialUserProfile,
                    id: data.id,
                    name: data.username || 'Vattler',
                    avatarUrl: data.avatar_url || initialUserProfile.avatarUrl,
                    role: data.role || 'player',
                    stats: data.stats || initialUserProfile.stats,
                    rankTier: (data.rank_tier as RankTier) || initialUserProfile.rankTier,
                    isFounder: data.is_founder !== undefined ? data.is_founder : initialUserProfile.isFounder,
                    isWarStarter: data.is_war_starter !== undefined ? data.is_war_starter : initialUserProfile.isWarStarter,
                    vibeAnalysis: data.vibe_analysis,
                    achievements: data.achievements || [],
                    portfolio: data.portfolio || [],
                    showcase: data.showcase || [],
                    promptLibrary: data.prompt_library || [],
                    profileTheme: data.profile_theme || 'default',
                    hasCompletedOnboarding: !!data.username,
                });
                if (!data.username) setView('onboarding');
                else if (view === 'auth') setView('arena');
            } else {
                console.log('No profile found, redirecting to onboarding.');
                setView('onboarding');
            }
        } catch (err) {
            console.error('Fetch Profile Exception:', err);
        } finally {
            setAuthLoading(false);
        }
    };

    // --- DATA FETCHING (REALTIME) ---

    useEffect(() => {
        if (!session) return;

        // Fetch initial battles with local rescue
        const fetchBattles = async () => {
            const { data, error } = await supabase
                .from('battles')
                .select('*');

            if (error) {
                console.warn('Supabase unavailable, using Local Storage rescue.', error);
                const localData = getLocalBattles();
                setVattles(prev => [...localData, ...prev.filter(p => !localData.find(l => l.id === p.id))]);
                return;
            }

            if (data) {
                // Transform snake_case DB to camelCase UI
                const mappedBattles: VattleConfig[] = data.map((b: any) => ({
                    id: b.id,
                    theme: b.theme,
                    creatorName: b.creator_name, // Assuming denormalized or joined
                    invitedOpponent: b.opponent_name || 'Open Invite',
                    status: b.status,
                    mode: b.mode,
                    opponent: b.opponent_type,
                    timeLimit: b.time_limit,
                    startTime: b.start_time ? new Date(b.start_time).getTime() : undefined,
                    isFeatured: b.is_featured,
                    // ... map other fields
                }));
                setVattles(mappedBattles);
            }
        };

        fetchBattles();

        // Realtime Subscription
        const channel = supabase
            .channel('public:battles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'battles' }, (payload) => {
                console.log('Realtime update:', payload);
                fetchBattles(); // Reload for simplicity, optimizing to update state directly is better for prod
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [session]);


    // --- HANDLERS ---

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setView('auth');
    };

    const handleGuestLogin = () => {
        setSession({ user: { id: 'guest', email: 'guest@vattles.io' } } as any);
        setUserProfile({
            ...initialUserProfile,
            name: 'Guest Vattler'
        });
        setView('arena');
    };

    const handleNavigate = (newView: View) => {
        if (newView === 'rankings') {
            handleOpenWaitlist("Ranked Mode", "Ranked Mode Coming Q2 2026. Join the waitlist to compete for prizes.");
        } else if (newView === 'tournaments') {
            handleOpenWaitlist("Tournaments", "Tournaments launch Q2 2026. $5K prize pools. Join waitlist.");
        } else {
            setView(newView);
        }
    };

    const handleOpenWaitlist = (feature: string, description: string) => {
        setWaitlistFeature(feature);
        setWaitlistDescription(description);
        setWaitlistModalOpen(true);
    };

    const handleEnterBattle = (vattle: VattleConfig) => {
        const isParticipant = vattle.creatorName === userProfile.name ||
            vattle.invitedOpponent === userProfile.name ||
            vattle.studentName === userProfile.name;

        if (isParticipant) {
            setActiveVattle(vattle);
            setView('battle');
        } else {
            handleSpectateBattle(vattle);
        }
    };

    const handleSpectateBattle = (vattle: VattleConfig) => {
        setActiveVattle(vattle);
        setView('spectate');
    }

    const handleViewVattle = (vattle: VattleConfig) => {
        setActiveVattle(vattle);
        setView('voting');
    };

    const handleExitBattle = () => {
        setActiveVattle(null);
        setView('arena');
    };

    const handleCreateVattle = async (config: Omit<VattleConfig, 'id' | 'status' | 'startTime' | 'creatorName'>) => {
        if (!session) return;

        // Ensure we have a valid-looking UUID if in guest mode to prevent DB type errors
        const creatorId = session.user.id === 'guest' ? '00000000-0000-0000-0000-000000000000' : session.user.id;

        const { data, error } = await supabase.from('battles').insert({
            theme: config.theme,
            mode: config.mode,
            opponent_type: config.opponent,
            time_limit: config.timeLimit,
            creator_id: creatorId,
            creator_name: userProfile.name,
            opponent_name: config.invitedOpponent,
            status: config.invitedOpponent === 'Open Invite' ? 'pending' : 'active',
            start_time: config.invitedOpponent === 'Open Invite' ? null : new Date().toISOString()
        }).select();

        if (error) {
            console.error('Database Sync Error:', error);
            // Rescue mode: Keep the session alive locally even if DB is resetting
            const localId = 'local-' + Date.now();
            const newVattle = {
                ...config,
                id: localId,
                status: config.invitedOpponent === 'Open Invite' ? 'pending' : 'active',
                creatorName: userProfile.name,
                startTime: config.invitedOpponent === 'Open Invite' ? undefined : Date.now()
            } as VattleConfig;

            saveLocalBattle(newVattle);
            setVattles(prev => [newVattle, ...prev]);
            setCreateVattleModalOpen(false);
            if (newVattle.status === 'active') handleEnterBattle(newVattle);
        } else if (data && data[0]) {
            setCreateVattleModalOpen(false);
            const newVattle = {
                ...config,
                id: data[0].id,
                status: data[0].status,
                creatorName: userProfile.name,
                startTime: data[0].start_time ? new Date(data[0].start_time).getTime() : undefined
            } as VattleConfig;

            setVattles(prev => [newVattle, ...prev]);
            if (newVattle.status === 'active') handleEnterBattle(newVattle);
        }
    };

    const handleJoinVattle = async (vattle: VattleConfig) => {
        if (vattle.status !== 'pending') {
            alert('This Vattle is no longer accepting challengers.');
            return;
        }

        // DB Update
        const { error } = await supabase.from('battles').update({
            opponent_id: session?.user.id,
            opponent_name: userProfile.name,
            status: 'active',
            start_time: new Date().toISOString()
        }).eq('id', vattle.id);

        if (!error) {
            // Local state update handled by subscription or optimistically here
            const updatedVattle = { ...vattle, invitedOpponent: userProfile.name, status: 'active' as const, startTime: Date.now() };
            handleEnterBattle(updatedVattle);
        }
    };

    const handleVattleSubmission = async (result: { files: any[], submissionUrl: string, description: string }) => {
        if (!activeVattle || !session) return;

        const html = result.files.find((f: any) => f.name === 'index.html')?.content || '';

        // 1. Save submission to 'submissions' table (only columns that exist)
        const { error } = await supabase.from('submissions').insert({
            battle_id: activeVattle.id,
            user_id: session.user.id,
            code_html: html, // Full HTML includes inline CSS/JS
            submission_url: result.submissionUrl || '',
            description: result.description || '',
            status: 'submitted'
        });

        if (error) {
            console.error('Error submitting:', error);
            alert('Failed to submit. Please try again.');
            return;
        }

        // 2. Check if this is a 1v1 AI battle (immediate voting) or PvP (wait for both)
        const isAiBattle = activeVattle.opponent === 'ai';

        if (isAiBattle) {
            // AI battles transition immediately to voting after human submits
            await supabase.from('battles').update({ status: 'voting' }).eq('id', activeVattle.id);
            const updatedVattle: VattleConfig = { ...activeVattle, status: 'voting' };
            setVattles(prev => prev.map(b => b.id === activeVattle.id ? updatedVattle : b));
            setActiveVattle(updatedVattle);
            setView('voting');
        } else {
            // PvP battles: Check if both players have submitted
            const { data: submissions } = await supabase
                .from('submissions')
                .select('user_id')
                .eq('battle_id', activeVattle.id);

            const submissionCount = submissions?.length || 0;

            if (submissionCount >= 2) {
                // Both players submitted, transition to voting
                await supabase.from('battles').update({ status: 'voting' }).eq('id', activeVattle.id);
                const updatedVattle: VattleConfig = { ...activeVattle, status: 'voting' };
                setVattles(prev => prev.map(b => b.id === activeVattle.id ? updatedVattle : b));
                setActiveVattle(updatedVattle);
                setView('voting');
            } else {
                // Still waiting for opponent, return to arena with a message
                alert('Your vibe is locked in! Waiting for your opponent to submit...');
                setView('arena');
            }
        }
    };

    const handleVote = async (vattleId: string, appIdentifier: 'A' | 'B', ratings: Ratings) => {
        if (!session) return;

        const { error } = await supabase.from('votes').insert({
            battle_id: vattleId,
            voter_id: session.user.id,
            submission_slot: appIdentifier, // Simplified mapping
            ratings: ratings
        });

        if (error) {
            console.error("Vote failed", error);
            return;
        }

        setVotedOn(prev => ({ ...prev, [vattleId]: true }));
    };

    const handleSaveProfile = (newProfile: UserProfile) => {
        setUserProfile(newProfile);
        // DB Update would go here
    };

    const handleUpdateProfile = (updates: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...updates }));
    };

    const handleUpdateVibeAnalysis = (analysis: string) => {
        setUserProfile(prev => ({
            ...prev,
            vibeAnalysis: analysis,
            lastVibeRecalibration: new Date().toISOString(),
        }));
    };

    const handlePinItem = (vattleId: string) => {
        // Logic to update pinned items in profile
        // ...
    };

    const handleUnpinItem = (vattleId: string) => {
        // Logic to unpin
    };

    const handleCompleteOnboarding = async (newUsername: string, newAvatarUrl: string) => {
        if (!session) return;

        if (session.user.id === 'guest') {
            setUserProfile(prev => ({
                ...prev,
                name: newUsername,
                avatarUrl: newAvatarUrl,
                hasCompletedOnboarding: true,
            }));
            setView('arena');
            return;
        }

        const { error } = await supabase.from('profiles').upsert({
            id: session.user.id,
            username: newUsername,
            avatar_url: newAvatarUrl,
        });

        if (error) {
            alert("Error updating profile: " + error.message);
        } else {
            setUserProfile(prev => ({
                ...prev,
                name: newUsername,
                avatarUrl: newAvatarUrl,
                hasCompletedOnboarding: true,
            }));
            setView('arena');
        }
    };

    const handleSelectTournament = (tournament: Tournament) => {
        if (tournament.status !== 'upcoming') {
            setActiveTournament(tournament);
            setView('tournament_detail');
        }
    };

    const handleRegisterTournament = (tournamentId: string) => {
        setRegisteredTournaments(prev => ({ ...prev, [tournamentId]: true }));
    };

    const handleEndorse = (participantId: string, skill: string) => {
        // DB insert endorsement
    };

    const handleSavePrompt = (prompt: PromptLibraryItem) => {
        setUserProfile(prev => ({
            ...prev,
            promptLibrary: [...(prev.promptLibrary || []), prompt],
        }));
    };

    const handleDeletePrompt = (promptId: string) => {
        setUserProfile(prev => ({
            ...prev,
            promptLibrary: (prev.promptLibrary || []).filter(p => p.id !== promptId),
        }));
    };

    const handleUpdateVibeTrack = (track: { title: string; isPlaying: boolean }) => {
        setUserProfile(prev => ({ ...prev, currentVibeTrack: track }));
    };

    const handleCloneToLab = (theme: string) => {
        setLabInitialPrompt(theme);
        setView('vibelabs');
    };

    // Filter battles for the current user
    const myBattles = vattles.filter(v =>
        v.creatorName === userProfile.name ||
        v.invitedOpponent === userProfile.name ||
        v.studentName === userProfile.name
    );

    const renderView = () => {
        if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-vattles-bg text-purple-500 font-orbitron animate-pulse">Initializing Vattles Uplink...</div>;

        if (!session) return <AuthView onGuestLogin={handleGuestLogin} />;

        switch (view) {
            case 'onboarding':
                return <OnboardingView userProfile={userProfile} onComplete={handleCompleteOnboarding} />;
            case 'arena':
                return <VattleArena
                    userProfile={userProfile}
                    userBattles={myBattles}
                    showcaseBattles={vattles} // Showing all fetched battles as showcase for now
                    onEnterBattle={handleEnterBattle}
                    onSpectateBattle={handleSpectateBattle}
                    onViewVattle={handleViewVattle}
                    onJoinVattle={handleJoinVattle}
                    onWaitlist={handleOpenWaitlist}
                    onRequestBattle={() => setCreateVattleModalOpen(true)}
                    onEnterVibeLab={() => setView('vibelabs')}
                />;
            case 'battle':
                return activeVattle ? <BattleRoom
                    vattle={activeVattle}
                    onExit={handleExitBattle}
                    onSubmit={handleVattleSubmission}
                    userProfile={userProfile}
                    onSavePrompt={handleSavePrompt}
                    onDeletePrompt={handleDeletePrompt}
                    onUpdateVibeTrack={handleUpdateVibeTrack}
                /> : <div className="text-white">Error: No active vattle selected.</div>;
            case 'spectate':
                return activeVattle ? <SpectatorRoom
                    vattle={activeVattle}
                    onExit={handleExitBattle}
                    userProfile={userProfile}
                /> : <div className="text-white">Error: No active vattle selected for spectating.</div>;
            case 'voting':
                return activeVattle ? <VotingView vattle={activeVattle} onVote={handleVote} hasVoted={!!votedOn[activeVattle.id]} onBack={() => setView('arena')} userProfile={userProfile} onEndorse={handleEndorse} onCloneToLab={handleCloneToLab} /> : <div className="text-white">Error: No vattle selected for viewing.</div>;
            case 'profile':
                return <ProfileView
                    userProfile={userProfile}
                    onBack={() => setView('arena')}
                    onEdit={() => setProfileModalOpen(true)}
                    onPinItem={handlePinItem}
                    onUnpinItem={handleUnpinItem}
                    onUpdateVibeAnalysis={handleUpdateVibeAnalysis}
                    onUpdateProfile={handleUpdateProfile}
                />
            case 'rankings':
                return <RankingsView onBack={() => setView('arena')} />
            case 'tournaments':
                return <TournamentsView tournaments={tournaments} onBack={() => setView('arena')} onSelectTournament={handleSelectTournament} onRegister={handleRegisterTournament} registeredTournaments={registeredTournaments} />
            case 'tournament_detail':
                return activeTournament ? <TournamentDetailView tournament={activeTournament} onBack={() => setView('tournaments')} onRegister={handleRegisterTournament} onCheckIn={() => { }} isRegistered={!!registeredTournaments[activeTournament.id]} isCheckedIn={false} /> : <div className="text-white">Error: No tournament selected.</div>;
            case 'vibelabs':
                return <VibeLabsView onBack={() => setView('arena')} initialPrompt={labInitialPrompt} />;
            case 'api':
                return <ApiView onBack={() => setView('arena')} />;
            case 'streaming':
                return <StreamingView onBack={() => setView('arena')} />;
            case 'overlay_stats':
                return <LiveStatsOverlay vattleId={overlayId} />;
            case 'overlay_voting':
                return <VotingOverlay vattleId={overlayId} />;
            default:
                return <VattleArena
                    userProfile={userProfile}
                    userBattles={myBattles}
                    showcaseBattles={vattles}
                    onEnterBattle={handleEnterBattle}
                    onSpectateBattle={handleSpectateBattle}
                    onViewVattle={handleViewVattle}
                    onJoinVattle={handleJoinVattle}
                    onWaitlist={handleOpenWaitlist}
                    onRequestBattle={() => setCreateVattleModalOpen(true)}
                    onEnterVibeLab={() => setView('vibelabs')}
                />;
        }
    }

    const isImmersiveView = view === 'battle' || view === 'spectate' || view === 'overlay_stats' || view === 'overlay_voting';

    return (
        <div className="bg-vattles-bg min-h-screen">
            {session && view !== 'onboarding' && !isImmersiveView && (
                <Header
                    userProfile={userProfile}
                    onNavigate={(v) => handleNavigate(v as View)}
                    onOpenCreateVattle={() => setCreateVattleModalOpen(true)}
                    onLogout={handleLogout}
                    onOpenWaitlist={handleOpenWaitlist}
                />
            )}
            {/* Conditional Layout */}
            <main className={session && view !== 'onboarding' && !isImmersiveView ? 'p-4 sm:p-6 lg:p-8' : 'h-screen flex flex-col'}>
                {renderView()}
            </main>
            <CreateVattleModal isOpen={isCreateVattleModalOpen} onClose={() => setCreateVattleModalOpen(false)} onCreate={handleCreateVattle} isCoach={userProfile.role === 'coach'} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} currentProfile={userProfile} onSave={handleSaveProfile} />
            <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} featureName={waitlistFeature} description={waitlistDescription} />
        </div>
    );
};

export default App;
