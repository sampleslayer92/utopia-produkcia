
import React from 'react';
import { UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import EmptyStateComponent from "./EmptyStateComponent";

interface ActualOwnersEmptyStateProps {
  onAddOwner: () => void;
}

const ActualOwnersEmptyState = ({ onAddOwner }: ActualOwnersEmptyStateProps) => {
  const { t } = useTranslation(['steps', 'forms']);

  return (
    <EmptyStateComponent
      icon={UserCheck}
      title={t('steps:actualOwners.emptyState.title')}
      description={t('steps:actualOwners.emptyState.description')}
      buttonText={t('steps:actualOwners.addOwnerButton')}
      onAction={onAddOwner}
    />
  );
};

export default ActualOwnersEmptyState;
