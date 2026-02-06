
import React, { useState } from 'react';
import { VattleConfig, AppSubmission, Ratings, RatingCategory, UserProfile, CoachingComment, Commit } from '../types';
import AppPanel from './AppPanel';
import Timer from './Timer';
import { TrophyIcon, BookOpenIcon, ClockIcon, HandThumbUpIcon, GithubIcon, CloneIcon } from './icons';

const mockFinalCode = {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Pixel Prowler</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</head>
<body>
    <h1>Pixel Prowler</h1>
    <p>Searching for clues in the neon rain...</p>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body { 
    background-color: #1a1a2e; 
    color: #e0e0e0; 
    font-family: 'VT323', monospace; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    text-align: center; 
    height: 100vh; 
    margin: 0; 
    flex-direction: column; 
    cursor: pointer;
}
h1 { 
    color: #c084fc; 
    text-shadow: 0 0 10px #c084fc, 0 0 20px #c084fc; 
    font-size: 3rem; 
    animation: flicker 1.5s infinite alternate; 
}
@keyframes flicker {
    0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 4px #c084fc, 0 0 11px #c084fc, 0 0 19px #c084fc, 0 0 40px #c084fc, 0 0 80px #c084fc; }
    20%, 24%, 55% { text-shadow: none; }
}`,
    js: `console.log("Pixel Prowler loaded.");

document.body.addEventListener('click', () => {
    const p = document.querySelector('p');
    p.textContent = p.textContent.endsWith('...') ? 'A new lead!' : 'Searching for clues...';
});`
};

const mockCommitHistory: Commit[] = [
    {
        timestamp: 5, message: "Initial structure", code: {
            html: `<h1>Pixel Prowler</h1>`,
            css: `body { background-color: #1a1a2e; font-family: 'VT323', monospace; } h1 { color: #c084fc; }`,
            js: `console.log("Init");`
        }
    },
    {
        timestamp: 25, message: "Add layout and text", code: {
            html: `<h1>Pixel Prowler</h1><p>Searching for clues...</p>`,
            css: `body { background-color: #1a1a2e; color: #e0e0e0; font-family: 'VT323', monospace; display: flex; align-items: center; justify-content: center; text-align: center; height: 100vh; margin: 0; flex-direction: column; } h1 { color: #c084fc; font-size: 3rem; }`,
            js: `console.log("Pixel Prowler loaded.");`
        }
    },
    {
        timestamp: 50, message: "Add interaction and polish", code: {
            html: `<h1>Pixel Prowler</h1><p>Searching for clues in the neon rain...</p>`,
            css: `body { background-color: #1a1a2e; color: #e0e0e0; font-family: 'VT323', monospace; display: flex; align-items: center; justify-content: center; text-align: center; height: 100vh; margin: 0; flex-direction: column; cursor: pointer; } h1 { color: #c084fc; text-shadow: 0 0 10px #c084fc; font-size: 3rem; }`,
            js: mockFinalCode.js
        }
    }
];


const mockAppA: AppSubmission = {
    id: 'app-a',
    title: 'Pixel Prowler',
    imageUrl: 'https://picsum.photos/seed/pixel/800/450',
    demoUrl: `data:text/html,
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
            body { 
              background-color: #1a1a2e; color: #e0e0e0; font-family: 'VT323', monospace; 
              display: flex; align-items: center; justify-content: center; text-align: center; 
              height: 100vh; margin: 0; flex-direction: column; cursor: pointer;
            }
            h1 { color: #c084fc; text-shadow: 0 0 10px #c084fc, 0 0 20px #c084fc; font-size: 3rem; animation: flicker 1.5s infinite alternate; }
            p { font-size: 1.2rem; }
            @keyframes flicker {
              0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 4px #c084fc, 0 0 11px #c084fc, 0 0 19px #c084fc, 0 0 40px #c084fc, 0 0 80px #c084fc; }
              20%, 24%, 55% { text-shadow: none; }
            }
          </style>
        </head>
        <body>
          <h1>Pixel Prowler</h1>
          <p>Searching for clues in the neon rain...</p>
        </body>
      </html>`,
    prompts: {
      visuals: 'A cyberpunk cityscape in pixel art style with neon signs and flying vehicles.',
      audio: 'Synthwave track with a driving beat and retro 8-bit sound effects.',
      text: 'Story of a lone detective navigating the rain-slicked streets of a futuristic city.'
    },
    totalVotes: 124,
    color: 'purple',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    accentColor: '#c084fc', // purple-400
    finalCode: mockFinalCode,
    githubRepoUrl: 'https://github.com/vibemaster/pixel-prowler',
    commitHistory: mockCommitHistory,
};
  
