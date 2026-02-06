import React, { useState } from 'react';
import { HtmlIcon, CssIcon, JsIcon } from './icons';

interface CodeViewerProps {
    code: {
        html: string;
        css: string;
        js: string;
    }
}

type FileType = 'html' | 'css' | 'js';

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
    const [activeTab, setActiveTab] = useState<FileType>('html');

    const files: { name: FileType; icon: React.ReactNode; content: string }[] = [
        { name: 'html', icon: <HtmlIcon className="h-4 w-4 text-orange-400" />, content: code.html },
        { name: 'css', icon: <CssIcon className="h-4 w-4 text-blue-400" />, content: code.css },
        { name: 'js', icon: <JsIcon className="h-4 w-4 text-yellow-300" />, content: code.js },
    ];

    return (
        <div className="bg-black/30 rounded-lg border border-gray-800 flex flex-col h-full">
            <div className="flex bg-gray-900/50 p-1 flex-wrap">
                {files.map(file => (
                    <button
                        key={file.name}
                        onClick={() => setActiveTab(file.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                            activeTab === file.name ? 'bg-purple-600/30 text-purple-200' : 'text-gray-400 hover:bg-gray-700/50'
                        }`}
                    >
                        {file.icon}
                        <span>{`index.${file.name}`}</span>
                    </button>
                ))}
            </div>
            <div className="flex-grow p-4 overflow-auto">
                <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap">
                    <code>{files.find(f => f.name === activeTab)?.content}</code>
                </pre>
            </div>
        </div>
    );
}

export default CodeViewer;
