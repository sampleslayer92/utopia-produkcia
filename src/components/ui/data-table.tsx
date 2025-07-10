
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

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          <CardDescription className="text-red-600">
            {t('table.error', { message: error.message })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            {emptyIcon}
            <p className="text-center mt-4">{emptyMessage || t('table.emptyMessage')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        {title && <CardTitle className="text-slate-900">{title}</CardTitle>}
        {subtitle && (
          <CardDescription className="text-slate-600">
            {subtitle.includes('{count}') 
              ? subtitle.replace('{count}', data.length.toString())
              : subtitle
            }
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {columns.map((column) => (
                  <TableHead key={column.key} className={`font-medium text-slate-700 ${column.className || ''}`}>
                    <div className="flex items-center justify-between">
                      {column.header}
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
              {data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className={`hover:bg-slate-50/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
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
