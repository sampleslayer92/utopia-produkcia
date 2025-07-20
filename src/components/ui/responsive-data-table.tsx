
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface ResponsiveDataTableColumn<T> {
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
  hideOnSmall?: boolean; // Hide on screens smaller than 1440px
  hideOnCompact?: boolean; // Hide on screens smaller than 1600px
}

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: ResponsiveDataTableColumn<T>[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export function ResponsiveDataTable<T extends { id: string }>({
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
}: ResponsiveDataTableProps<T>) {
  const { t } = useTranslation('admin');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const isSmallScreen = useMediaQuery('(max-width: 1440px)');
  const isCompactScreen = useMediaQuery('(max-width: 1600px)');

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

  // Filter columns based on screen size
  const visibleColumns = columns.filter(column => {
    if (isSmallScreen && column.hideOnSmall) return false;
    if (isCompactScreen && column.hideOnCompact) return false;
    return true;
  });

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-100">
          {title && <CardTitle className="text-slate-900 text-lg">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600 text-sm">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-200 border-t-blue-600"></div>
              <p className="text-slate-600 font-medium text-sm">Načítavam dáta...</p>
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
          {title && <CardTitle className="text-slate-900 text-lg">{title}</CardTitle>}
          <CardDescription className="text-red-600 font-medium text-sm">
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
          {title && <CardTitle className="text-slate-900 text-lg">{title}</CardTitle>}
          {subtitle && <CardDescription className="text-slate-600 text-sm">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <div className="p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-3">
              {emptyIcon}
            </div>
            <p className="text-center text-base font-medium text-slate-600 mb-1">Žiadne dáta</p>
            <p className="text-center text-sm text-slate-500">{emptyMessage || t('table.emptyMessage')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 border-b border-slate-100 py-3">
        <div className="flex items-center justify-between">
          <div>
            {title && <CardTitle className="text-slate-900 text-lg">{title}</CardTitle>}
            {subtitle && (
              <CardDescription className="text-slate-600 mt-1 text-sm">
                {subtitle.includes('{count}') 
                  ? subtitle.replace('{count}', data.length.toString())
                  : subtitle
                }
              </CardDescription>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filtrov'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs"
              >
                <FilterX className="h-3 w-3 mr-1" />
                Vymazať
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
                {visibleColumns.map((column) => (
                  <TableHead key={column.key} className={`font-semibold text-slate-700 py-2 ${column.className || ''}`}>
                    <div className="flex items-center justify-between min-h-[2rem]">
                      <span className={isSmallScreen ? "text-xs" : "text-sm"}>{column.header}</span>
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
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key} className={`${isSmallScreen ? 'py-2 px-2' : 'py-3 px-4'} ${column.className || ''}`}>
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
