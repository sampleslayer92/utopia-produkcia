import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ItemTypesTable } from '@/components/admin/item-types/ItemTypesTable';
import { ItemTypeEditor } from '@/components/admin/item-types/ItemTypeEditor';
import { useItemTypes, type ItemType } from '@/hooks/useItemTypes';
import LoadingSpinner from '@/components/ui/loading-spinner';

const ItemTypesPage = () => {
  const { t } = useTranslation('admin');
  const { data: itemTypes, isLoading } = useItemTypes();
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (itemType: ItemType) => {
    setSelectedItemType(itemType);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItemType(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemType(null);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Typy položiek" subtitle="Správa typov produktov">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Typy položiek" 
      subtitle="Správa typov produktov a služieb"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Typy položiek</h2>
            <p className="text-muted-foreground">
              Spravujte typy pre produkty a služby v sklade
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať typ
          </Button>
        </div>

        <ItemTypesTable 
          itemTypes={itemTypes || []} 
          onEdit={handleEdit}
        />

        <ItemTypeEditor
          itemType={selectedItemType}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </AdminLayout>
  );
};

export default ItemTypesPage;