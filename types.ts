
export type UserStatus = 'pro' | 'featured';
export type UserRole = 'player' | 'coach';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Corresponds to a key in the icon map
}

export interface Endorsement {
  skill: string;
  count: number;
}

export type ProfileTheme = 'default' | 'synthwave' | 'matrix' | 'brutalist-dark';

export interface Rivalry {
    opponentId: string;
    opponentName: string;
    opponentAvatarUrl: string;
    wins: number;
    losses: number;
}

export interface PromptLibraryItem {
    id: string;
    type: 'visuals' | 'audio' | 'text';
    prompt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string;
  status?: UserStatus;
  role: UserRole;
  hasCompletedOnboarding?: boolean;
  stats: {
    vattlesPlayed: number;
    wins: number;
    losses: number;
  };
  portfolio: PortfolioItem[];
  showcase: ShowcaseItem[];
  vibeAnalysis?: string;
  lastVibeRecalibration?: string; // ISO timestamp
  achievements?: Achievement[];
  endorsements?: Endorsement[];
  profileTheme?: ProfileTheme;
  rivalries?: Rivalry[];
  promptLibrary?: PromptLibraryItem[];
  currentVibeTrack?: {
      title: string;
      isPlaying: boolean;
  };
}

export interface PortfolioItem {
  vattleId: string;
  title: string;
  theme: string;
  date: string;
  opponentName: string;
  result: 'win' | 'loss' | 'draw';
}

export interface ShowcaseItem {
  vattleId: string;
  title: string;
  theme: string;
  imageUrl: string;
}

export type VattleStatus = 'pending' | 'active' | 'voting' | 'completed';
export type VattleMode = 'standard' | 'coaching';
export type OpponentType = 'player' | 'ai';

export interface VattleConfig {
  id: string;
  theme: string;
  creatorName: string;
  invitedOpponent: string;
  studentName?: string;
  status: VattleStatus;
  mode: VattleMode;
  opponent: OpponentType;
  timeLimit: number; // in minutes
  startTime?: number; // timestamp
  winner?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRivalryMatch?: boolean;
}

export interface FinalCode {
    html: string;
    css: string;
    js: string;
}

export interface Commit {
  timestamp: number; // minutes into the battle
  message: string;
  code: FinalCode;
}

export interface AppSubmission {
  id: string;
  title: string;
  imageUrl: string;
  demoUrl: string;
  prompts: {
    visuals: string;
    audio: string;
    text: string;
  };
  totalVotes: number;
  color: 'purple' | 'teal';
  glowColor: string;
  accentColor: string;
  finalCode?: FinalCode;
  githubRepoUrl?: string;
  commitHistory?: Commit[];
}

export interface Ratings {
  vibe: number;
  aesthetics: number;
  creativity: number;
  functionality: number;
}

export type RatingCategory = keyof Ratings;

export interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  color: string;
  isPrivate?: boolean;
}

export interface CoachingComment {
    id: string;
    coachName: string;
    coachAvatarUrl: string;
    timestamp: string;
    comment: string;
}

export interface LeaderboardUser {
    id: string;
    rank: number;
    username: string;
    avatarUrl: string;
    status?: UserStatus;
    mmr: number;
    wins: number;
    losses: number;
    mainVibe: 'Cyberpunk' | 'Sci-Fi' | 'Minimalist' | 'Retro' | 'Nature';
}

export interface Tournament {
    id: string;
    title: string;
    theme: string;
    type: 'official' | 'sponsored' | 'community';
    status: 'upcoming' | 'live' | 'completed';
    prizePool: string;
    participants: TournamentParticipant[];
    maxParticipants: number;
    rounds: TournamentRound[];
}

export interface TournamentRound {
    id: string;
    name: string;
    matches: TournamentMatch[];
}

export interface TournamentMatch {
    id: string;
    participants: (TournamentParticipant | null)[];
    winnerId?: string;
    score?: [number, number];
}

export interface TournamentParticipant {
    id: string;
    name: string;
    avatarUrl: string;
    seed: number;
}

// --- DATABASE INTERFACES ---

export interface Battle {
  id: string;
  theme: string;
  status: 'waiting' | 'live' | 'voting' | 'completed';
  startTime: Date;
  duration: number; // minutes
  participants: Array<{
    userId: string;
    username: string;
    submission?: {
      code: string;
      screenshot: string;
      submittedAt: Date;
    }
  }>;
  voteCount?: { [userId: string]: number };
  winner?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  wins: number;
  losses: number;
}
