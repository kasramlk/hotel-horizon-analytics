import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Hotel {
  id: string;
  name: string;
  city: string;
  brand_color: string;
}

export interface MonthlyStats {
  id: string;
  hotel_id: string;
  month_start: string;
  total_bookings: number;
  total_revenue_eur: number;
  adr_eur: number;
  strongest_channel: string;
}

export interface FxRate {
  rate_date: string;
  eur_to_usd: number;
  eur_to_try: number;
}

export function useHotels() {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('hotels')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Hotel[];
    }
  });
}

export function useMonths(hotelId?: string) {
  return useQuery({
    queryKey: ['months', hotelId],
    queryFn: async () => {
      if (!hotelId) return [];
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('month_start')
        .eq('hotel_id', hotelId)
        .order('month_start', { ascending: false });
      
      if (error) throw error;
      return data.map((item: any) => item.month_start);
    },
    enabled: !!hotelId
  });
}

export function useFxRate(month?: string) {
  return useQuery({
    queryKey: ['fx-rate', month],
    queryFn: async () => {
      if (!month) return null;
      
      // Get last day of month for fx rate lookup
      const date = new Date(month + '-01');
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const rateDate = lastDay.toISOString().split('T')[0];
      
      const { data, error } = await (supabase as any)
        .from('fx_rates')
        .select('*')
        .eq('rate_date', rateDate)
        .maybeSingle();
      
      if (error) throw error;
      return data as FxRate | null;
    },
    enabled: !!month
  });
}

export function useStats(hotelId?: string, month?: string, currency: 'eur' | 'usd' | 'try' = 'eur') {
  const { data: fxRate } = useFxRate(month);
  
  return useQuery({
    queryKey: ['stats', hotelId, month, currency],
    queryFn: async () => {
      if (!hotelId || !month) return null;
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('month_start', month + '-01')
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Convert currency
      let multiplier = 1;
      if (currency === 'usd' && fxRate?.eur_to_usd) {
        multiplier = fxRate.eur_to_usd;
      } else if (currency === 'try' && fxRate?.eur_to_try) {
        multiplier = fxRate.eur_to_try;
      }
      
      const stats = data as any;
      return {
        ...stats,
        total_revenue: stats.total_revenue_eur * multiplier,
        adr: stats.adr_eur * multiplier
      };
    },
    enabled: !!hotelId && !!month
  });
}