
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '../CodeBlock';

interface SpecializedComponentsSectionProps {
  searchTerm: string;
}

const SpecializedComponentsSection: React.FC<SpecializedComponentsSectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('specialized onboarding admin table špecializované').includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <section id="specialized" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">🎯 Špecializované komponenty</h2>
        <p className="text-muted-foreground">
          Komponenty špecifické pre našu aplikáciu a business logiku.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding komponenty</CardTitle>
          <CardDescription>Komponenty používané v onboarding procese</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">OnboardingInput</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Špecializovaný input s konzistentným štýlom pre onboarding
              </p>
              <div className="bg-muted p-3 rounded text-sm">
                <span className="text-muted-foreground">Preview:</span> Štandardný input field s onboarding štýlom
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">OnboardingSelect</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Select dropdown pre onboarding formuláre
              </p>
              <div className="bg-muted p-3 rounded text-sm">
                <span className="text-muted-foreground">Preview:</span> Dropdown s konzistentným štýlom
              </div>
            </div>
          </div>

          <CodeBlock
            code={`// Onboarding komponenty
import { OnboardingInput, OnboardingSelect } from '@/components/onboarding/ui';

// Použitie v onboarding formulári
<OnboardingInput
  label="Meno"
  placeholder="Zadajte vaše meno"
  value={name}
  onChange={setName}
/>

<OnboardingSelect
  label="Krajina"
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Table Components</CardTitle>
          <CardDescription>Pokročilé tabuľkové komponenty pre admin rozhranie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">EnhancedAdminTable</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Hlavná tabuľka s filtering, sorting a real-time updates
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Filtering</Badge>
                <Badge variant="outline">Real-time updates</Badge>
                <Badge variant="outline">Bulk actions</Badge>
                <Badge variant="outline">Export</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">ContractActionsDropdown</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Dropdown menu s akciami pre jednotlivé zmluvy
              </p>
              <div className="space-y-2">
                <Badge variant="secondary">Zobrazenie</Badge>
                <Badge variant="secondary">Editácia</Badge>
                <Badge variant="secondary">Zmazanie</Badge>
              </div>
            </div>
          </div>

          <CodeBlock
            code={`// Admin table komponenty
import { EnhancedAdminTable } from '@/components/admin';

// Použitie admin tabuľky
<EnhancedAdminTable
  filters={filters}
  onFilterChange={handleFilterChange}
  enableRealtime={true}
/>

// Dropdown s akciami
<ContractActionsDropdown
  contractId={contract.id}
  contractNumber={contract.contract_number}
  onAction={handleAction}
/>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
          <CardDescription>Špecializované badge komponenty pre stavy zmlúv</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gray-100 text-gray-700 border-gray-200">Vygenerovaná</Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslaná</Badge>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Otvorená emailom</Badge>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">Zobrazená</Badge>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Podpísaná</Badge>
              <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnutá</Badge>
            </div>
          </div>

          <CodeBlock
            code={`// Status badge funkcia
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-700">Vygenerovaná</Badge>;
    case 'submitted':
      return <Badge className="bg-blue-100 text-blue-700">Odoslaná</Badge>;
    case 'approved':
      return <Badge className="bg-emerald-100 text-emerald-700">Podpísaná</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-700">Zamietnutá</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default SpecializedComponentsSection;
