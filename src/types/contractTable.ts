
export interface BulkAction {
  type: 'changeType' | 'changeSalesperson' | 'delete';
  value?: string;
}

export interface ContractFilters {
  status: string;
  contractType: string;
  client: string;
  salesperson: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

export interface ContractSelection {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  selectAll: () => void;
  selectNone: () => void;
  toggleContract: (id: string) => void;
  toggleAll: (contractIds: string[]) => void;
}
