import React from 'react';
import Modal from './Modal';
import CreateVattleView from './CreateVattleView';
import { VattleConfig } from '../types';

interface CreateVattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (vattleConfig: Omit<VattleConfig, 'id' | 'status' | 'startTime' | 'creatorName'>) => void;
  isCoach: boolean;
}

const CreateVattleModal: React.FC<CreateVattleModalProps> = ({ isOpen, onClose, onCreate, isCoach }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Vattle">
      <CreateVattleView onCreate={onCreate} onClose={onClose} isCoach={isCoach} />
    </Modal>
  );
};

export default CreateVattleModal;