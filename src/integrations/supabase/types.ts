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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_rates: {
        Row: {
          created_at: string
          currency: string | null
          hotel_id: string
          id: string
          rate: number
          rate_date: string
          room_type_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          hotel_id: string
          id?: string
          rate: number
          rate_date: string
          room_type_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          hotel_id?: string
          id?: string
          rate?: number
          rate_date?: string
          room_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_rates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      folio_items: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          currency: string | null
          description: string
          id: string
          item_date: string
          reservation_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          currency?: string | null
          description: string
          id?: string
          item_date?: string
          reservation_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          id?: string
          item_date?: string
          reservation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folio_items_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      fx_rates: {
        Row: {
          created_at: string | null
          eur_to_try: number
          eur_to_usd: number
          rate_date: string
        }
        Insert: {
          created_at?: string | null
          eur_to_try?: number
          eur_to_usd?: number
          rate_date: string
        }
        Update: {
          created_at?: string | null
          eur_to_try?: number
          eur_to_usd?: number
          rate_date?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string
          guest_type: Database["public"]["Enums"]["guest_type"] | null
          hotel_id: string
          id: string
          id_number: string | null
          last_name: string
          nationality: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          vip: boolean | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          guest_type?: Database["public"]["Enums"]["guest_type"] | null
          hotel_id: string
          id?: string
          id_number?: string | null
          last_name: string
          nationality?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vip?: boolean | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          guest_type?: Database["public"]["Enums"]["guest_type"] | null
          hotel_id?: string
          id?: string
          id_number?: string | null
          last_name?: string
          nationality?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vip?: boolean | null
        }
        Relationships: []
      }
      hotels: {
        Row: {
          brand_color: string | null
          city: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          brand_color?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          brand_color?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      housekeeping: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          hotel_id: string
          id: string
          notes: string | null
          room_id: string | null
          status: Database["public"]["Enums"]["room_status"] | null
          task_date: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          hotel_id: string
          id?: string
          notes?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["room_status"] | null
          task_date?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          hotel_id?: string
          id?: string
          notes?: string | null
          room_id?: string | null
          status?: Database["public"]["Enums"]["room_status"] | null
          task_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "housekeeping_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_stats: {
        Row: {
          adr_eur: number | null
          created_at: string | null
          hotel_id: string | null
          id: string
          month_start: string
          strongest_channel: string | null
          total_bookings: number | null
          total_revenue_eur: number | null
          updated_at: string | null
        }
        Insert: {
          adr_eur?: number | null
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          month_start: string
          strongest_channel?: string | null
          total_bookings?: number | null
          total_revenue_eur?: number | null
          updated_at?: string | null
        }
        Update: {
          adr_eur?: number | null
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          month_start?: string
          strongest_channel?: string | null
          total_bookings?: number | null
          total_revenue_eur?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_stats_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          reservation_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          adults: number
          arrival_time: string | null
          channel: Database["public"]["Enums"]["booking_channel"] | null
          check_in_date: string
          check_out_date: string
          children: number | null
          commission_rate: number | null
          confirmation_number: string
          created_at: string
          created_by: string | null
          currency: string | null
          guest_id: string | null
          hotel_id: string
          id: string
          paid_amount: number | null
          room_id: string | null
          room_type_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["reservation_status"] | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          adults?: number
          arrival_time?: string | null
          channel?: Database["public"]["Enums"]["booking_channel"] | null
          check_in_date: string
          check_out_date: string
          children?: number | null
          commission_rate?: number | null
          confirmation_number: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          guest_id?: string | null
          hotel_id: string
          id?: string
          paid_amount?: number | null
          room_id?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"] | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          adults?: number
          arrival_time?: string | null
          channel?: Database["public"]["Enums"]["booking_channel"] | null
          check_in_date?: string
          check_out_date?: string
          children?: number | null
          commission_rate?: number | null
          confirmation_number?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          guest_id?: string | null
          hotel_id?: string
          id?: string
          paid_amount?: number | null
          room_id?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"] | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: string[] | null
          base_rate: number
          created_at: string
          description: string | null
          id: string
          max_occupancy: number
          name: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          base_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          max_occupancy?: number
          name: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          base_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          max_occupancy?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          floor: number | null
          hotel_id: string
          id: string
          notes: string | null
          room_number: string
          room_type_id: string | null
          status: Database["public"]["Enums"]["room_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor?: number | null
          hotel_id: string
          id?: string
          notes?: string | null
          room_number: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor?: number | null
          hotel_id?: string
          id?: string
          notes?: string | null
          room_number?: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hotels: {
        Row: {
          created_at: string | null
          hotel_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hotel_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          hotel_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_hotels_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_room_availability: {
        Args: {
          p_hotel_id: string
          p_room_id: string
          p_check_in: string
          p_check_out: string
          p_exclude_reservation?: string
        }
        Returns: boolean
      }
      generate_confirmation_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      booking_channel:
        | "direct"
        | "booking_com"
        | "expedia"
        | "airbnb"
        | "walk_in"
        | "phone"
      guest_type: "individual" | "group" | "corporate"
      payment_status: "pending" | "paid" | "partial" | "refunded"
      reservation_status:
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
        | "no_show"
      room_status:
        | "available"
        | "occupied"
        | "out_of_order"
        | "maintenance"
        | "dirty"
        | "clean"
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
      booking_channel: [
        "direct",
        "booking_com",
        "expedia",
        "airbnb",
        "walk_in",
        "phone",
      ],
      guest_type: ["individual", "group", "corporate"],
      payment_status: ["pending", "paid", "partial", "refunded"],
      reservation_status: [
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
      ],
      room_status: [
        "available",
        "occupied",
        "out_of_order",
        "maintenance",
        "dirty",
        "clean",
      ],
    },
  },
} as const
