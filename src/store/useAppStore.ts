import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: 'en' | 'rw';
  theme: 'light' | 'dark';
  setLanguage: (language: 'en' | 'rw') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        }),
    }),
    {
      name: 'app-storage',
    }
  )
);
