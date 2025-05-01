import { Cart, CartItem, Product } from "@/types/product";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const cartAtom = atomWithStorage<Cart>("cart-storage", {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
});

// Хелпер для перерасчёта корзины
const recalculateCart = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = items.reduce((sum, item) => {
    if (item.product.oldPrice) {
      return sum + (item.product.oldPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  return {
    items,
    totalItems,
    subtotal,
    discount,
    total: subtotal,
  };
};

// Атомы действий
export const addToCartAtom = atom(
  null,
  (get, set, product: Product, quantity: 1) => {
    const cart = get(cartAtom);
    const existingItem = cart.items.find(
      (item) => item.product.id === product.id,
    );

    let newItems: CartItem[];

    if (existingItem) {
      newItems = cart.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      newItems = [...cart.items, { product, quantity }];
    }

    set(cartAtom, recalculateCart(newItems));
  },
);

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const cart = get(cartAtom);

  const newItems = cart.items.filter((item) => item.product.id !== productId);

  set(cartAtom, recalculateCart(newItems));
});

export const updateQuantityAtom = atom(
  null,
  (get, set, productId: string, quantity: number) => {
    if (quantity <= 0) {
      set(removeFromCartAtom, productId);
      return;
    }

    const cart = get(cartAtom);
    const newItems = cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );

    set(cartAtom, recalculateCart(newItems));
  },
);

export const clearCartAtom = atom(null, (_, set) => {
  set(cartAtom, {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });
});
