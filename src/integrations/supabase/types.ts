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
          contract_id: string | null
          created_at: string
          first_name: string
          id: string
          is_politically_exposed: boolean | null
          last_name: string
          maiden_name: string | null
          owner_id: string
          permanent_address: string
        }
        Insert: {
          birth_date: string
          birth_number: string
          birth_place: string
          citizenship: string
          contract_id?: string | null
          created_at?: string
          first_name: string
          id?: string
          is_politically_exposed?: boolean | null
          last_name: string
          maiden_name?: string | null
          owner_id: string
          permanent_address: string
        }
        Update: {
          birth_date?: string
          birth_number?: string
          birth_place?: string
          citizenship?: string
          contract_id?: string | null
          created_at?: string
          first_name?: string
          id?: string
          is_politically_exposed?: boolean | null
          last_name?: string
          maiden_name?: string | null
          owner_id?: string
          permanent_address?: string
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
          contract_id: string | null
          created_at: string
          document_country: string
          document_issuer: string
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_validity: string
          email: string
          first_name: string
          id: string
          is_politically_exposed: boolean | null
          is_us_citizen: boolean | null
          last_name: string
          maiden_name: string | null
          permanent_address: string
          person_id: string
          phone: string
          position: string
        }
        Insert: {
          birth_date: string
          birth_number: string
          birth_place: string
          citizenship: string
          contract_id?: string | null
          created_at?: string
          document_country: string
          document_issuer: string
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_validity: string
          email: string
          first_name: string
          id?: string
          is_politically_exposed?: boolean | null
          is_us_citizen?: boolean | null
          last_name: string
          maiden_name?: string | null
          permanent_address: string
          person_id: string
          phone: string
          position: string
        }
        Update: {
          birth_date?: string
          birth_number?: string
          birth_place?: string
          citizenship?: string
          contract_id?: string | null
          created_at?: string
          document_country?: string
          document_issuer?: string
          document_number?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_validity?: string
          email?: string
          first_name?: string
          id?: string
          is_politically_exposed?: boolean | null
          is_us_citizen?: boolean | null
          last_name?: string
          maiden_name?: string | null
          permanent_address?: string
          person_id?: string
          phone?: string
          position?: string
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
          contract_id: string | null
          created_at: string
          estimated_turnover: number
          has_pos: boolean | null
          iban: string
          id: string
          location_id: string
          name: string
          opening_hours: string
          seasonal_weeks: number | null
          seasonality: Database["public"]["Enums"]["seasonality"]
        }
        Insert: {
          address_city: string
          address_street: string
          address_zip_code: string
          average_transaction: number
          business_sector: string
          contact_person_email: string
          contact_person_name: string
          contact_person_phone: string
          contract_id?: string | null
          created_at?: string
          estimated_turnover: number
          has_pos?: boolean | null
          iban: string
          id?: string
          location_id: string
          name: string
          opening_hours: string
          seasonal_weeks?: number | null
          seasonality?: Database["public"]["Enums"]["seasonality"]
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
          contract_id?: string | null
          created_at?: string
          estimated_turnover?: number
          has_pos?: boolean | null
          iban?: string
          id?: string
          location_id?: string
          name?: string
          opening_hours?: string
          seasonal_weeks?: number | null
          seasonality?: Database["public"]["Enums"]["seasonality"]
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
          contact_address_same_as_main: boolean | null
          contact_address_street: string | null
          contact_address_zip_code: string | null
          contact_person_email: string
          contact_person_first_name: string
          contact_person_is_technical: boolean | null
          contact_person_last_name: string
          contact_person_name: string
          contact_person_phone: string
          contract_id: string | null
          court: string | null
          created_at: string
          dic: string
          ico: string
          id: string
          insert_number: string | null
          is_vat_payer: boolean | null
          registry_type: Database["public"]["Enums"]["registry_type"]
          section: string | null
          vat_number: string | null
        }
        Insert: {
          address_city: string
          address_street: string
          address_zip_code: string
          company_name: string
          contact_address_city?: string | null
          contact_address_same_as_main?: boolean | null
          contact_address_street?: string | null
          contact_address_zip_code?: string | null
          contact_person_email: string
          contact_person_first_name: string
          contact_person_is_technical?: boolean | null
          contact_person_last_name: string
          contact_person_name: string
          contact_person_phone: string
          contract_id?: string | null
          court?: string | null
          created_at?: string
          dic: string
          ico: string
          id?: string
          insert_number?: string | null
          is_vat_payer?: boolean | null
          registry_type: Database["public"]["Enums"]["registry_type"]
          section?: string | null
          vat_number?: string | null
        }
        Update: {
          address_city?: string
          address_street?: string
          address_zip_code?: string
          company_name?: string
          contact_address_city?: string | null
          contact_address_same_as_main?: boolean | null
          contact_address_street?: string | null
          contact_address_zip_code?: string | null
          contact_person_email?: string
          contact_person_first_name?: string
          contact_person_is_technical?: boolean | null
          contact_person_last_name?: string
          contact_person_name?: string
          contact_person_phone?: string
          contract_id?: string | null
          court?: string | null
          created_at?: string
          dic?: string
          ico?: string
          id?: string
          insert_number?: string | null
          is_vat_payer?: boolean | null
          registry_type?: Database["public"]["Enums"]["registry_type"]
          section?: string | null
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
          contract_id: string | null
          created_at: string
          electronic_communication_consent: boolean | null
          gdpr_consent: boolean | null
          id: string
          signature_date: string | null
          signing_person_id: string | null
          terms_consent: boolean | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          electronic_communication_consent?: boolean | null
          gdpr_consent?: boolean | null
          id?: string
          signature_date?: string | null
          signing_person_id?: string | null
          terms_consent?: boolean | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          electronic_communication_consent?: boolean | null
          gdpr_consent?: boolean | null
          id?: string
          signature_date?: string | null
          signing_person_id?: string | null
          terms_consent?: boolean | null
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
          contract_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          phone_prefix: string
          sales_note: string | null
          salutation: Database["public"]["Enums"]["salutation"] | null
          user_role: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          phone_prefix?: string
          sales_note?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          user_role?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          phone_prefix?: string
          sales_note?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
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
          contract_id: string | null
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
          contract_id?: string | null
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
          contract_id?: string | null
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
          contract_item_id: string | null
          created_at: string
          description: string | null
          id: string
          is_per_device: boolean
          monthly_fee: number
          name: string
          quantity: number
        }
        Insert: {
          addon_id: string
          category: string
          company_cost?: number
          contract_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_per_device?: boolean
          monthly_fee?: number
          name: string
          quantity?: number
        }
        Update: {
          addon_id?: string
          category?: string
          company_cost?: number
          contract_item_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_per_device?: boolean
          monthly_fee?: number
          name?: string
          quantity?: number
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
          contract_id: string | null
          count: number
          created_at: string
          custom_value: string | null
          description: string | null
          id: string
          item_id: string
          item_type: string
          monthly_fee: number
          name: string
        }
        Insert: {
          category: string
          company_cost?: number
          contract_id?: string | null
          count?: number
          created_at?: string
          custom_value?: string | null
          description?: string | null
          id?: string
          item_id: string
          item_type: string
          monthly_fee?: number
          name: string
        }
        Update: {
          category?: string
          company_cost?: number
          contract_id?: string | null
          count?: number
          created_at?: string
          custom_value?: string | null
          description?: string | null
          id?: string
          item_id?: string
          item_type?: string
          monthly_fee?: number
          name?: string
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
          contract_number: number
          created_at: string
          id: string
          notes: string | null
          signature_ip: string | null
          signed_at: string | null
          signed_by: string | null
          status: Database["public"]["Enums"]["contract_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          contract_number?: number
          created_at?: string
          id?: string
          notes?: string | null
          signature_ip?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          contract_number?: number
          created_at?: string
          id?: string
          notes?: string | null
          signature_ip?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      device_selection: {
        Row: {
          accessories: string[] | null
          contract_id: string | null
          created_at: string
          ecommerce: string[] | null
          id: string
          mif_dcc_rabat: number | null
          mif_regulated_cards: number | null
          mif_unregulated_cards: number | null
          note: string | null
          pax_a80_count: number | null
          pax_a80_monthly_fee: number | null
          pax_a920_pro_count: number | null
          pax_a920_pro_monthly_fee: number | null
          pax_a920_pro_sim_cards: number | null
          software_licenses: string[] | null
          tablet_10_count: number | null
          tablet_10_monthly_fee: number | null
          tablet_15_count: number | null
          tablet_15_monthly_fee: number | null
          tablet_pro_15_count: number | null
          tablet_pro_15_monthly_fee: number | null
          technical_service: string[] | null
          transaction_types: string[] | null
        }
        Insert: {
          accessories?: string[] | null
          contract_id?: string | null
          created_at?: string
          ecommerce?: string[] | null
          id?: string
          mif_dcc_rabat?: number | null
          mif_regulated_cards?: number | null
          mif_unregulated_cards?: number | null
          note?: string | null
          pax_a80_count?: number | null
          pax_a80_monthly_fee?: number | null
          pax_a920_pro_count?: number | null
          pax_a920_pro_monthly_fee?: number | null
          pax_a920_pro_sim_cards?: number | null
          software_licenses?: string[] | null
          tablet_10_count?: number | null
          tablet_10_monthly_fee?: number | null
          tablet_15_count?: number | null
          tablet_15_monthly_fee?: number | null
          tablet_pro_15_count?: number | null
          tablet_pro_15_monthly_fee?: number | null
          technical_service?: string[] | null
          transaction_types?: string[] | null
        }
        Update: {
          accessories?: string[] | null
          contract_id?: string | null
          created_at?: string
          ecommerce?: string[] | null
          id?: string
          mif_dcc_rabat?: number | null
          mif_regulated_cards?: number | null
          mif_unregulated_cards?: number | null
          note?: string | null
          pax_a80_count?: number | null
          pax_a80_monthly_fee?: number | null
          pax_a920_pro_count?: number | null
          pax_a920_pro_monthly_fee?: number | null
          pax_a920_pro_sim_cards?: number | null
          software_licenses?: string[] | null
          tablet_10_count?: number | null
          tablet_10_monthly_fee?: number | null
          tablet_15_count?: number | null
          tablet_15_monthly_fee?: number | null
          tablet_pro_15_count?: number | null
          tablet_pro_15_monthly_fee?: number | null
          technical_service?: string[] | null
          transaction_types?: string[] | null
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
          contract_id: string | null
          created_at: string
          id: string
          location_id: string
          person_id: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string
          id?: string
          location_id: string
          person_id: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string
          id?: string
          location_id?: string
          person_id?: string
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
      onboarding_audit: {
        Row: {
          contract_id: string | null
          created_at: string | null
          data_after: Json | null
          data_before: Json | null
          id: string
          step_name: string
          user_action: string
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          data_after?: Json | null
          data_before?: Json | null
          id?: string
          step_name: string
          user_action: string
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          data_after?: Json | null
          data_before?: Json | null
          id?: string
          step_name?: string
          user_action?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_audit_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_user_id: string | null
          contract_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          contract_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contract_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "approved"
        | "rejected"
        | "completed"
        | "signed"
      document_type: "OP" | "Pas"
      registry_type: "public" | "business" | "other"
      salutation: "Pan" | "Pani"
      seasonality: "year-round" | "seasonal"
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
      contract_status: [
        "draft",
        "submitted",
        "in_review",
        "approved",
        "rejected",
        "completed",
        "signed",
      ],
      document_type: ["OP", "Pas"],
      registry_type: ["public", "business", "other"],
      salutation: ["Pan", "Pani"],
      seasonality: ["year-round", "seasonal"],
    },
  },
} as const
