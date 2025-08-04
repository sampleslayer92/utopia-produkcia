export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      actual_owners: {
        Row: {
          birth_date: string
          birth_number: string
          birth_place: string
          citizenship: string
          contract_id: string
          created_at: string
          first_name: string
          id: string
          is_politically_exposed: boolean
          last_name: string
          maiden_name: string | null
          owner_id: string
          permanent_address: string
          updated_at: string
        }
        Insert: {
          birth_date?: string
          birth_number?: string
          birth_place: string
          citizenship?: string
          contract_id: string
          created_at?: string
          first_name: string
          id?: string
          is_politically_exposed?: boolean
          last_name: string
          maiden_name?: string | null
          owner_id: string
          permanent_address: string
          updated_at?: string
        }
        Update: {
          birth_date?: string
          birth_number?: string
          birth_place?: string
          citizenship?: string
          contract_id?: string
          created_at?: string
          first_name?: string
          id?: string
          is_politically_exposed?: boolean
          last_name?: string
          maiden_name?: string | null
          owner_id?: string
          permanent_address?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "actual_owners_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      authorized_persons: {
        Row: {
          birth_date: string
          birth_number: string
          birth_place: string
          citizenship: string
          contract_id: string
          created_at: string
          document_country: string
          document_issuer: string
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_validity: string
          email: string
          first_name: string
          id: string
          is_politically_exposed: boolean
          is_us_citizen: boolean
          last_name: string
          maiden_name: string | null
          permanent_address: string
          person_id: string
          phone: string
          position: string
          updated_at: string
        }
        Insert: {
          birth_date?: string
          birth_number?: string
          birth_place: string
          citizenship?: string
          contract_id: string
          created_at?: string
          document_country?: string
          document_issuer: string
          document_number?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_validity?: string
          email: string
          first_name: string
          id?: string
          is_politically_exposed?: boolean
          is_us_citizen?: boolean
          last_name: string
          maiden_name?: string | null
          permanent_address: string
          person_id: string
          phone?: string
          position: string
          updated_at?: string
        }
        Update: {
          birth_date?: string
          birth_number?: string
          birth_place?: string
          citizenship?: string
          contract_id?: string
          created_at?: string
          document_country?: string
          document_issuer?: string
          document_number?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_validity?: string
          email?: string
          first_name?: string
          id?: string
          is_politically_exposed?: boolean
          is_us_citizen?: boolean
          last_name?: string
          maiden_name?: string | null
          permanent_address?: string
          person_id?: string
          phone?: string
          position?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authorized_persons_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address_city: string
          address_street: string
          address_zip_code: string
          average_transaction: number
          business_sector: string
          contact_person_email: string
          contact_person_name: string
          contact_person_phone: string
          contract_id: string
          created_at: string
          estimated_turnover: number
          has_pos: boolean
          iban: string
          id: string
          location_id: string
          name: string
          opening_hours: string
          seasonal_weeks: number | null
          seasonality: Database["public"]["Enums"]["seasonality_type"]
          updated_at: string
        }
        Insert: {
          address_city: string
          address_street: string
          address_zip_code?: string
          average_transaction?: number
          business_sector: string
          contact_person_email: string
          contact_person_name: string
          contact_person_phone?: string
          contract_id: string
          created_at?: string
          estimated_turnover?: number
          has_pos?: boolean
          iban?: string
          id?: string
          location_id: string
          name: string
          opening_hours: string
          seasonal_weeks?: number | null
          seasonality?: Database["public"]["Enums"]["seasonality_type"]
          updated_at?: string
        }
        Update: {
          address_city?: string
          address_street?: string
          address_zip_code?: string
          average_transaction?: number
          business_sector?: string
          contact_person_email?: string
          contact_person_name?: string
          contact_person_phone?: string
          contract_id?: string
          created_at?: string
          estimated_turnover?: number
          has_pos?: boolean
          iban?: string
          id?: string
          location_id?: string
          name?: string
          opening_hours?: string
          seasonal_weeks?: number | null
          seasonality?: Database["public"]["Enums"]["seasonality_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon_name: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          item_type_filter: string
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          item_type_filter?: string
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          item_type_filter?: string
          name?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          address_city: string
          address_street: string
          address_zip_code: string
          company_name: string
          contact_address_city: string | null
          contact_address_same_as_main: boolean
          contact_address_street: string | null
          contact_address_zip_code: string | null
          contact_person_email: string
          contact_person_first_name: string
          contact_person_is_technical: boolean
          contact_person_last_name: string
          contact_person_name: string
          contact_person_phone: string
          contract_id: string
          court: string | null
          created_at: string
          dic: string
          ico: string
          id: string
          insert_number: string | null
          is_vat_payer: boolean
          registry_type: Database["public"]["Enums"]["registry_type"]
          section: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address_city: string
          address_street: string
          address_zip_code?: string
          company_name: string
          contact_address_city?: string | null
          contact_address_same_as_main?: boolean
          contact_address_street?: string | null
          contact_address_zip_code?: string | null
          contact_person_email: string
          contact_person_first_name: string
          contact_person_is_technical?: boolean
          contact_person_last_name: string
          contact_person_name: string
          contact_person_phone?: string
          contract_id: string
          court?: string | null
          created_at?: string
          dic?: string
          ico?: string
          id?: string
          insert_number?: string | null
          is_vat_payer?: boolean
          registry_type?: Database["public"]["Enums"]["registry_type"]
          section?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address_city?: string
          address_street?: string
          address_zip_code?: string
          company_name?: string
          contact_address_city?: string | null
          contact_address_same_as_main?: boolean
          contact_address_street?: string | null
          contact_address_zip_code?: string | null
          contact_person_email?: string
          contact_person_first_name?: string
          contact_person_is_technical?: boolean
          contact_person_last_name?: string
          contact_person_name?: string
          contact_person_phone?: string
          contract_id?: string
          court?: string | null
          created_at?: string
          dic?: string
          ico?: string
          id?: string
          insert_number?: string | null
          is_vat_payer?: boolean
          registry_type?: Database["public"]["Enums"]["registry_type"]
          section?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_info_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          contract_id: string
          created_at: string
          electronic_communication_consent: boolean
          gdpr_consent: boolean
          id: string
          signature_date: string | null
          signing_person_id: string | null
          terms_consent: boolean
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          electronic_communication_consent?: boolean
          gdpr_consent?: boolean
          id?: string
          signature_date?: string | null
          signing_person_id?: string | null
          terms_consent?: boolean
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          electronic_communication_consent?: boolean
          gdpr_consent?: boolean
          id?: string
          signature_date?: string | null
          signing_person_id?: string | null
          terms_consent?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_info: {
        Row: {
          contract_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          phone_prefix: string
          sales_note: string | null
          salutation: Database["public"]["Enums"]["salutation_type"] | null
          updated_at: string
          user_role: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string
          phone_prefix?: string
          sales_note?: string | null
          salutation?: Database["public"]["Enums"]["salutation_type"] | null
          updated_at?: string
          user_role?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          phone_prefix?: string
          sales_note?: string | null
          salutation?: Database["public"]["Enums"]["salutation_type"] | null
          updated_at?: string
          user_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_info_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_calculations: {
        Row: {
          calculation_data: Json | null
          contract_id: string
          created_at: string
          effective_regulated: number
          effective_unregulated: number
          id: string
          monthly_turnover: number
          regulated_fee: number
          service_margin: number
          total_company_costs: number
          total_customer_payments: number
          total_monthly_profit: number
          transaction_margin: number
          unregulated_fee: number
          updated_at: string
        }
        Insert: {
          calculation_data?: Json | null
          contract_id: string
          created_at?: string
          effective_regulated?: number
          effective_unregulated?: number
          id?: string
          monthly_turnover?: number
          regulated_fee?: number
          service_margin?: number
          total_company_costs?: number
          total_customer_payments?: number
          total_monthly_profit?: number
          transaction_margin?: number
          unregulated_fee?: number
          updated_at?: string
        }
        Update: {
          calculation_data?: Json | null
          contract_id?: string
          created_at?: string
          effective_regulated?: number
          effective_unregulated?: number
          id?: string
          monthly_turnover?: number
          regulated_fee?: number
          service_margin?: number
          total_company_costs?: number
          total_customer_payments?: number
          total_monthly_profit?: number
          transaction_margin?: number
          unregulated_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_calculations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          contract_id: string
          created_at: string
          document_name: string
          document_type: string
          document_url: string | null
          generated_at: string | null
          id: string
          signed_at: string | null
          signed_document_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_name: string
          document_type: string
          document_url?: string | null
          generated_at?: string | null
          id?: string
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          document_url?: string | null
          generated_at?: string | null
          id?: string
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_item_addons: {
        Row: {
          addon_id: string
          addon_name: string
          company_cost: number
          contract_item_id: string
          count: number
          created_at: string
          id: string
          monthly_fee: number
          updated_at: string
        }
        Insert: {
          addon_id: string
          addon_name: string
          company_cost?: number
          contract_item_id: string
          count?: number
          created_at?: string
          id?: string
          monthly_fee?: number
          updated_at?: string
        }
        Update: {
          addon_id?: string
          addon_name?: string
          company_cost?: number
          contract_item_id?: string
          count?: number
          created_at?: string
          id?: string
          monthly_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_item_addons_contract_item_id_fkey"
            columns: ["contract_item_id"]
            isOneToOne: false
            referencedRelation: "contract_items"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_items: {
        Row: {
          category: string
          company_cost: number
          contract_id: string
          count: number
          created_at: string
          custom_value: Json | null
          description: string | null
          id: string
          item_id: string | null
          item_type: string
          monthly_fee: number
          name: string
          updated_at: string
          warehouse_item_id: string | null
        }
        Insert: {
          category?: string
          company_cost?: number
          contract_id: string
          count?: number
          created_at?: string
          custom_value?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          item_type?: string
          monthly_fee?: number
          name: string
          updated_at?: string
          warehouse_item_id?: string | null
        }
        Update: {
          category?: string
          company_cost?: number
          contract_id?: string
          count?: number
          created_at?: string
          custom_value?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          item_type?: string
          monthly_fee?: number
          name?: string
          updated_at?: string
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_items_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_items_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_statuses: {
        Row: {
          category: string
          color: string
          created_at: string
          description: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_active: boolean
          is_system: boolean
          label: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          description?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_active?: boolean
          is_system?: boolean
          label: string
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          description?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_active?: boolean
          is_system?: boolean
          label?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          admin_approved_at: string | null
          admin_approved_by: string | null
          contract_generated_at: string | null
          contract_number: string
          created_at: string
          created_by: string | null
          current_step: number | null
          document_signed_at: string | null
          document_uploaded_at: string | null
          document_url: string | null
          documents_generated_at: string | null
          documents_signed_at: string | null
          email_viewed_at: string | null
          id: string
          lost_notes: string | null
          lost_reason: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id: string | null
          notes: string | null
          signature_date: string | null
          signature_ip: string | null
          signature_url: string | null
          signed_at: string | null
          signed_document_url: string | null
          source: Database["public"]["Enums"]["contract_source"] | null
          status: Database["public"]["Enums"]["contract_status"]
          submitted_at: string | null
          updated_at: string
          visited_steps: Json | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          contract_generated_at?: string | null
          contract_number?: string
          created_at?: string
          created_by?: string | null
          current_step?: number | null
          document_signed_at?: string | null
          document_uploaded_at?: string | null
          document_url?: string | null
          documents_generated_at?: string | null
          documents_signed_at?: string | null
          email_viewed_at?: string | null
          id?: string
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id?: string | null
          notes?: string | null
          signature_date?: string | null
          signature_ip?: string | null
          signature_url?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          source?: Database["public"]["Enums"]["contract_source"] | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
          visited_steps?: Json | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          contract_generated_at?: string | null
          contract_number?: string
          created_at?: string
          created_by?: string | null
          current_step?: number | null
          document_signed_at?: string | null
          document_uploaded_at?: string | null
          document_url?: string | null
          documents_generated_at?: string | null
          documents_signed_at?: string | null
          email_viewed_at?: string | null
          id?: string
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id?: string | null
          notes?: string | null
          signature_date?: string | null
          signature_ip?: string | null
          signature_url?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          source?: Database["public"]["Enums"]["contract_source"] | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
          visited_steps?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracts_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_definitions: {
        Row: {
          category_id: string | null
          created_at: string
          default_value: string | null
          display_order: number
          field_key: string
          field_name: string
          field_options: Json | null
          field_type: string
          help_text: string | null
          id: string
          is_active: boolean
          is_required: boolean
          is_template: boolean
          item_type_id: string | null
          updated_at: string
          validation_rules: Json | null
          warehouse_item_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          default_value?: string | null
          display_order?: number
          field_key: string
          field_name: string
          field_options?: Json | null
          field_type: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          is_template?: boolean
          item_type_id?: string | null
          updated_at?: string
          validation_rules?: Json | null
          warehouse_item_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          default_value?: string | null
          display_order?: number
          field_key?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          is_template?: boolean
          item_type_id?: string | null
          updated_at?: string
          validation_rules?: Json | null
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_definitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_field_definitions_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_field_definitions_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          dic: string | null
          email: string | null
          ico: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dic?: string | null
          email?: string | null
          ico?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dic?: string | null
          email?: string | null
          ico?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      device_selection: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          mif_regulated_cards: number
          mif_unregulated_cards: number
          note: string | null
          transaction_types: Json
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          mif_regulated_cards?: number
          mif_unregulated_cards?: number
          note?: string | null
          transaction_types?: Json
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          mif_regulated_cards?: number
          mif_unregulated_cards?: number
          note?: string | null
          transaction_types?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_selection_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          contract_id: string | null
          created_at: string
          error_message: string
          error_type: string
          id: string
          resolved: boolean
          session_id: string | null
          stack_trace: string | null
          step_number: number | null
          user_agent: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          error_message: string
          error_type: string
          id?: string
          resolved?: boolean
          session_id?: string | null
          stack_trace?: string | null
          step_number?: number | null
          user_agent?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          error_message?: string
          error_type?: string
          id?: string
          resolved?: boolean
          session_id?: string | null
          stack_trace?: string | null
          step_number?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      item_types: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon_name: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      kanban_columns: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          position: number
          statuses: string[]
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          statuses?: string[]
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          statuses?: string[]
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      location_assignments: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          location_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          location_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_assignments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address_city: string | null
          address_street: string | null
          address_zip_code: string | null
          company_name: string
          contact_person_email: string
          contact_person_name: string
          contact_person_phone: string | null
          created_at: string
          dic: string | null
          ico: string | null
          id: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address_city?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          company_name: string
          contact_person_email: string
          contact_person_name: string
          contact_person_phone?: string | null
          created_at?: string
          dic?: string | null
          ico?: string | null
          id?: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address_city?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          company_name?: string
          contact_person_email?: string
          contact_person_name?: string
          contact_person_phone?: string | null
          created_at?: string
          dic?: string | null
          ico?: string | null
          id?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          is_read: boolean
          message: string
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          related_entity_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          is_read?: boolean
          message: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          related_entity_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          is_read?: boolean
          message?: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          related_entity_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_configurations: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_fields: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_options: Json | null
          field_type: string
          id: string
          is_enabled: boolean
          is_required: boolean
          position: number
          step_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_enabled?: boolean
          is_required?: boolean
          position?: number
          step_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_enabled?: boolean
          is_required?: boolean
          position?: number
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_fields_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "onboarding_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          configuration_id: string
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          position: number
          step_key: string
          title: string
          updated_at: string
        }
        Insert: {
          configuration_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          position?: number
          step_key: string
          title: string
          updated_at?: string
        }
        Update: {
          configuration_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          position?: number
          step_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "onboarding_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_addons: {
        Row: {
          addon_product_id: string
          created_at: string
          display_order: number
          id: string
          is_default_selected: boolean
          is_required: boolean
          parent_product_id: string
          updated_at: string
        }
        Insert: {
          addon_product_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_default_selected?: boolean
          is_required?: boolean
          parent_product_id: string
          updated_at?: string
        }
        Update: {
          addon_product_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_default_selected?: boolean
          is_required?: boolean
          parent_product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_addons_addon"
            columns: ["addon_product_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_product_addons_parent"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addons_addon_product_id_fkey"
            columns: ["addon_product_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addons_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          organization_id: string | null
          phone: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean
          last_name: string
          organization_id?: string | null
          phone?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_sale_items: {
        Row: {
          created_at: string
          id: string
          item_description: string | null
          item_name: string
          line_total: number
          quantity: number
          quick_sale_id: string
          unit_price: number
          updated_at: string
          vat_rate: number
          warehouse_item_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_description?: string | null
          item_name: string
          line_total?: number
          quantity?: number
          quick_sale_id: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
          warehouse_item_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_description?: string | null
          item_name?: string
          line_total?: number
          quantity?: number
          quick_sale_id?: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_sale_items_quick_sale_id_fkey"
            columns: ["quick_sale_id"]
            isOneToOne: false
            referencedRelation: "quick_sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quick_sale_items_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_sales: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          notes: string | null
          sale_date: string
          sale_number: string
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          vat_amount: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          notes?: string | null
          sale_date?: string
          sale_number?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          notes?: string | null
          sale_date?: string
          sale_number?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "quick_sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      shareable_onboarding_links: {
        Row: {
          configuration_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          configuration_id: string
          created_at?: string
          expires_at?: string | null
          id: string
          is_active?: boolean
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          configuration_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "shareable_onboarding_links_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "onboarding_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_featured: boolean
          position: number
          solution_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_featured?: boolean
          position?: number
          solution_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          position?: number
          solution_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solution_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_categories_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_items: {
        Row: {
          category_filters: string[] | null
          category_id: string | null
          created_at: string
          id: string
          is_featured: boolean
          item_type_filters: string[] | null
          position: number
          solution_id: string
          updated_at: string
          warehouse_item_id: string
        }
        Insert: {
          category_filters?: string[] | null
          category_id?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          item_type_filters?: string[] | null
          position?: number
          solution_id: string
          updated_at?: string
          warehouse_item_id: string
        }
        Update: {
          category_filters?: string[] | null
          category_id?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          item_type_filters?: string[] | null
          position?: number
          solution_id?: string
          updated_at?: string
          warehouse_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solution_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_items_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_items_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          icon_name: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          position: number
          subtitle: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          position?: number
          subtitle?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          subtitle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      step_analytics: {
        Row: {
          completed_at: string | null
          contract_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          session_id: string | null
          started_at: string
          step_name: string
          step_number: number
          user_agent: string | null
        }
        Insert: {
          completed_at?: string | null
          contract_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          session_id?: string | null
          started_at?: string
          step_name: string
          step_number: number
          user_agent?: string | null
        }
        Update: {
          completed_at?: string | null
          contract_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          session_id?: string | null
          started_at?: string
          step_name?: string
          step_number?: number
          user_agent?: string | null
        }
        Relationships: []
      }
      step_modules: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          module_key: string
          module_name: string
          position: number
          step_id: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_key: string
          module_name: string
          position?: number
          step_id: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          module_key?: string
          module_name?: string
          position?: number
          step_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          team_leader_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          team_leader_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          team_leader_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_auto_translated: boolean | null
          is_system: boolean
          key: string
          language: string
          last_modified_by: string | null
          metadata: Json | null
          namespace: string
          updated_at: string
          value: string
          version: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_auto_translated?: boolean | null
          is_system?: boolean
          key: string
          language: string
          last_modified_by?: string | null
          metadata?: Json | null
          namespace: string
          updated_at?: string
          value: string
          version?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_auto_translated?: boolean | null
          is_system?: boolean
          key?: string
          language?: string
          last_modified_by?: string | null
          metadata?: Json | null
          namespace?: string
          updated_at?: string
          value?: string
          version?: number | null
        }
        Relationships: []
      }
      user_kanban_preferences: {
        Row: {
          auto_refresh: boolean
          card_compact_mode: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string
          view_mode: string
        }
        Insert: {
          auto_refresh?: boolean
          card_compact_mode?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          view_mode?: string
        }
        Update: {
          auto_refresh?: boolean
          card_compact_mode?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          view_mode?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          session_token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          session_token: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      warehouse_items: {
        Row: {
          category: string
          category_id: string | null
          company_cost: number
          created_at: string
          created_by: string | null
          current_stock: number | null
          custom_fields: Json | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          item_type: string
          item_type_id: string | null
          min_stock: number | null
          monthly_fee: number
          name: string
          setup_fee: number
          specifications: Json | null
          updated_at: string
        }
        Insert: {
          category?: string
          category_id?: string | null
          company_cost?: number
          created_at?: string
          created_by?: string | null
          current_stock?: number | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          item_type?: string
          item_type_id?: string | null
          min_stock?: number | null
          monthly_fee?: number
          name: string
          setup_fee?: number
          specifications?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          category_id?: string | null
          company_cost?: number
          created_at?: string
          created_by?: string | null
          current_stock?: number | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          item_type?: string
          item_type_id?: string | null
          min_stock?: number | null
          monthly_fee?: number
          name?: string
          setup_fee?: number
          specifications?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_items_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partner" | "merchant"
      contract_source:
        | "telesales"
        | "facebook"
        | "web"
        | "email"
        | "referral"
        | "other"
      contract_status:
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
        | "in_progress"
        | "sent_to_client"
        | "email_viewed"
        | "step_completed"
        | "contract_generated"
        | "signed"
        | "waiting_for_signature"
        | "lost"
        | "pending_approval"
        | "request_draft"
      document_type: "OP" | "Pas"
      entity_type:
        | "contracts"
        | "merchants"
        | "organizations"
        | "users"
        | "teams"
      lost_reason:
        | "no_response"
        | "price_too_high"
        | "competitor_chosen"
        | "not_interested"
        | "technical_issues"
        | "other"
      notification_priority: "low" | "medium" | "high" | "critical"
      notification_type:
        | "contract_created"
        | "contract_status_changed"
        | "merchant_registered"
        | "error_occurred"
        | "system_alert"
      registry_type: "public" | "business" | "other"
      salutation_type: "Pan" | "Pani"
      seasonality_type: "year-round" | "seasonal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partner", "merchant"],
      contract_source: [
        "telesales",
        "facebook",
        "web",
        "email",
        "referral",
        "other",
      ],
      contract_status: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "in_progress",
        "sent_to_client",
        "email_viewed",
        "step_completed",
        "contract_generated",
        "signed",
        "waiting_for_signature",
        "lost",
        "pending_approval",
        "request_draft",
      ],
      document_type: ["OP", "Pas"],
      entity_type: [
        "contracts",
        "merchants",
        "organizations",
        "users",
        "teams",
      ],
      lost_reason: [
        "no_response",
        "price_too_high",
        "competitor_chosen",
        "not_interested",
        "technical_issues",
        "other",
      ],
      notification_priority: ["low", "medium", "high", "critical"],
      notification_type: [
        "contract_created",
        "contract_status_changed",
        "merchant_registered",
        "error_occurred",
        "system_alert",
      ],
      registry_type: ["public", "business", "other"],
      salutation_type: ["Pan", "Pani"],
      seasonality_type: ["year-round", "seasonal"],
    },
  },
} as const
