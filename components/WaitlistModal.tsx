
import React, { useState } from 'react';
import Modal from './Modal';
import { CheckCircleIcon } from './icons';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    description: string;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, featureName, description }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, send to DB here
        console.log(`Added ${email} to waitlist for ${featureName}`);
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setIsSubmitted(false);
        setEmail('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isSubmitted ? "You're on the list!" : `Join the Waitlist`}>
            {isSubmitted ? (
                <div className="text-center py-6">
                    <CheckCircleIcon className="h-16 w-16 text-teal-400 mx-auto mb-4" />
                    <p className="text-white text-lg font-bold mb-2">Thanks for your interest!</p>
                    <p className="text-gray-400 mb-6">We'll notify you as soon as {featureName} launches.</p>
                    <button 
                        onClick={handleClose}
                        className="w-full py-2 font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <div className="mb-6">
                        <span className="bg-purple-900/50 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider">
                            Coming Q2 2026
                        </span>
                        <h3 className="font-orbitron text-2xl font-bold text-white mt-4 mb-2">{featureName}</h3>
                        <p className="text-gray-400 text-sm">{description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-left">
                            <label htmlFor="waitlist-email" className="block text-sm font-medium text-purple-300 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="waitlist-email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-3 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-400/50"
                        >
                            Notify Me
                        </button>
                    </form>
                </div>
            )}
        </Modal>
    );
};

export default WaitlistModal;
