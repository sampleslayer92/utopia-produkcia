
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineTableFilter } from "@/components/admin/table/InlineTableFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FilterX } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  filter?: {
    type: 'text' | 'select' | 'date-range';
    options?: { value: string; label: string }[];
    placeholder?: string;
  };
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  title,
  subtitle,
  isLoading,
  error,
  onRowClick,
  emptyMessage,
  emptyIcon,
  onFiltersChange
}: DataTableProps<T>) {
  const { t } = useTranslation('admin');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (columnKey: string, value: any) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange?.({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-100">
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
              <p className="text-slate-600 font-medium">Načítavam dáta...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50/50 to-red-100/30 border-b border-red-100">
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          <CardDescription className="text-red-600 font-medium">
            {t('table.error', { message: error.message })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-100">
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
              {emptyIcon}
            </div>
            <p className="text-center text-lg font-medium text-slate-600 mb-2">Žiadne dáta</p>
            <p className="text-center text-sm text-slate-500">{emptyMessage || t('table.emptyMessage')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
            {subtitle && (
              <CardDescription className="text-slate-600 mt-1">
                {subtitle.includes('{count}') 
                  ? subtitle.replace('{count}', data.length.toString())
                  : subtitle
                }
              </CardDescription>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filtrov'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Vymazať všetky
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50/80 to-blue-50/50 border-b border-slate-200 hover:bg-slate-50">
                {columns.map((column) => (
                  <TableHead key={column.key} className={`font-semibold text-slate-700 ${column.className || ''}`}>
                    <div className="flex items-center justify-between min-h-[2.5rem]">
                      <span>{column.header}</span>
                      {column.filter && (
                        <InlineTableFilter
                          type={column.filter.type}
                          options={column.filter.options}
                          placeholder={column.filter.placeholder}
                          value={filters[column.key]}
                          onValueChange={(value) => handleFilterChange(column.key, value)}
                          hasActiveFilter={!!filters[column.key]}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className={`
                    hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 
                    transition-all duration-200 border-b border-slate-100/50
                    ${onRowClick ? 'cursor-pointer hover:shadow-sm' : ''}
                    ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                  `}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={`py-4 ${column.className || ''}`}>
                      {column.accessor(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