const mockAppB: AppSubmission = {
    id: 'app-b',
    title: 'Galactic Glider',
    imageUrl: 'https://picsum.photos/seed/glider/800/450',
    demoUrl: `data:text/html,
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;700&display=swap');
            body { 
              background: linear-gradient(to bottom, #2c3e50, #fd746c); 
              color: #fff; font-family: 'Rajdhani', sans-serif; 
              display: flex; align-items: center; justify-content: center; text-align: center; 
              height: 100vh; margin: 0; flex-direction: column; overflow: hidden;
            }
            h1 { font-size: 3.5rem; font-weight: 700; text-shadow: 0 0 15px rgba(255,255,255,0.7); }
            p { font-size: 1.5rem; font-weight: 300; }
          </style>
        </head>
        <body>
          <h1>Galactic Glider</h1>
          <p>Endless journey through vaporwave space.</p>
        </body>
      </html>`,
    prompts: {
      visuals: 'An endless runner game with a vaporwave aesthetic, palm trees, and a setting sun.',
      audio: 'Chill lo-fi hip hop beat with spacey pads and a calm melody.',
      text: 'A relaxing journey through space, collecting stardust and avoiding asteroids.'
    },
    totalVotes: 98,
    color: 'teal',
    glowColor: 'rgba(45, 212, 191, 0.5)',
    accentColor: '#5eead4', // teal-400
    finalCode: { ...mockFinalCode, html: mockFinalCode.html.replace('Pixel Prowler', 'Galactic Glider') },
};

const initialRatings: Ratings = {
  vibe: 0,
  aesthetics: 0,
  creativity: 0,
  functionality: 0,
};

const VOTING_DURATION_MS = 24 * 60 * 60 * 1000;

const mockCoachingComments: CoachingComment[] = [
    { id: 'cc1', coachName: 'Vibemaster', coachAvatarUrl: 'https://i.pravatar.cc/150?u=Vibemaster', timestamp: '05:12', comment: 'Great use of flexbox here to center the main container. Clean and efficient.'},
    { id: 'cc2', coachName: 'Vibemaster', coachAvatarUrl: 'https://i.pravatar.cc/150?u=Vibemaster', timestamp: '18:45', comment: 'Consider abstracting this repeated logic into a reusable function to keep your code DRY (Don\'t Repeat Yourself).'},
    { id: 'cc3', coachName: 'Vibemaster', coachAvatarUrl: 'https://i.pravatar.cc/150?u=Vibemaster', timestamp: '32:30', comment: 'The animation is a nice touch! Maybe you could use CSS variables for the colors to make the theme easier to change later.'},
];


interface VotingViewProps {
  vattle: VattleConfig;
  onVote: (vattleId: string, appIdentifier: 'A' | 'B', ratings: Ratings) => void;
  hasVoted: boolean;
  onBack: () => void;
  userProfile: UserProfile;
  onEndorse: (participantName: string, skill: string) => void;
  onCloneToLab: (theme: string) => void;
}

