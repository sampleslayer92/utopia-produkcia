import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoriesTable } from '@/components/admin/categories/CategoriesTable';
import { CategoryEditor } from '@/components/admin/categories/CategoryEditor';
import { useCategories, type Category } from '@/hooks/useCategories';
import LoadingSpinner from '@/components/ui/loading-spinner';

const CategoriesPage = () => {
  const { t } = useTranslation('admin');
  const { data: categories, isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Kategórie" subtitle="Správa kategórií produktov">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Kategórie" 
      subtitle="Správa kategórií produktov a služieb"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Kategórie</h2>
            <p className="text-muted-foreground">
              Spravujte kategórie pre produkty a služby v sklade
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať kategóriu
          </Button>
        </div>

        <CategoriesTable 
          categories={categories || []} 
          onEdit={handleEdit}
        />

        <CategoryEditor
          category={selectedCategory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoriesPage;