-- Complete demo data with contracts and related data using the new merchant IDs
-- Insert contracts using the merchant IDs from previous insert
INSERT INTO public.contracts (
  merchant_id,
  contract_number,
  status,
  created_by,
  created_at,
  submitted_at
) VALUES 
  ('e0876ecf-28bf-445f-9631-f6d5c989b579', 'ZML-2024-201', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-15 10:30:00+02', '2024-01-15 12:00:00+02'),
  ('78abb928-0268-4be0-b8f3-a3fcaadc27d6', 'ZML-2024-202', 'approved', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-20 15:00:00+02', '2024-01-20 16:30:00+02'),
  ('ab44f7e0-1a3b-4d24-9deb-199f8ad058ce', 'ZML-2024-203', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-01 09:45:00+02', '2024-02-01 11:15:00+02'),
  ('c3127584-c2b0-449d-ae67-b7d953aebe4d', 'ZML-2024-204', 'pending_approval', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-10 17:15:00+02', NULL),
  ('98108c19-ccb5-4078-a181-fbaf04226578', 'ZML-2024-205', 'draft', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-15 11:50:00+02', NULL),
  ('c6754634-fdef-4cd8-9db1-188224b7230e', 'ZML-2024-206', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-20 13:40:00+02', '2024-02-20 15:00:00+02')
RETURNING id, contract_number;