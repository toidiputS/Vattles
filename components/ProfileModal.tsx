
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Modal from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentProfile, onSave }) => {
  const [name, setName] = useState(currentProfile.name);

  useEffect(() => {
    if(isOpen) {
      setName(currentProfile.name);
    }
  }, [isOpen, currentProfile.name]);

  const handleSave = () => {
    onSave({ ...currentProfile, name });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-2">Username</label>
          <input 
            type="text"
            id="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full py-3 mt-4 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50"
        >
          Save Profile
        </button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
