import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      // Add item to cart
      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(
          item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id && 
              item.size === product.size && 
              item.color === product.color
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }]
          });
        }
      },

      // Remove item from cart
      removeItem: (id, size, color) => {
        const { items } = get();
        set({
          items: items.filter(
            item => !(item.id === id && item.size === size && item.color === color)
          )
        });
      },

      // Update item quantity
      updateQuantity: (id, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }

        const { items } = get();
        set({
          items: items.map(item =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          )
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Toggle cart drawer
      toggleCart: () => {
        set(state => ({ isCartOpen: !state.isCartOpen }));
      },

      // Open cart
      openCart: () => {
        set({ isCartOpen: true });
      },

      // Close cart
      closeCart: () => {
        set({ isCartOpen: false });
      },

      // Get cart totals
      getCartTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const total = subtotal + tax + shipping;

        return {
          subtotal,
          tax,
          shipping,
          total,
          itemCount: items.reduce((count, item) => count + item.quantity, 0)
        };
      },

      // Get item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'shahbazar-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;