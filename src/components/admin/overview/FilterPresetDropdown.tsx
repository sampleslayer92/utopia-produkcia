import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkPlus, Bookmark } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterPresetDropdownProps {
  currentPreset: string | null;
  onPresetSelect: (preset: string | null) => void;
}

const FilterPresetDropdown = ({ currentPreset, onPresetSelect }: FilterPresetDropdownProps) => {
  const presets = [
    { id: 'hot_leads', name: 'Hot Leads', description: 'High value, ready to close' },
    { id: 'new_requests', name: 'New Requests', description: 'Recently submitted' },
    { id: 'pending_review', name: 'Pending Review', description: 'Awaiting approval' },
    { id: 'this_month', name: 'This Month', description: 'Created this month' },
    { id: 'high_value', name: 'High Value', description: 'Above €50,000' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9"
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentPreset ? presets.find(p => p.id === currentPreset)?.name : 'Presets'}
          </span>
          {currentPreset && (
            <Badge variant="secondary" className="ml-1 h-4 px-1">
              1
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <h4 className="font-medium text-sm mb-2">Filter Presets</h4>
        </div>
        <DropdownMenuSeparator />
        
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onPresetSelect(preset.id)}
            className={`cursor-pointer ${currentPreset === preset.id ? 'bg-accent' : ''}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{preset.name}</span>
              <span className="text-xs text-muted-foreground">{preset.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onPresetSelect(null)}>
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save Current Filters
        </DropdownMenuItem>
        
        {currentPreset && (
          <DropdownMenuItem 
            onClick={() => onPresetSelect(null)}
            className="text-red-600"
          >
            Clear Preset
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterPresetDropdown;