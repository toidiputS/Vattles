import { RankTier } from '../types';

export const getRankTier = (mmr: number): RankTier => {
    if (mmr >= 3000) return 'medal-of-honor';
    if (mmr >= 2500) return 'vibe-master';
    if (mmr >= 2100) return 'diamond';
    if (mmr >= 1800) return 'platinum';
    if (mmr >= 1500) return 'gold';
    if (mmr >= 1200) return 'silver';
    if (mmr >= 1000) return 'bronze';
    return 'iron';
};
