import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Package2, ArrowLeft } from 'lucide-react';
import ProductAddonManager from '@/components/warehouse/ProductAddonManager';

const ProductAddonsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  return (
    <AdminLayout 
      title="Správa doplnkov" 
      subtitle="Priraďte doplnky a príslušenstvo k hlavným produktom"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/warehouse/categories')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na sklad
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Package2 className="h-6 w-6" />
                Správa doplnkov produktov
              </h2>
              <p className="text-muted-foreground">
                Vytvorte smart previazania medzi produktmi a ich doplnkami
              </p>
            </div>
          </div>
        </div>

        <ProductAddonManager />
      </div>
    </AdminLayout>
  );
};

export default ProductAddonsPage;