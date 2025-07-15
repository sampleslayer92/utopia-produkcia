import { useState, useCallback } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  ico?: string;
  dic?: string;
  vat_number?: string;
}

interface CartItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  lineTotal: number;
  warehouseItemId?: string;
}

interface QuickSale {
  id?: string;
  customerId?: string;
  saleDate: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  status: string;
  notes?: string;
  items: CartItem[];
}

export const useQuickSale = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const vatAmount = cart.reduce((sum, item) => sum + (item.lineTotal * item.vatRate) / 100, 0);
  const totalAmount = discountedSubtotal + vatAmount;

  // Add item to cart
  const addToCart = useCallback((item: Omit<CartItem, 'lineTotal'>) => {
    const lineTotal = item.quantity * item.unitPrice;
    const cartItem: CartItem = { ...item, lineTotal };
    
    setCart(prev => {
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
          lineTotal: (updated[existingIndex].quantity + item.quantity) * updated[existingIndex].unitPrice
        };
        return updated;
      }
      return [...prev, cartItem];
    });
  }, []);

  // Update cart item
  const updateCartItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.lineTotal = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountPercentage(0);
    setNotes('');
  }, []);

  // Fetch customers
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Customer[];
    }
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: Omit<Customer, 'id'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();
      
      if (error) throw error;
      return data as Customer;
    },
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setSelectedCustomer(newCustomer);
      toast.success('Zákazník vytvorený');
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast.error('Chyba pri vytváraní zákazníka');
    }
  });

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (saleData: QuickSale) => {
      const { data: user } = await supabase.auth.getUser();
      
      // Create the sale record
      const { data: sale, error: saleError } = await supabase
        .from('quick_sales')
        .insert([{
          customer_id: saleData.customerId,
          subtotal: saleData.subtotal,
          vat_amount: saleData.vatAmount,
          total_amount: saleData.totalAmount,
          discount_percentage: saleData.discountPercentage,
          discount_amount: saleData.discountAmount,
          status: saleData.status,
          notes: saleData.notes,
          created_by: user.user?.id
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = saleData.items.map(item => ({
        quick_sale_id: sale.id,
        warehouse_item_id: item.warehouseItemId,
        item_name: item.name,
        item_description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        vat_rate: item.vatRate,
        line_total: item.lineTotal
      }));

      const { error: itemsError } = await supabase
        .from('quick_sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return sale;
    },
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: ['quick-sales'] });
      toast.success(`Predaj ${sale.sale_number} vytvorený`);
      clearCart();
    },
    onError: (error) => {
      console.error('Error creating sale:', error);
      toast.error('Chyba pri vytváraní predaja');
    }
  });

  // Process sale
  const processSale = useCallback(async () => {
    if (!selectedCustomer) {
      toast.error('Vyberte zákazníka');
      return;
    }

    if (cart.length === 0) {
      toast.error('Košík je prázdny');
      return;
    }

    const saleData: QuickSale = {
      customerId: selectedCustomer.id,
      saleDate: new Date().toISOString(),
      subtotal: discountedSubtotal,
      vatAmount,
      totalAmount,
      discountPercentage,
      discountAmount,
      status: 'completed',
      notes: notes || undefined,
      items: cart
    };

    await createSaleMutation.mutateAsync(saleData);
  }, [selectedCustomer, cart, discountedSubtotal, vatAmount, totalAmount, discountPercentage, discountAmount, notes, createSaleMutation]);

  return {
    // Cart state
    cart,
    selectedCustomer,
    discountPercentage,
    notes,
    
    // Calculated totals
    subtotal,
    discountAmount,
    vatAmount,
    totalAmount,
    
    // Cart actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    
    // Customer actions
    setSelectedCustomer,
    createCustomer: createCustomerMutation.mutateAsync,
    customers,
    customersLoading,
    
    // Sale actions
    processSale,
    isProcessing: createSaleMutation.isPending,
    
    // Form setters
    setDiscountPercentage,
    setNotes
  };
};