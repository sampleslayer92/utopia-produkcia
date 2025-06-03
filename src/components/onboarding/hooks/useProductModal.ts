
import { useState } from 'react';
import { DeviceCard, ServiceCard } from '@/types/onboarding';

interface ProductModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  productType: 'device' | 'service';
  product: any;
  editingCard?: DeviceCard | ServiceCard;
}

export const useProductModal = () => {
  const [modalState, setModalState] = useState<ProductModalState>({
    isOpen: false,
    mode: 'add',
    productType: 'device',
    product: null,
    editingCard: undefined
  });

  const openAddModal = (product: any, type: 'device' | 'service') => {
    setModalState({
      isOpen: true,
      mode: 'add',
      productType: type,
      product,
      editingCard: undefined
    });
  };

  const openEditModal = (card: DeviceCard | ServiceCard) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      productType: card.type,
      product: card,
      editingCard: card
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'add',
      productType: 'device',
      product: null,
      editingCard: undefined
    });
  };

  return {
    modalState,
    openAddModal,
    openEditModal,
    closeModal
  };
};
