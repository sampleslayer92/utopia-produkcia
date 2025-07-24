import React, { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/eshop/ProductCard';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { Skeleton } from '@/components/ui/skeleton';

const EshopPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [itemType, setItemType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, isLoading } = useWarehouseItems({
    search: search || undefined,
    category: category !== 'all' ? category : undefined,
    item_type: itemType !== 'all' ? (itemType as 'device' | 'service') : undefined,
    is_active: true,
  });

  const categories = [...new Set(products?.map(p => p.category) || [])];
  const itemTypes = [...new Set(products?.map(p => p.item_type) || [])];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Naše produkty</h1>
          <p className="text-muted-foreground">
            Objavte našu širokú ponuku produktov a služieb
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Vyhľadať produkty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Kategória" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všetky kategórie</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={itemType} onValueChange={setItemType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Typ produktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všetky typy</SelectItem>
              {itemTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(search || category !== 'all' || itemType !== 'all') && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Aktívne filtre:</span>
          {search && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearch('')}>
              Hľadanie: "{search}" ×
            </Badge>
          )}
          {category !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategory('all')}>
              Kategória: {category} ×
            </Badge>
          )}
          {itemType !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setItemType('all')}>
              Typ: {itemType} ×
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setCategory('all');
              setItemType('all');
            }}
            className="text-xs"
          >
            Vymazať všetko
          </Button>
        </div>
      )}

      <Separator />

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {products?.length || 0} produktov nájdených
        </span>
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Žiadne produkty neboli nájdené</h3>
            <p>Skúste zmeniť filtre alebo vyhľadávací výraz</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EshopPage;