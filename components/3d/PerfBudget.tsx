
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSystem } from '../../stores/system';

export function PerfBudget() {
  const last = useRef<number>(performance.now());
  const acc = useRef({ frames: 0, elapsed: 0 });
  const setPerf = useSystem((s) => s.setPerf);

  useFrame(() => {
    const now = performance.now();
    const dt = now - last.current;
    last.current = now;

    acc.current.frames += 1;
    acc.current.elapsed += dt;

    if (acc.current.elapsed >= 500) {
      const fps = (acc.current.frames * 1000) / acc.current.elapsed;
      const frameTimeMs = acc.current.elapsed / acc.current.frames;
      setPerf({ fps, frameTimeMs });
      acc.current.frames = 0;
      acc.current.elapsed = 0;
    }
  });

  return null;
}
