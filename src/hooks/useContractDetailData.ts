
import { useParams, useNavigate } from "react-router-dom";
import { useContractData } from "@/hooks/useContractData";
import { useTranslation } from 'react-i18next';

export const useContractDetailData = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  
  const contractDataResult = useContractData(id!);

  const handleBack = () => navigate('/admin');

  return {
    id,
    contractDataResult,
    handleBack,
    t
  };
};