const VotingView: React.FC<VotingViewProps> = ({ vattle, onVote, hasVoted, onBack, userProfile, onEndorse, onCloneToLab }) => {
  const [ratingsA, setRatingsA] = useState<Ratings>(initialRatings);
  const [ratingsB, setRatingsB] = useState<Ratings>(initialRatings);
  const [coachingComments, setCoachingComments] = useState<CoachingComment[]>(mockCoachingComments);
  const [newComment, setNewComment] = useState('');
  const [newTimestamp, setNewTimestamp] = useState('');
  const [timelineIndex, setTimelineIndex] = useState(-1);

  const [endorsedSkills, setEndorsedSkills] = useState<{ [key: string]: string | null }>({
    [vattle.creatorName]: null,
    [vattle.invitedOpponent]: null,
  });

  const isCompleted = vattle.status === 'completed';
  const isCoaching = vattle.mode === 'coaching';

  const handleRateA = (category: RatingCategory, value: number) => {
    if (hasVoted) return;
    setRatingsA(prev => ({ ...prev, [category]: value }));
  };

  const handleRateB = (category: RatingCategory, value: number) => {
    if (hasVoted) return;
    setRatingsB(prev => ({ ...prev, [category]: value }));
  };

  const handleVoteClick = (appIdentifier: 'A' | 'B') => {
    const ratingsToSubmit = appIdentifier === 'A' ? ratingsA : ratingsB;
    onVote(vattle.id, appIdentifier, ratingsToSubmit);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newTimestamp.trim()) return;
    const comment: CoachingComment = {
        id: `cc${Date.now()}`,
        coachName: userProfile.name,
        coachAvatarUrl: userProfile.avatarUrl,
        timestamp: newTimestamp,
        comment: newComment,
    };
    setCoachingComments(prev => [comment, ...prev]);
    setNewComment('');
    setNewTimestamp('');
  }
  
  const handleEndorseClick = (participantName: string, skill: string) => {
    onEndorse(participantName, skill);
    setEndorsedSkills(prev => ({ ...prev, [participantName]: skill }));
  };

  const skillsToEndorse = ['Creative AI Use', 'Slick Animations', 'Flawless UI'];

  const EndorsementSection: React.FC<{ participantName: string }> = ({ participantName }) => {
    const endorsedSkill = endorsedSkills[participantName];
    return (
        <div className="bg-black/20 mt-4 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-semibold text-center text-white mb-3">Endorse {participantName}</h4>
            <div className="flex flex-wrap justify-center gap-2">
                {skillsToEndorse.map(skill => (
                    <button
                        key={skill}
                        onClick={() => handleEndorseClick(participantName, skill)}
                        disabled={!!endorsedSkill}
                        className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${
                            endorsedSkill === skill 
                                ? 'bg-teal-500 text-white' 
                                : !!endorsedSkill
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800/80 hover:bg-teal-600/80 text-gray-300 hover:text-white'
                        }`}
                    >
                        <HandThumbUpIcon className="h-3 w-3" /> {skill}
                    </button>
                ))}
            </div>
            {endorsedSkill && <p className="text-center text-xs text-teal-300 mt-2">You endorsed '{endorsedSkill}'.</p>}
        </div>
    );
  };
  
  if (!vattle.startTime) {
    return <div>Error: Vattle data is incomplete.</div>
  }

  const battleEndTime = vattle.startTime + vattle.timeLimit * 60 * 1000;
  const votingEndTime = battleEndTime + VOTING_DURATION_MS;

  // Adapt Mock Apps to current Vattle Participants
  const appA = { ...mockAppA, title: `${vattle.creatorName}'s App` };
  const appB = { 
      ...mockAppB, 
      title: vattle.opponent === 'ai' ? 'AI Agent' : `${vattle.invitedOpponent || 'Challenger'}'s App`,
      prompts: vattle.opponent === 'ai' ? { visuals: 'Generated by AI', audio: 'Generated by AI', text: 'Generated by AI' } : mockAppB.prompts
  };
  
  const commits = appA.commitHistory || [];
  const selectedCommit = timelineIndex >= 0 && timelineIndex < commits.length ? commits[timelineIndex] : null;
  const codeForAppA = selectedCommit ? selectedCommit.code : appA.finalCode;

  if (isCoaching && isCompleted) {
    const studentSubmission = { ...mockAppA, title: `${vattle.studentName}'s Submission` };
    return (
        <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                    &larr; Back to Arena
                </button>
                 <div className="text-center">
                     <h2 className="font-orbitron text-xl font-medium text-white">Coaching Review: <span className="text-blue-300">{vattle.theme}</span></h2>
                     <p className="text-sm text-gray-400">Coach: {vattle.creatorName} | Student: {vattle.studentName}</p>
                </div>
                <div className="w-[150px]"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-orbitron text-2xl font-bold text-white mb-4">Student's Final Submission</h3>
                    <AppPanel submission={studentSubmission} mode="vod" isWinner={true} />
                </div>
                <div className="bg-black/20 rounded-lg border border-gray-700/50 p-6 flex flex-col">
                    <h3 className="font-orbitron text-2xl font-bold text-white mb-4 flex items-center gap-3"><BookOpenIcon className="h-6 w-6 text-blue-300" /> Coach's Review</h3>
                    {userProfile.role === 'coach' && (
                        <form onSubmit={handleAddComment} className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                            <h4 className="font-semibold mb-2 text-white">Add a New Comment</h4>
                            <div className="flex gap-2 mb-2">
                                <input type="text" value={newTimestamp} onChange={e => setNewTimestamp(e.target.value)} placeholder="MM:SS" className="bg-gray-800 border border-gray-500 rounded-md px-2 py-1 text-sm w-20 text-white"/>
                                <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type your feedback..." className="flex-grow bg-gray-800 border border-gray-500 rounded-md px-2 py-1 text-sm text-white"/>
                            </div>
                            <button type="submit" className="w-full py-2 text-sm font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-500 text-white">Add Comment</button>
                        </form>
                    )}
                    <div className="space-y-4 overflow-y-auto flex-grow">
                        {coachingComments.map(c => (
                            <div key={c.id} className="flex items-start gap-3">
                                <img src={c.coachAvatarUrl} alt={c.coachName} className="h-10 w-10 rounded-full flex-shrink-0 mt-1" />
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-blue-300">{c.coachName}</p>
                                        <p className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full flex items-center gap-1"><ClockIcon className="h-3 w-3" />{c.timestamp}</p>
                                    </div>
                                    <p className="text-gray-200">{c.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
                &larr; Back to Arena
            </button>
            <div className="text-center">
                 <h2 className="font-orbitron text-xl font-medium text-white">{isCompleted ? 'Vattle Replay' : 'Voting'}: <span className="text-yellow-300">{vattle.theme}</span></h2>
                 <p className="text-sm text-gray-400">{vattle.creatorName} vs. {vattle.opponent === 'ai' ? 'AI Opponent' : vattle.invitedOpponent}</p>
                 {isCompleted ? (
                    <div className="mt-4 flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center">
                            <p className="text-xs uppercase tracking-wider text-gray-400">Winner</p>
                            <p className="font-orbitron text-2xl font-semibold text-yellow-300 flex items-center justify-center gap-2">
                                <TrophyIcon className="h-6 w-6"/>
                                {vattle.winner || 'N/A'}
                            </p>
                        </div>
                        <button onClick={() => onCloneToLab(vattle.theme)} className="flex items-center gap-2 text-sm bg-teal-600/80 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition-all">
                            <CloneIcon className="h-4 w-4" />
                            Clone & Vibe in the Lab
                        </button>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-xs uppercase tracking-wider text-gray-400">Voting Ends In</p>
                        <Timer endTime={votingEndTime} size="sm" />
                    </div>
                )}
            </div>
            <div className="w-[150px] hidden sm:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <AppPanel 
                    submission={appA} 
                    mode={isCompleted ? 'vod' : 'voting'} 
                    isWinner={vattle.winner === vattle.creatorName}
                    ratings={ratingsA} 
                    onRate={handleRateA} 
                    onVote={() => handleVoteClick('A')} 
                    hasVoted={hasVoted}
                    codeToShow={codeForAppA}
                />
                {isCompleted && <EndorsementSection participantName={vattle.creatorName} />}
            </div>
            <div>
                <AppPanel 
                    submission={appB}
                    mode={isCompleted ? 'vod' : 'voting'} 
                    isWinner={vattle.winner === (vattle.invitedOpponent || 'AI Opponent')}
                    ratings={ratingsB} 
                    onRate={handleRateB} 
                    onVote={() => handleVoteClick('B')} 
                    hasVoted={hasVoted} 
                />
                {isCompleted && vattle.opponent !== 'ai' && <EndorsementSection participantName={vattle.invitedOpponent} />}
            </div>
        </div>

        {isCompleted && appA.commitHistory && (
             <div className="mt-8 bg-black/20 rounded-lg border border-gray-700/50 p-6">
                <h3 className="font-orbitron text-xl font-bold text-white mb-2">Interactive Replay Timeline</h3>
                <div className="flex items-center gap-4 mb-4">
                    <p className="text-sm text-gray-400 flex-shrink-0">Viewing {appA.title}</p>
                    {appA.githubRepoUrl && <a href={appA.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-800/80 px-2 py-1 rounded-md"><GithubIcon className="h-4 w-4"/> View on GitHub</a>}
                </div>
                <div className="flex flex-col gap-2">
                    <input type="range" min={-1} max={commits.length -1} value={timelineIndex} onChange={e => setTimelineIndex(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Start</span>
                        <span>End</span>
                    </div>
                </div>
                 <div className="mt-4 text-center bg-gray-900/50 p-3 rounded-md min-h-[60px] flex items-center justify-center">
                    {selectedCommit ? (
                        <div>
                             <p className="font-semibold text-white">
                                <span className="font-mono bg-purple-900/70 text-purple-200 px-2 py-0.5 rounded mr-2">{String(selectedCommit.timestamp).padStart(2, '0')}:00</span>
                                {selectedCommit.message}
                            </p>
                        </div>
                    ) : (
                        <p className="font-semibold text-white">Final Submission (Time: {vattle.timeLimit}:00)</p>
                    )}
                </div>
             </div>
        )}
        
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

export default VotingView;
