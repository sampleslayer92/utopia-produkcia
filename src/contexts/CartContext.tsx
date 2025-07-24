import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { WarehouseItem } from '@/hooks/useWarehouseItems';

export interface CartItem {
  id: string;
  product: WarehouseItem;
  quantity: number;
  isRental: boolean;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  monthlyAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: WarehouseItem; quantity: number; isRental: boolean } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addToCart: (product: WarehouseItem, quantity: number, isRental: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItem[]): { totalItems: number; totalAmount: number; monthlyAmount: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const monthlyAmount = items.reduce((sum, item) => {
    if (item.isRental) {
      return sum + (item.product.monthly_fee * item.quantity);
    }
    return sum;
  }, 0);
  
  const totalAmount = items.reduce((sum, item) => {
    if (item.isRental) {
      return sum + (item.product.monthly_fee * item.quantity);
    } else {
      return sum + (item.product.setup_fee * item.quantity);
    }
  }, 0);
  
  return { totalItems, totalAmount, monthlyAmount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id && item.isRental === action.payload.isRental
      );
      
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${action.payload.product.id}-${action.payload.isRental ? 'rental' : 'purchase'}`,
          product: action.payload.product,
          quantity: action.payload.quantity,
          isRental: action.payload.isRental,
        };
        newItems = [...state.items, newItem];
      }
      break;
    }
    
    case 'REMOVE_ITEM':
      newItems = state.items.filter(item => item.id !== action.payload);
      break;
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.payload.id);
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
    
    case 'CLEAR_CART':
      newItems = [];
      break;
    
    case 'LOAD_CART':
      newItems = action.payload;
      break;
    
    default:
      return state;
  }
  
  const totals = calculateTotals(newItems);
  return {
    items: newItems,
    ...totals,
  };
};

const CART_STORAGE_KEY = 'utopia-eshop-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    monthlyAmount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: WarehouseItem, quantity: number, isRental: boolean) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, isRental } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return state.items.find(item => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};