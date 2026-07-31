import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items
        const existing = items.find((i) => i._id === product._id)
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, quantita: i.quantita + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantita: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) })
      },

      updateQuantity: (id, quantita) => {
        if (quantita <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantita } : i
          ),
        })
      },

      clear: () => set({ items: [] }),
    }),
    { name: 'zest-cart' }
  )
)

export default useCartStore
