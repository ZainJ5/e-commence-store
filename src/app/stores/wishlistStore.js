import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const { items } = get();
        if (!items.some(item => item._id === product._id)) {
          set({ items: [...items, product] });
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item._id !== productId) });
      },
      
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item._id === productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useWishlistStore;