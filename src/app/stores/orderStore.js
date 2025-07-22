import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders],
        currentOrder: order
      })),
      
      setCurrentOrder: (orderId) => set((state) => ({
        currentOrder: state.orders.find(order => order.orderId === orderId) || null
      })),
      
      clearCurrentOrder: () => set({ currentOrder: null }),
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.orderId === orderId);
      },
      
      getAllOrders: () => {
        return get().orders;
      },
      
      clearAllOrders: () => set({ orders: [] }),
    }),
    {
      name: 'orders-storage',
      getStorage: () => (typeof window !== 'undefined' ? window.localStorage : null),
    }
  )
);

export default useOrderStore;