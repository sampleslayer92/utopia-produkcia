
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, MapPin, Users } from "lucide-react";
import { searchCompanySuggestions, CompanyRecognitionResult } from "../services/mockCompanyRecognition";

interface CompanySearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanySelect: (company: CompanyRecognitionResult) => void;
  initialQuery?: string;
}

const CompanySearchModal = ({
  open,
  onOpenChange,
  onCompanySelect,
  initialQuery = ""
}: CompanySearchModalProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<CompanyRecognitionResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecognitionResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await searchCompanySuggestions(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCompany = (company: CompanyRecognitionResult) => {
    setSelectedCompany(company);
  };

  const handleConfirmSelection = () => {
    if (selectedCompany) {
      onCompanySelect(selectedCompany);
      onOpenChange(false);
      setQuery("");
      setResults([]);
      setSelectedCompany(null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setQuery("");
    setResults([]);
    setSelectedCompany(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Vyhľadávanie spoločnosti
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Zadajte názov spoločnosti..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim() || isSearching}
            >
              {isSearching ? "Hľadám..." : "Hľadať"}
            </Button>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h4 className="font-medium text-slate-900">Výsledky vyhľadávania:</h4>
              {results.map((company, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCompany === company
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => handleSelectCompany(company)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-slate-900 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {company.companyName}
                        </h5>
                        <p className="text-sm text-slate-600">{company.registryType}</p>
                      </div>
                      {company.isVatPayer && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          DPH platca
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">IČO:</span> {company.ico}
                      </div>
                      <div>
                        <span className="font-medium">DIČ:</span> {company.dic}
                      </div>
                    </div>

                    {company.address && (
                      <div className="flex items-start gap-1 text-sm text-slate-600">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span>
                          {company.address.street}, {company.address.city} {company.address.zipCode}
                        </span>
                      </div>
                    )}

                    {(company.section || company.insertNumber) && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Registrácia:</span>{" "}
                        {company.section && `Oddiel ${company.section}`}
                        {company.section && company.insertNumber && " | "}
                        {company.insertNumber && `Vložka ${company.insertNumber}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Company Preview */}
          {selectedCompany && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-900 mb-2">Vybratá spoločnosť:</h4>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">{selectedCompany.companyName}</p>
                <p className="text-sm text-blue-700">
                  Automaticky sa vyplnia všetky dostupné údaje vrátane adresy.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Zrušiť
            </Button>
            <Button 
              onClick={handleConfirmSelection} 
              disabled={!selectedCompany}
            >
              Vybrať spoločnosť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanySearchModal;
