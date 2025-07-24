-- Create contract_documents table for managing multiple documents per contract
CREATE TABLE public.contract_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('main', 'g1', 'g2')),
  document_name TEXT NOT NULL,
  document_url TEXT,
  signed_document_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'pending_signature', 'signed', 'approved'))
);

-- Add RLS to contract_documents
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (will be refined based on roles)
CREATE POLICY "Allow all operations on contract_documents" 
ON public.contract_documents 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Merchants can view their contract documents
CREATE POLICY "Merchants can view their contract documents" 
ON public.contract_documents 
FOR SELECT 
USING (
  has_role(auth.uid(), 'merchant'::app_role) AND 
  contract_id IN (
    SELECT c.id FROM contracts c 
    JOIN merchants m ON c.merchant_id = m.id 
    WHERE m.contact_person_email = auth.email()
  )
);

-- Partners can view related contract documents
CREATE POLICY "Partners can view related contract_documents" 
ON public.contract_documents 
FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) AND 
  contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_contract_documents_updated_at
BEFORE UPDATE ON public.contract_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_contract_documents_contract_id ON public.contract_documents(contract_id);
CREATE INDEX idx_contract_documents_type_status ON public.contract_documents(document_type, status);

-- Add new notification types for document workflow
INSERT INTO public.contract_statuses (name, label, description, color, category, entity_type) VALUES
  ('pending_documents', 'Čakajú dokumenty', 'Dokumenty boli vygenerované a čakajú na podpis', '#F59E0B', 'documents', 'contracts'),
  ('documents_signed', 'Dokumenty podpísané', 'Všetky dokumenty boli podpísané merchantom', '#10B981', 'documents', 'contracts'),
  ('pending_approval', 'Čaká na schválenie', 'Žiadosť čaká na schválenie adminom', '#3B82F6', 'approval', 'contracts');

-- Extend contracts table with document-related fields
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS documents_generated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS documents_signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES auth.users(id);