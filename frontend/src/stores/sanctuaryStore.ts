import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type SanctuaryState = {
  activeExperience: string
  setActiveExperience: (experience: string) => void
  theme: string
  setTheme: (theme: string) => void
  effectLevel: 'none' | 'subtle' | 'full'
  setEffectLevel: (level: 'none' | 'subtle' | 'full') => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useSanctuaryStore = create<SanctuaryState>()(
  subscribeWithSelector((set) => ({
    activeExperience: 'home',
    setActiveExperience: (experience) => set({ activeExperience: experience }),
    theme: 'purple-sanctuary',
    setTheme: (theme) => set({ theme }),
    effectLevel: 'full',
    setEffectLevel: (level) => set({ effectLevel: level }),
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  }))
)