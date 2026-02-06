
import React, { useState, useEffect } from 'react';
import { UserProfile, VattleConfig, Ratings, Tournament, PortfolioItem, Achievement, Endorsement, Rivalry, PromptLibraryItem, ShowcaseItem } from './types';
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

// Components
import Header from './components/Header';
import CreateVattleModal from './components/CreateVattleModal';
import ProfileModal from './components/ProfileModal';
import WaitlistModal from './components/WaitlistModal';

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
    stats: { vattlesPlayed: 0, wins: 0, losses: 0 },
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
    { id: 't1', title: 'Vibe Masters Winter Circuit', theme: 'Winter Wonderland', type: 'official', status: 'live', prizePool: '$5,000', maxParticipants: 64, participants: Array.from({length: 60}, (_, i) => ({ id: `p${i}`, name: `Vattler${i}`, seed: i+1, avatarUrl: `https://i.pravatar.cc/40?u=p${i}`})), rounds: []},
];

type View = 'auth' | 'arena' | 'battle' | 'spectate' | 'voting' | 'profile' | 'rankings' | 'tournaments' | 'tournament_detail' | 'vibelabs' | 'api' | 'streaming' | 'onboarding';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
    const [authLoading, setAuthLoading] = useState(true);
    const [view, setView] = useState<View>('auth');
    
    // Data State
    const [vattles, setVattles] = useState<VattleConfig[]>([]);
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
    const [votedOn, setVotedOn] = useState<{[key: string]: boolean}>({});
    const [registeredTournaments, setRegisteredTournaments] = useState<{[key: string]: boolean}>({});
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

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                // Map DB profile to App UserProfile
                const profile: UserProfile = {
                    ...initialUserProfile,
                    id: data.id,
                    name: data.username || 'Vattler',
                    avatarUrl: data.avatar_url || initialUserProfile.avatarUrl,
                    hasCompletedOnboarding: !!data.username,
                    // Load other fields as needed from JSONB columns if implemented
                };
                setUserProfile(profile);
                if (!profile.hasCompletedOnboarding) setView('onboarding');
                else if (view === 'auth') setView('arena');
            } else {
                // Profile doesn't exist yet, go to onboarding
                setView('onboarding');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAuthLoading(false);
        }
    };

    // --- DATA FETCHING (REALTIME) ---

    useEffect(() => {
        if (!session) return;

        // Fetch initial battles
        const fetchBattles = async () => {
            const { data, error } = await supabase
                .from('battles')
                .select('*')
                .order('created_at', { ascending: false });
            
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
        setView('auth');
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

        // Optimistic UI update can happen here, but we'll rely on DB insert
        const { error } = await supabase.from('battles').insert({
            theme: config.theme,
            mode: config.mode,
            opponent_type: config.opponent,
            time_limit: config.timeLimit,
            creator_id: session.user.id,
            creator_name: userProfile.name, // Denormalizing for easier fetching in this demo
            opponent_name: config.invitedOpponent,
            status: config.invitedOpponent === 'Open Invite' ? 'pending' : 'active',
            start_time: config.invitedOpponent === 'Open Invite' ? null : new Date().toISOString()
        });

        if (error) {
            console.error('Error creating vattle:', error);
            alert('Failed to create battle. Check console.');
        } else {
            setCreateVattleModalOpen(false);
        }
    };

    const handleJoinVattle = async (vattle: VattleConfig) => {
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
        const css = result.files.find((f: any) => f.name === 'style.css')?.content || '';
        const js = result.files.find((f: any) => f.name === 'script.js')?.content || '';

        // 1. Save submission to 'submissions' table
        const { error } = await supabase.from('submissions').insert({
            battle_id: activeVattle.id,
            user_id: session.user.id,
            code_html: html,
            code_css: css,
            code_js: js,
            submission_url: result.submissionUrl,
            description: result.description,
            status: 'submitted'
        });

        if (error) {
            console.error('Error submitting:', error);
            alert('Failed to submit. Please try again.');
            return;
        }

        // 2. Update battle status to 'voting'
        await supabase.from('battles').update({ status: 'voting' }).eq('id', activeVattle.id);

        const updatedVattle: VattleConfig = { ...activeVattle, status: 'voting' };
        setVattles(prev => prev.map(b => b.id === activeVattle.id ? updatedVattle : b));
        setActiveVattle(updatedVattle);
        setView('voting');
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

        const { error } = await supabase.from('profiles').upsert({
            id: session.user.id,
            username: newUsername,
            avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString(),
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
        setRegisteredTournaments(prev => ({...prev, [tournamentId]: true}));
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
        if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0D0B14] text-purple-500 font-orbitron animate-pulse">Initializing Vattles Uplink...</div>;
        
        if (!session) return <AuthView />;

        switch(view) {
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
                return activeTournament ? <TournamentDetailView tournament={activeTournament} onBack={() => setView('tournaments')} onRegister={handleRegisterTournament} onCheckIn={() => {}} isRegistered={!!registeredTournaments[activeTournament.id]} isCheckedIn={false}/> : <div className="text-white">Error: No tournament selected.</div>;
            case 'vibelabs':
                return <VibeLabsView onBack={() => setView('arena')} initialPrompt={labInitialPrompt} />;
            case 'api':
                 return <ApiView onBack={() => setView('arena')} />;
            case 'streaming':
                return <StreamingView onBack={() => setView('arena')} />;
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
                        />;
        }
    }

    const isImmersiveView = view === 'battle' || view === 'spectate';

    return (
        <div className="bg-[#0D0B14] min-h-screen">
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
            <CreateVattleModal isOpen={isCreateVattleModalOpen} onClose={() => setCreateVattleModalOpen(false)} onCreate={handleCreateVattle} isCoach={userProfile.role === 'coach'}/>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} currentProfile={userProfile} onSave={handleSaveProfile} />
            <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} featureName={waitlistFeature} description={waitlistDescription} />
        </div>
    );
};

export default App;
