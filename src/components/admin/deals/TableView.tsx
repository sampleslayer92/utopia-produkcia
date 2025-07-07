import EnhancedContractsTable from '@/components/admin/EnhancedContractsTable';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { Card } from '@/components/ui/card';

interface TableViewProps {
  contracts: EnhancedContractData[];
  isLoading?: boolean;
}

const TableView = ({ contracts, isLoading = false }: TableViewProps) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Načítavam kontrakty...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <EnhancedContractsTable />
    </div>
  );
};

export default TableView;