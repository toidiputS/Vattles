import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';

export type PerfSnapshot = {
  fps: number;
  frameTimeMs: number;
};

export type KeyMap = {
    forward: string;
    backward: string;
    left: string;
    right: string;
    up: string;
    down: string;
    run: string;
    summon: string;
    interact: string;
};

export type UserProfile = {
    name: string;
    email: string;
    isAuthenticated: boolean;
};

type SystemState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  perf: PerfSnapshot;
  setPerf: (p: PerfSnapshot) => void;
  lightingLevel: number; // 0 to 1
  setLightingLevel: (l: number) => void;
  cameraSpeed: number;
  setCameraSpeed: (s: number) => void;
  keys: KeyMap;
  setKey: (action: keyof KeyMap, key: string) => void;
  resetKeys: () => void;
  
  // Auth
  user: UserProfile;
  login: (name: string, email: string) => void;
  logout: () => void;
};

const DEFAULT_KEYS: KeyMap = {
    forward: 'KeyW',
    backward: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    up: 'KeyE',
    down: 'KeyQ',
    run: 'ShiftLeft',
    summon: 'Tab',
    interact: 'Space'
};

export const useSystem = create<SystemState>()(
    persist(
        (set) => ({
            theme: 'dark',
            setTheme: (t) => set({ theme: t }),
            perf: { fps: 0, frameTimeMs: 0 },
            setPerf: (p) => set({ perf: p }),
            lightingLevel: 1.0, 
            setLightingLevel: (l) => set({ lightingLevel: l }),
            cameraSpeed: 0.5, 
            setCameraSpeed: (s) => set({ cameraSpeed: s }),
            keys: DEFAULT_KEYS,
            setKey: (action, key) => set((s) => ({ keys: { ...s.keys, [action]: key } })),
            resetKeys: () => set({ keys: DEFAULT_KEYS }),

            user: { name: '', email: '', isAuthenticated: false },
            login: (name, email) => set({ user: { name, email, isAuthenticated: true } }),
            logout: () => set({ user: { name: '', email: '', isAuthenticated: false } })
        }),
        {
            name: 'books-os:system-v5', 
            storage: createJSONStorage(() => localStorage),
        }
    )
);