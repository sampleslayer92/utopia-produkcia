import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useQuickSale } from '@/hooks/useQuickSale';
import { ShoppingCart, Plus, Minus, Trash2, User, Search, Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const QuickSalePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    ico: '',
    dic: '',
    vat_number: ''
  });

  const { data: warehouseItems } = useWarehouseItems({
    search: searchTerm,
    category: selectedCategory || undefined,
    is_active: true
  });

  const {
    cart,
    selectedCustomer,
    discountPercentage,
    notes,
    subtotal,
    discountAmount,
    vatAmount,
    totalAmount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setSelectedCustomer,
    createCustomer,
    customers,
    customersLoading,
    processSale,
    isProcessing,
    setDiscountPercentage,
    setNotes
  } = useQuickSale();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unitPrice: item.monthly_fee,
      vatRate: 20,
      warehouseItemId: item.id
    });
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) return;
    
    await createCustomer(newCustomer);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      ico: '',
      dic: '',
      vat_number: ''
    });
    setShowCustomerDialog(false);
  };

  const categories = Array.from(new Set(warehouseItems?.map(item => item.category) || []));

  return (
    <AdminLayout title="Rýchly predaj" subtitle="POS systém pre vytváranie faktúr">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Product Browser */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produkty a služby
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and filters */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Hľadať produkty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Všetky kategórie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Products grid */}
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {warehouseItems?.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{item.monthly_fee}€</p>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="mt-1"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart and Checkout */}
        <div className="space-y-4">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Zákazník
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedCustomer ? (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  {selectedCustomer.email && <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>}
                  {selectedCustomer.phone && <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    className="mt-2"
                  >
                    Zmeniť zákazníka
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      const customer = customers?.find(c => c.id === e.target.value);
                      if (customer) setSelectedCustomer(customer);
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={customersLoading}
                  >
                    <option value="">Vyberte zákazníka</option>
                    {customers?.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                  
                  <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Nový zákazník
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Vytvorenie nového zákazníka</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Názov *</Label>
                          <Input
                            id="name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Názov spoločnosti alebo meno"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefón</Label>
                          <Input
                            id="phone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+421 xxx xxx xxx"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ico">IČO</Label>
                          <Input
                            id="ico"
                            value={newCustomer.ico}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, ico: e.target.value }))}
                            placeholder="12345678"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                            Zrušiť
                          </Button>
                          <Button onClick={handleCreateCustomer} disabled={!newCustomer.name.trim()}>
                            Vytvoriť
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Košík ({cart.length})
                </div>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Košík je prázdny</p>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.unitPrice}€ × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Checkout */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Súčet objednávky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="discount">Zľava (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Poznámky</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Poznámky k objednávke..."
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Medzisúčet:</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Zľava ({discountPercentage}%):</span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>DPH (20%):</span>
                    <span>{vatAmount.toFixed(2)}€</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Celkom:</span>
                    <span>{totalAmount.toFixed(2)}€</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={processSale}
                  disabled={!selectedCustomer || isProcessing}
                >
                  {isProcessing ? 'Spracováva sa...' : 'Vytvoriť faktúru'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};