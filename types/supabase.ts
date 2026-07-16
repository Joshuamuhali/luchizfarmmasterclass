export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: number
          user_id: string
          full_name: string
          phone: string
          email: string
          nrc: string | null
          transaction_reference: string
          payment_method: string
          amount: number
          status: RegistrationStatus
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          full_name: string
          phone: string
          email: string
          nrc?: string | null
          transaction_reference: string
          payment_method: string
          amount: number
          status?: RegistrationStatus
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          full_name?: string
          phone?: string
          email?: string
          nrc?: string | null
          transaction_reference?: string
          payment_method?: string
          amount?: number
          status?: RegistrationStatus
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pdf_downloads: {
        Row: {
          id: number
          registration_id: number
          user_id: string
          file_name: string
          downloaded_at: string
        }
        Insert: {
          id?: number
          registration_id: number
          user_id: string
          file_name: string
          downloaded_at?: string
        }
        Update: {
          id?: number
          registration_id?: number
          user_id?: string
          file_name?: string
          downloaded_at?: string
        }
      }
      announcements: {
        Row: {
          id: number
          title: string
          message: string
          publish_date: string
          expiry_date: string | null
          is_active: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          message: string
          publish_date: string
          expiry_date?: string | null
          is_active?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          message?: string
          publish_date?: string
          expiry_date?: string | null
          is_active?: boolean
          created_by?: string
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: number
          masterclass_title: string
          masterclass_date: string
          masterclass_time: string
          whatsapp_link: string
          price: number
          max_seats: number
          airtel_money_number: string
          account_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          masterclass_title: string
          masterclass_date: string
          masterclass_time: string
          whatsapp_link: string
          price: number
          max_seats: number
          airtel_money_number: string
          account_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          masterclass_title?: string
          masterclass_date?: string
          masterclass_time?: string
          whatsapp_link?: string
          price?: number
          max_seats?: number
          airtel_money_number?: string
          account_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: number
          admin_id: string
          admin_email: string
          action: string
          target_type: string
          target_id: number | null
          target_name: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: number
          admin_id: string
          admin_email: string
          action: string
          target_type: string
          target_id?: number | null
          target_name?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          admin_id?: string
          admin_email?: string
          action?: string
          target_type?: string
          target_id?: number | null
          target_name?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      get_user_registration: {
        Args: {
          user_id: string
        }
        Returns: {
          id: number
          user_id: string
          full_name: string
          phone: string
          email: string
          transaction_reference: string
          status: RegistrationStatus
          created_at: string
        } | null
      }
      is_user_approved: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
  }
}