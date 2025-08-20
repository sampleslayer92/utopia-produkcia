-- Create identity-documents storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('identity-documents', 'identity-documents', true);

-- Create RLS policies for identity-documents bucket
CREATE POLICY "Anyone can view identity documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'identity-documents');

CREATE POLICY "Users can upload identity documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'identity-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their identity documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'identity-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their identity documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'identity-documents' AND auth.uid() IS NOT NULL);