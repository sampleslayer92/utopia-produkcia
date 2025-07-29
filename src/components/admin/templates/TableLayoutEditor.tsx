import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, GripVertical, Settings, Merge, Split, Table } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TableCell {
  id: string;
  row: number;
  col: number;
  colspan: number;
  rowspan: number;
  field?: {
    key: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
  };
  type: 'field' | 'label' | 'empty';
  content?: string;
}

interface TableLayoutEditorProps {
  table: {
    rows: number;
    cols: number;
    cells: TableCell[];
  };
  onChange: (table: any) => void;
  onClose: () => void;
}

const SortableTableCell = ({ cell, onCellClick, isSelected }: { 
  cell: TableCell; 
  onCellClick: (cell: TableCell) => void;
  isSelected: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: cell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getCellContent = () => {
    if (cell.field) {
      return (
        <div className="p-2 text-sm">
          <div className="font-medium">{cell.field.label}</div>
          <div className="text-xs text-muted-foreground">{cell.field.type}</div>
        </div>
      );
    }
    if (cell.content) {
      return <div className="p-2 text-sm font-medium">{cell.content}</div>;
    }
    return <div className="p-2 text-xs text-muted-foreground">Prázdna bunka</div>;
  };

  return (
    <td
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border border-border cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
      }`}
      colSpan={cell.colspan}
      rowSpan={cell.rowspan}
      onClick={() => onCellClick(cell)}
    >
      {getCellContent()}
    </td>
  );
};

export const TableLayoutEditor: React.FC<TableLayoutEditorProps> = ({
  table,
  onChange,
  onClose
}) => {
  const [selectedCell, setSelectedCell] = useState<TableCell | null>(null);
  const [editingField, setEditingField] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateTable = useCallback((updates: Partial<typeof table>) => {
    onChange({ ...table, ...updates });
  }, [table, onChange]);

  const addRow = () => {
    const newCells = [...table.cells];
    for (let col = 0; col < table.cols; col++) {
      newCells.push({
        id: `cell_${table.rows}_${col}_${Date.now()}`,
        row: table.rows,
        col,
        colspan: 1,
        rowspan: 1,
        type: 'empty'
      });
    }
    updateTable({ rows: table.rows + 1, cells: newCells });
  };

  const addColumn = () => {
    const newCells = [...table.cells];
    for (let row = 0; row < table.rows; row++) {
      newCells.push({
        id: `cell_${row}_${table.cols}_${Date.now()}`,
        row,
        col: table.cols,
        colspan: 1,
        rowspan: 1,
        type: 'empty'
      });
    }
    updateTable({ cols: table.cols + 1, cells: newCells });
  };

  const updateCell = (cellId: string, updates: Partial<TableCell>) => {
    const newCells = table.cells.map(cell =>
      cell.id === cellId ? { ...cell, ...updates } : cell
    );
    updateTable({ cells: newCells });
  };

  const mergeSelectedCells = () => {
    // Implementation for merging cells would go here
    console.log('Merge cells functionality');
  };

  const splitCell = (cellId: string) => {
    // Implementation for splitting cells would go here
    console.log('Split cell functionality');
  };

  const addFieldToCell = (cell: TableCell) => {
    const field = {
      key: `field_${Date.now()}`,
      label: 'Nové pole',
      type: 'text',
      required: false
    };
    
    updateCell(cell.id, { field, type: 'field' });
    setSelectedCell({ ...cell, field, type: 'field' });
    setEditingField(true);
  };

  const addLabelToCell = (cell: TableCell) => {
    updateCell(cell.id, { content: 'Nový label', type: 'label' });
    setSelectedCell({ ...cell, content: 'Nový label', type: 'label' });
  };

  const renderTable = () => {
    const grid: TableCell[][][] = Array(table.rows).fill(null).map(() => 
      Array(table.cols).fill(null).map(() => [])
    );

    // Fill grid with cells
    table.cells.forEach(cell => {
      if (cell.row < table.rows && cell.col < table.cols) {
        grid[cell.row][cell.col].push(cell);
      }
    });

    return (
      <table className="w-full border-collapse border border-border">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cellGroup, colIndex) => {
                if (cellGroup.length === 0) return null;
                const cell = cellGroup[0]; // Take first cell if multiple
                
                return (
                  <SortableTableCell
                    key={cell.id}
                    cell={cell}
                    onCellClick={setSelectedCell}
                    isSelected={selectedCell?.id === cell.id}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefón' },
    { value: 'date', label: 'Dátum' },
    { value: 'number', label: 'Číslo' },
    { value: 'textarea', label: 'Textová oblasť' },
    { value: 'select', label: 'Výber' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'signature', label: 'Podpis' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Späť na sekcie
          </Button>
          <div className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Editor tabuľky</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať riadok
          </Button>
          <Button variant="outline" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať stĺpec
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Náhľad tabuľky</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={() => {}}
                >
                  <SortableContext
                    items={table.cells.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {renderTable()}
                  </SortableContext>
                </DndContext>
              </div>
              
              {selectedCell && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Akcie pre vybranú bunku</h4>
                    <div className="text-sm text-muted-foreground">
                      Riadok {selectedCell.row + 1}, Stĺpec {selectedCell.col + 1}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addFieldToCell(selectedCell)}
                    >
                      Pridať pole
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addLabelToCell(selectedCell)}
                    >
                      Pridať label
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={mergeSelectedCells}
                    >
                      <Merge className="h-3 w-3 mr-1" />
                      Spojiť
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => splitCell(selectedCell.id)}
                    >
                      <Split className="h-3 w-3 mr-1" />
                      Rozdeliť
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cell Editor */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Nastavenia bunky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCell ? (
                <>
                  <div className="space-y-2">
                    <Label>Typ bunky</Label>
                    <Select
                      value={selectedCell.type}
                      onValueChange={(value) => updateCell(selectedCell.id, { type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empty">Prázdna</SelectItem>
                        <SelectItem value="label">Label</SelectItem>
                        <SelectItem value="field">Pole</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCell.type === 'label' && (
                    <div className="space-y-2">
                      <Label>Text</Label>
                      <Input
                        value={selectedCell.content || ''}
                        onChange={(e) => updateCell(selectedCell.id, { content: e.target.value })}
                        placeholder="Zadajte text"
                      />
                    </div>
                  )}

                  {selectedCell.type === 'field' && selectedCell.field && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Kľúč poľa</Label>
                        <Input
                          value={selectedCell.field.key}
                          onChange={(e) => updateCell(selectedCell.id, {
                            field: { ...selectedCell.field!, key: e.target.value }
                          })}
                          placeholder="field_key"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Názov poľa</Label>
                        <Input
                          value={selectedCell.field.label}
                          onChange={(e) => updateCell(selectedCell.id, {
                            field: { ...selectedCell.field!, label: e.target.value }
                          })}
                          placeholder="Názov poľa"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Typ poľa</Label>
                        <Select
                          value={selectedCell.field.type}
                          onValueChange={(value) => updateCell(selectedCell.id, {
                            field: { ...selectedCell.field!, type: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedCell.field.required}
                          onCheckedChange={(checked) => updateCell(selectedCell.id, {
                            field: { ...selectedCell.field!, required: checked }
                          })}
                        />
                        <Label>Povinné pole</Label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Colspan</Label>
                      <Input
                        type="number"
                        min="1"
                        value={selectedCell.colspan}
                        onChange={(e) => updateCell(selectedCell.id, { colspan: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rowspan</Label>
                      <Input
                        type="number"
                        min="1"
                        value={selectedCell.rowspan}
                        onChange={(e) => updateCell(selectedCell.id, { rowspan: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Kliknite na bunku pre úpravu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};