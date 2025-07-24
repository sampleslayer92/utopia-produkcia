import React from 'react';
import { Outlet } from 'react-router-dom';
import EshopHeader from './EshopHeader';
import { CartProvider } from '@/contexts/CartContext';

const EshopLayout: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <EshopHeader />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
};

export default EshopLayout;