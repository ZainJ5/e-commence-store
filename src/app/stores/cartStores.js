import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          const updatedItems = currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          
          set((state) => ({
            items: updatedItems,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          }));
        }
      },
      
      removeItem: (itemId) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === itemId);
        
        if (!itemToRemove) return;
        
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
          totalItems: state.totalItems - itemToRemove.quantity,
          totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
        }));
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        
        const currentItems = get().items;
        const itemToUpdate = currentItems.find((i) => i.id === itemId);
        
        if (!itemToUpdate) return;
        
        const quantityDifference = quantity - itemToUpdate.quantity;
        
        const updatedItems = currentItems.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        
        set((state) => ({
          items: updatedItems,
          totalItems: state.totalItems + quantityDifference,
          totalPrice: state.totalPrice + (itemToUpdate.price * quantityDifference),
        }));
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: 'cart-storage', 
      getStorage: () => (typeof window !== 'undefined' ? window.localStorage : null),
    }
  )
);

export default useCartStore;