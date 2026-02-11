import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGlobalStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      notifications: [],
      addNotification: (note) => set((state) => ({ 
        notifications: [...state.notifications, { id: Date.now(), ...note }] 
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'elite-shine-storage',
    }
  )
);

export default useGlobalStore;
