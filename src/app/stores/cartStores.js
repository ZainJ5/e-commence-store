"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              totalItems: state.totalItems + item.quantity,
              totalPrice: state.totalPrice + (item.price * item.quantity),
            };
          }
          

          const newItem = {
            ...item,
            customizable: typeof item.customizable === 'boolean' ? item.customizable : false
          };
          
          console.log("Adding item to cart with customizable:", newItem.customizable);
          
          return {
            items: [...state.items, newItem],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + (item.price * item.quantity),
          };
        });
      },
      
      removeItem: (itemId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          
          return {
            items: state.items.filter((i) => i.id !== itemId),
            totalItems: state.totalItems - item.quantity,
            totalPrice: state.totalPrice - (item.price * item.quantity),
          };
        });
      },
      
      updateItemQuantity: (itemId, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          
          const quantityDifference = quantity - item.quantity;
          
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
            totalItems: state.totalItems + quantityDifference,
            totalPrice: state.totalPrice + (item.price * quantityDifference),
          };
        });
      },
      
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
      
      getCartItemCount: () => {
        return get().totalItems;
      },
      
      getCartTotal: () => {
        return get().totalPrice;
      },
      
      hasItems: () => {
        return get().items.length > 0;
      },
      
      getItem: (itemId) => {
        return get().items.find((item) => item.id === itemId);
      }
    }),
    {
      name: 'cart-storage',
      getStorage: () => (typeof window !== 'undefined' ? localStorage : null),
    }
  )
);

export default useCartStore;