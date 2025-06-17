
import React from 'react';
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import EmptyStateComponent from "./EmptyStateComponent";

interface AuthorizedPersonsEmptyStateProps {
  onAddPerson: () => void;
}

const AuthorizedPersonsEmptyState = ({ onAddPerson }: AuthorizedPersonsEmptyStateProps) => {
  const { t } = useTranslation(['steps', 'forms']);

  return (
    <EmptyStateComponent
      icon={Users}
      title={t('steps:authorizedPersons.emptyState.title')}
      description={t('steps:authorizedPersons.emptyState.description')}
      buttonText={t('steps:authorizedPersons.addPersonButton')}
      onAction={onAddPerson}
    />
  );
};

export default AuthorizedPersonsEmptyState;
