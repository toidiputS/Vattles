
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { CheckCircleIcon } from './icons';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: { submissionUrl: string; description: string }) => void;
  isExpired: boolean;
  isSubmitted: boolean;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, onSubmit, isExpired, isSubmitted }) => {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [description, setDescription] = useState('');

  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens/reopens
      if (!isSubmitted) { // Don't reset if we are just showing the success message
        setSubmissionUrl('');
        setDescription('');
        setIsConfirming(false);
        setCountdown(3);
      }
    } else {
      // Cleanup on close
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen, isSubmitted]);

  useEffect(() => {
    if (isConfirming && countdown > 0) {
      intervalRef.current = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConfirming, countdown]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) {
      alert("Please provide a submission URL.");
      return;
    }
    setIsConfirming(true);
  };

  const handleFinalSubmit = () => {
    onSubmit({ submissionUrl, description });
  };
  
  const handleCancelConfirmation = () => {
      setIsConfirming(false);
      setCountdown(3);
      if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
      }
  };

  const renderContent = () => {
    if (isSubmitted) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <CheckCircleIcon className="h-16 w-16 text-teal-400 mb-4" />
            <h3 className="text-2xl font-bold text-teal-400">Submission Confirmed!</h3>
            <p className="text-gray-300 mt-2">Good luck! You will be returned to the lobby shortly.</p>
        </div>
      );
    }
    
    if (isExpired) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h3 className="text-2xl font-bold text-red-500">Time's Up!</h3>
            <p className="text-gray-300 mt-2">The submission period for this Vattle has ended.</p>
        </div>
      );
    }

    if (isConfirming) {
      return (
         <div className="text-center">
            <h3 className="text-2xl font-bold text-yellow-400">Final Submission</h3>
            <p className="text-gray-300 my-4">Your live demo URL will be locked in for judging. <strong className="text-white">This action cannot be undone.</strong> Are you absolutely sure?</p>
            <div className="space-y-3">
                <button 
                    onClick={handleFinalSubmit}
                    disabled={countdown > 0}
                    className="w-full py-3 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30 disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {countdown > 0 ? `Confirm (${countdown})` : 'Confirm Submission'}
                </button>
                <button 
                    onClick={handleCancelConfirmation}
                    className="w-full py-2 font-semibold rounded-lg transition-all bg-gray-700/80 hover:bg-gray-700 text-white"
                >
                    Cancel
                </button>
            </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleInitialSubmit} className="space-y-6">
        <div>
          <label htmlFor="submissionUrl" className="block text-sm font-medium text-purple-300 mb-2">Live Demo URL</label>
          <input type="url" id="submissionUrl" value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} placeholder="https://your-project.netlify.app" className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
          <p className="text-xs text-gray-500 mt-2">Deploy your app to a service like Netlify, Vercel, or Glitch and paste the public URL here.</p>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-purple-300 mb-2">Description & AI Prompts Used</label>
          <textarea id="description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe your app and list the key prompts you used to generate assets." className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <button type="submit" className="w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-400/50">
          Submit & Finalize
        </button>
      </form>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Your Creation">
        {renderContent()}
    </Modal>
  );
};

export default SubmissionModal;
