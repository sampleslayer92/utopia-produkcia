-- Initialize default contract templates
INSERT INTO contract_templates (name, description, template_data, created_by) VALUES 
(
  'G1 Template', 
  'Šablóna pre G1 žiadosť o akceptáciu platobných kariet',
  '{
    "type": "G1",
    "header": {
      "title": "G1 - Žádost o akceptaci platebních karet",
      "logoUrl": "/src/assets/onepos-logo.png",
      "globalPaymentsLogoUrl": "/src/assets/global-payments-logo.png",
      "backgroundColor": "#1E90FF"
    },
    "sections": [
      {
        "id": "company_info",
        "title": "1. ÚDAJE O SPOLEČNOSTI",
        "fields": [
          {"key": "company_name", "label": "Název společnosti", "type": "text", "required": true},
          {"key": "ico", "label": "IČO", "type": "text", "required": true},
          {"key": "dic", "label": "DIČ", "type": "text", "required": false},
          {"key": "vat_number", "label": "IČ DPH", "type": "text", "required": false}
        ]
      },
      {
        "id": "contact_address",
        "title": "2. KONTAKTNÍ ADRESA",
        "fields": [
          {"key": "address_street", "label": "Ulice", "type": "text", "required": true},
          {"key": "address_city", "label": "Město", "type": "text", "required": true},
          {"key": "address_zip", "label": "PSČ", "type": "text", "required": true}
        ]
      },
      {
        "id": "contact_persons",
        "title": "3. KONTAKTNÍ OSOBY",
        "subsections": [
          {
            "title": "Obchodní kontakt",
            "fields": [
              {"key": "business_contact_name", "label": "Jméno", "type": "text", "required": true},
              {"key": "business_contact_email", "label": "E-mail", "type": "email", "required": true},
              {"key": "business_contact_phone", "label": "Telefon", "type": "tel", "required": true}
            ]
          },
          {
            "title": "Technický kontakt",
            "fields": [
              {"key": "tech_contact_name", "label": "Jméno", "type": "text", "required": true},
              {"key": "tech_contact_email", "label": "E-mail", "type": "email", "required": true},
              {"key": "tech_contact_phone", "label": "Telefon", "type": "tel", "required": true}
            ]
          }
        ]
      },
      {
        "id": "business_locations",
        "title": "4. ÚDAJE O PROVOZOVNĚ OBCHODNÍKA",
        "type": "dynamic_table",
        "fields": [
          {"key": "location_name", "label": "Název provozovny", "type": "text"},
          {"key": "location_address", "label": "Adresa", "type": "text"},
          {"key": "terminal_type", "label": "Typ terminálu", "type": "select"}
        ]
      },
      {
        "id": "functionalities",
        "title": "5. FUNKCIONALITY",
        "type": "checkbox_matrix",
        "options": [
          {"key": "ecommerce", "label": "E-COMMERCE"},
          {"key": "pos", "label": "POS"},
          {"key": "visa", "label": "VISA"},
          {"key": "mastercard", "label": "MASTERCARD"},
          {"key": "maestro", "label": "MAESTRO"}
        ]
      }
    ],
    "footer": {
      "brandingText": "ONEPOS",
      "pageNumberFormat": "Strana {page}/{totalPages}"
    },
    "styling": {
      "primaryColor": "#1E90FF",
      "fontFamily": "Arial, sans-serif",
      "fontSize": "12px",
      "margin": "20px",
      "pageFormat": "A4"
    }
  }',
  (SELECT id FROM auth.users WHERE email = 'admin@utopia.com' LIMIT 1)
),
(
  'G2 Template',
  'Šablóna pre G2 prohlášení o skutečném majiteli', 
  '{
    "type": "G2",
    "header": {
      "title": "G2 - Prohlášení o skutečném majiteli",
      "logoUrl": "/src/assets/onepos-logo.png",
      "globalPaymentsLogoUrl": "/src/assets/global-payments-logo.png",
      "backgroundColor": "#1E90FF"
    },
    "sections": [
      {
        "id": "authorized_persons",
        "title": "1. OPRÁVNĚNÉ OSOBY",
        "type": "dynamic_form",
        "fields": [
          {"key": "first_name", "label": "Jméno", "type": "text", "required": true},
          {"key": "last_name", "label": "Příjmení", "type": "text", "required": true},
          {"key": "birth_date", "label": "Datum narození", "type": "date", "required": true},
          {"key": "birth_place", "label": "Místo narození", "type": "text", "required": true},
          {"key": "document_type", "label": "Typ dokladu", "type": "select", "options": ["OP", "Pas"]},
          {"key": "document_number", "label": "Číslo dokladu", "type": "text", "required": true},
          {"key": "position", "label": "Pozice", "type": "text", "required": true}
        ]
      },
      {
        "id": "beneficial_owners",
        "title": "2. SKUTEČNÝ MAJITEL",
        "type": "dynamic_form", 
        "fields": [
          {"key": "owner_first_name", "label": "Jméno", "type": "text", "required": true},
          {"key": "owner_last_name", "label": "Příjmení", "type": "text", "required": true},
          {"key": "owner_birth_date", "label": "Datum narození", "type": "date", "required": true},
          {"key": "owner_birth_place", "label": "Místo narození", "type": "text", "required": true},
          {"key": "owner_citizenship", "label": "Státní příslušnost", "type": "text", "required": true},
          {"key": "owner_address", "label": "Trvalé bydliště", "type": "textarea", "required": true}
        ]
      },
      {
        "id": "signature_section",
        "title": "3. PODPIS",
        "type": "signature_area",
        "fields": [
          {"key": "signature_date", "label": "Datum", "type": "date"},
          {"key": "signature_place", "label": "Místo", "type": "text"},
          {"key": "signature_area", "label": "Podpis oprávněné osoby", "type": "signature"}
        ]
      }
    ],
    "footer": {
      "brandingText": "ONEPOS",
      "pageNumberFormat": "Strana {page}/{totalPages}"
    },
    "styling": {
      "primaryColor": "#1E90FF",
      "fontFamily": "Arial, sans-serif", 
      "fontSize": "12px",
      "margin": "20px",
      "pageFormat": "A4"
    }
  }',
  (SELECT id FROM auth.users WHERE email = 'admin@utopia.com' LIMIT 1)
);