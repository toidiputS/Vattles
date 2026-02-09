import React, { useMemo } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

interface ShimmerDustProps {
    children: React.ReactNode;
    active?: boolean;
    count?: number;
    color?: string;
}

export const ShimmerDust: React.FC<ShimmerDustProps> = ({
    children,
    active = true,
    count = 12,
    color = "#FCD34D"
}) => {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 40 - 20, // -20 to 20
            y: Math.random() * -60 - 20, // -20 to -80
            size: Math.random() * 4 + 2,
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 1
        }));
    }, [count]);

    return (
        <div className="relative inline-block group">
            {children}
            {active && (
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute left-1/2 top-1/2 rounded-full animate-vibe-dust"
                            style={{
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                backgroundColor: color,
                                shadow: `0 0 ${p.size * 2}px ${color}`,
                                '--tw-dust-x': `${p.x}px`,
                                '--tw-dust-y': `${p.y}px`,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
