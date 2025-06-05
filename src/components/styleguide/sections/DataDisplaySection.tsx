
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '../CodeBlock';

interface DataDisplaySectionProps {
  searchTerm: string;
}

const DataDisplaySection: React.FC<DataDisplaySectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('data table card zobrazovanie tabuľka').includes(searchTerm.toLowerCase())) {
    return null;
  }

  const sampleData = [
    { id: 1, name: 'John Doe', status: 'Active', revenue: '€1,234' },
    { id: 2, name: 'Jane Smith', status: 'Pending', revenue: '€2,567' },
    { id: 3, name: 'Bob Wilson', status: 'Inactive', revenue: '€890' },
  ];

  return (
    <section id="data" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📊 Zobrazovanie dát</h2>
        <p className="text-muted-foreground">
          Komponenty pre zobrazovanie a organizáciu dát v aplikácii.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tables</CardTitle>
          <CardDescription>Tabuľky pre zobrazovanie štruktúrovaných dát</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Meno</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Výnosy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={row.status === 'Active' ? 'default' : 
                                row.status === 'Pending' ? 'secondary' : 'destructive'}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{row.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <CodeBlock
            code={`// Základná tabuľka
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Stĺpec 1</TableHead>
      <TableHead>Stĺpec 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.value}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
          <CardDescription>Kontajnery pre skupiny súvisiacich informácií</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Základná karta</CardTitle>
                <CardDescription>Jednoduchá karta s nadpisom a opisom</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Obsah karty môže obsahovať akýkoľvek typ informácií.</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800">Úspešná karta</CardTitle>
                <CardDescription className="text-emerald-600">
                  Karta pre pozitívne stavy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-700">Operácia bola úspešne dokončená.</p>
              </CardContent>
            </Card>
          </div>

          <CodeBlock
            code={`// Základná karta
<Card>
  <CardHeader>
    <CardTitle>Nadpis karty</CardTitle>
    <CardDescription>Popis karty</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Obsah karty</p>
  </CardContent>
</Card>

// Karta s custom štýlmi
<Card className="border-emerald-200 bg-emerald-50">
  <CardHeader>
    <CardTitle className="text-emerald-800">Úspech</CardTitle>
  </CardHeader>
</Card>`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default DataDisplaySection;
