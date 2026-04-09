import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            guestToken: null,

            setGuestToken: (token) => set({ guestToken: token }),

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.produit_id === product.id);
                const effectivePrice = (product.en_promotion && product.prix_promotion)
                    ? product.prix_promotion
                    : product.prix;

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.produit_id === product.id
                                ? { ...item, quantite: item.quantite + quantity, prix: effectivePrice }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                produit_id: product.id,
                                nom: product.nom,
                                prix: effectivePrice,
                                prix_original: product.prix,
                                en_promotion: product.en_promotion || false,
                                quantite: quantity,
                                image: product.images?.[0]?.url || null,
                            },
                        ],
                    });
                }
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.produit_id === productId ? { ...item, quantite: quantity } : item
                    ),
                });
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.produit_id !== productId),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((total, item) => {
                    return total + parseFloat(item.prix) * item.quantite;
                }, 0);
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

export { useCartStore };
export default useCartStore;
