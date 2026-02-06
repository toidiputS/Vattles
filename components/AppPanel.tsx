import React, { useState } from 'react';
import { AppSubmission, Ratings, RatingCategory, FinalCode } from '../types';
import RatingSystem from './RatingSystem';
import CodeViewer from './CodeViewer';
import { AudioIcon, ImageIcon, TextIcon, LinkIcon, CodeBracketIcon, TrophyIcon } from './icons';

interface AppPanelProps {
  submission: AppSubmission;
  mode: 'voting' | 'vod';
  ratings?: Ratings;
  onRate?: (category: RatingCategory, value: number) => void;
  onVote?: () => void;
  hasVoted?: boolean;
  isWinner?: boolean;
  codeToShow?: FinalCode;
}

const AppPanel: React.FC<AppPanelProps> = ({ submission, mode, ratings, onRate, onVote, hasVoted, isWinner, codeToShow }) => {
    const { title, imageUrl, demoUrl, prompts, totalVotes, color, glowColor, accentColor, finalCode } = submission;
    const [isDemoVisible, setIsDemoVisible] = useState(mode === 'vod' ? false : true);
    const [activeVodTab, setActiveVodTab] = useState<'demo' | 'code' | 'prompts'>('demo');
    
    const voteButtonBaseClasses = `w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300`;
    const purpleClasses = `bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 hover:shadow-purple-500/50`;
    const tealClasses = `bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-400 hover:shadow-teal-400/50`;
    const votedPurpleClasses = `bg-purple-900/50 text-purple-400/70 border border-purple-700/50 cursor-not-allowed shadow-none`;
    const votedTealClasses = `bg-teal-900/50 text-teal-400/70 border border-teal-700/50 cursor-not-allowed shadow-none`;

    const voteButtonClasses = `${voteButtonBaseClasses} ${
        hasVoted 
            ? (color === 'purple' ? votedPurpleClasses : votedTealClasses)
            : (color === 'purple' ? purpleClasses : tealClasses)
    }`;

    const displayedCode = codeToShow || finalCode;

    const PromptsSection = () => (
        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">AI Asset Prompts</h4>
            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <ImageIcon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                    <p className="text-gray-300"><span className="font-semibold text-gray-400">Visuals:</span> {prompts.visuals}</p>
                </div>
                <div className="flex items-start gap-2">
                    <AudioIcon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                    <p className="text-gray-300"><span className="font-semibold text-gray-400">Audio:</span> {prompts.audio}</p>
                </div>
                <div className="flex items-start gap-2">
                    <TextIcon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" aria-hidden="true" />
                    <p className="text-gray-300"><span className="font-semibold text-gray-400">Text:</span> {prompts.text}</p>
                </div>
            </div>
        </div>
    );
    
    const DemoSection = () => {
        const buildSrcDoc = (htmlContent: string, cssContent: string, jsContent: string) => `
            <!DOCTYPE html>
            <html>
                <head><style>${cssContent}</style></head>
                <body>
                    ${htmlContent.replace(/<link.*href="style.css".*>/, '').replace(/<script.*src="script.js".*><\/script>/, '')}
                    <script>${jsContent}</script>
                </body>
            </html>`;
        
        const previewSrcDoc = displayedCode ? buildSrcDoc(displayedCode.html, displayedCode.css, displayedCode.js) : null;

        return (
            <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                {previewSrcDoc ? (
                     <iframe
                        srcDoc={previewSrcDoc}
                        title={`${title} - Live Preview`}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : isDemoVisible ? (
                    <iframe
                        src={demoUrl}
                        title={`${title} - Live Demo`}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <>
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <button
                            onClick={() => setIsDemoVisible(true)}
                            className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg border border-white/20 transition-all transform hover:scale-105"
                            >
                            <LinkIcon className="h-5 w-5" aria-hidden="true"/>
                            Launch Live Demo
                        </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div 
            className={`bg-gray-900/50 rounded-xl border border-gray-700/50 p-4 flex flex-col gap-4 transition-all duration-300 ${hasVoted ? 'opacity-80' : 'hover:shadow-2xl'}`}
            style={{ boxShadow: hasVoted ? `0 0 15px ${glowColor.replace('0.5', '0.2')}` : `0 0 25px ${glowColor}`}}
        >
            <div className="flex justify-between items-center">
                <h3 className="font-orbitron text-lg font-semibold text-white">{title}</h3>
                {mode === 'vod' && (
                    isWinner ? (
                        <div className="flex items-center gap-2 text-yellow-300 bg-yellow-500/20 border border-yellow-500/50 px-3 py-1 rounded-full text-sm font-bold">
                            <TrophyIcon className="h-5 w-5" aria-hidden="true"/>
                            WINNER
                        </div>
                    ) : (
                         <div className="text-red-300 bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full text-sm font-bold">
                            LOSER
                        </div>
                    )
                )}
                 {mode === 'voting' && <span className="text-sm font-light text-gray-400">Total Votes: {totalVotes}</span>}
            </div>

            {mode === 'voting' && (
                <>
                    <DemoSection />
                    <PromptsSection />
                    <div className="bg-black/30 p-3 rounded-lg border border-gray-800 flex-grow">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <RatingSystem label="Vibe" rating={ratings!.vibe} onRate={(value) => onRate!('vibe', value)} accentColor={accentColor} disabled={hasVoted} />
                            <RatingSystem label="Creativity" rating={ratings!.creativity} onRate={(value) => onRate!('creativity', value)} accentColor={accentColor} disabled={hasVoted} />
                            <RatingSystem label="Aesthetics" rating={ratings!.aesthetics} onRate={(value) => onRate!('aesthetics', value)} accentColor={accentColor} disabled={hasVoted} />
                            <RatingSystem label="Functionality" rating={ratings!.functionality} onRate={(value) => onRate!('functionality', value)} accentColor={accentColor} disabled={hasVoted} />
                        </div>
                    </div>
                    <button onClick={onVote} disabled={hasVoted} className={voteButtonClasses}>
                        {hasVoted ? 'VOTED' : 'VOTE'}
                    </button>
                </>
            )}

            {mode === 'vod' && (
                <>
                    <div role="tablist" aria-label="VOD content" className="flex bg-gray-800/50 border border-gray-600 rounded-md p-1 mb-2">
                        <button role="tab" aria-selected={activeVodTab === 'demo'} id="tab-demo" aria-controls="panel-demo" onClick={() => setActiveVodTab('demo')} className={`w-1/3 py-1.5 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${activeVodTab === 'demo' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><LinkIcon className="h-4 w-4" aria-hidden="true"/> Demo</button>
                        <button role="tab" aria-selected={activeVodTab === 'code'} id="tab-code" aria-controls="panel-code" onClick={() => setActiveVodTab('code')} className={`w-1/3 py-1.5 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${activeVodTab === 'code' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><CodeBracketIcon className="h-4 w-4" aria-hidden="true"/> Code</button>
                        <button role="tab" aria-selected={activeVodTab === 'prompts'} id="tab-prompts" aria-controls="panel-prompts" onClick={() => setActiveVodTab('prompts')} className={`w-1/3 py-1.5 rounded transition-colors text-sm font-semibold flex items-center justify-center gap-2 ${activeVodTab === 'prompts' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><TextIcon className="h-4 w-4" aria-hidden="true"/> Prompts</button>
                    </div>
                    <div className="min-h-[400px] flex flex-col">
                        <div role="tabpanel" id="panel-demo" aria-labelledby="tab-demo" hidden={activeVodTab !== 'demo'}>
                           <DemoSection />
                        </div>
                         <div role="tabpanel" id="panel-code" aria-labelledby="tab-code" hidden={activeVodTab !== 'code'}>
                           {displayedCode ? <CodeViewer code={displayedCode} /> : <div className="text-center text-gray-500 p-8">Code not available for this Vattle.</div>}
                        </div>
                         <div role="tabpanel" id="panel-prompts" aria-labelledby="tab-prompts" hidden={activeVodTab !== 'prompts'}>
                            <PromptsSection />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AppPanel;