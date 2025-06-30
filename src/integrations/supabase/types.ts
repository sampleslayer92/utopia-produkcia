export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      contract_item_addons: {
        Row: {
          addon_id: string
          category: string
          company_cost: number
          contract_item_id: string
          created_at: string
          description: string | null
          id: string
          is_per_device: boolean
          monthly_fee: number
          name: string
          quantity: number
          updated_at: string
        }
        Insert: {
          addon_id: string
          category?: string
          company_cost?: number
          contract_item_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_per_device?: boolean
          monthly_fee?: number
          name: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          addon_id?: string
          category?: string
          company_cost?: number
          contract_item_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_per_device?: boolean
          monthly_fee?: number
          name?: string
          quantity?: number
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
          item_id: string
          item_type: string
          monthly_fee: number
          name: string
          updated_at: string
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
          item_id: string
          item_type?: string
          monthly_fee?: number
          name: string
          updated_at?: string
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
          item_id?: string
          item_type?: string
          monthly_fee?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_items_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          contract_generated_at: string | null
          contract_number: string
          created_at: string
          current_step: number | null
          email_viewed_at: string | null
          id: string
          lost_notes: string | null
          lost_reason: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id: string | null
          notes: string | null
          signed_at: string | null
          source: Database["public"]["Enums"]["contract_source"] | null
          status: Database["public"]["Enums"]["contract_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          contract_generated_at?: string | null
          contract_number?: string
          created_at?: string
          current_step?: number | null
          email_viewed_at?: string | null
          id?: string
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id?: string | null
          notes?: string | null
          signed_at?: string | null
          source?: Database["public"]["Enums"]["contract_source"] | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          contract_generated_at?: string | null
          contract_number?: string
          created_at?: string
          current_step?: number | null
          email_viewed_at?: string | null
          id?: string
          lost_notes?: string | null
          lost_reason?: Database["public"]["Enums"]["lost_reason"] | null
          merchant_id?: string | null
          notes?: string | null
          signed_at?: string | null
          source?: Database["public"]["Enums"]["contract_source"] | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
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
      document_type: "OP" | "Pas"
      lost_reason:
        | "no_response"
        | "price_too_high"
        | "competitor_chosen"
        | "not_interested"
        | "technical_issues"
        | "other"
      registry_type: "public" | "business" | "other"
      salutation_type: "Pan" | "Pani"
      seasonality_type: "year-round" | "seasonal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
      ],
      document_type: ["OP", "Pas"],
      lost_reason: [
        "no_response",
        "price_too_high",
        "competitor_chosen",
        "not_interested",
        "technical_issues",
        "other",
      ],
      registry_type: ["public", "business", "other"],
      salutation_type: ["Pan", "Pani"],
      seasonality_type: ["year-round", "seasonal"],
    },
  },
} as const
