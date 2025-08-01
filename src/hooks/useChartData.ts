import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useFxRate } from './useHotelData';

export function useChartData(hotelId?: string, month?: string) {
  const { currency } = useCurrency();
  const { data: fxRate } = useFxRate(month);

  // Monthly revenue trend
  const monthlyRevenueQuery = useQuery({
    queryKey: ['monthly-revenue', hotelId, currency],
    queryFn: async () => {
      if (!hotelId) return null;
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('month_start, total_revenue_eur')
        .eq('hotel_id', hotelId)
        .order('month_start');
      
      if (error) throw error;
      
      let multiplier = 1;
      if (currency === 'usd' && fxRate?.eur_to_usd) {
        multiplier = fxRate.eur_to_usd;
      } else if (currency === 'try' && fxRate?.eur_to_try) {
        multiplier = fxRate.eur_to_try;
      }
      
      return data.map((item: any) => ({
        label: new Date(item.month_start).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        value: item.total_revenue_eur * multiplier
      }));
    },
    enabled: !!hotelId
  });

  // Monthly bookings trend
  const monthlyBookingsQuery = useQuery({
    queryKey: ['monthly-bookings', hotelId],
    queryFn: async () => {
      if (!hotelId) return null;
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('month_start, total_bookings')
        .eq('hotel_id', hotelId)
        .order('month_start');
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        label: new Date(item.month_start).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        value: item.total_bookings
      }));
    },
    enabled: !!hotelId
  });

  // ADR trend
  const adrTrendQuery = useQuery({
    queryKey: ['adr-trend', hotelId, currency],
    queryFn: async () => {
      if (!hotelId) return null;
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('month_start, adr_eur')
        .eq('hotel_id', hotelId)
        .order('month_start');
      
      if (error) throw error;
      
      let multiplier = 1;
      if (currency === 'usd' && fxRate?.eur_to_usd) {
        multiplier = fxRate.eur_to_usd;
      } else if (currency === 'try' && fxRate?.eur_to_try) {
        multiplier = fxRate.eur_to_try;
      }
      
      return data.map((item: any) => ({
        label: new Date(item.month_start).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        value: item.adr_eur * multiplier
      }));
    },
    enabled: !!hotelId
  });

  // Channel distribution (mock data for demo since we don't have detailed channel data)
  const channelDistributionQuery = useQuery({
    queryKey: ['channel-distribution', hotelId, month, currency],
    queryFn: async () => {
      if (!hotelId || !month) return null;
      
      const { data, error } = await (supabase as any)
        .from('monthly_stats')
        .select('strongest_channel, total_revenue_eur')
        .eq('hotel_id', hotelId)
        .eq('month_start', month + '-01')
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      let multiplier = 1;
      if (currency === 'usd' && fxRate?.eur_to_usd) {
        multiplier = fxRate.eur_to_usd;
      } else if (currency === 'try' && fxRate?.eur_to_try) {
        multiplier = fxRate.eur_to_try;
      }
      
      // Mock distribution for demo
      const totalRevenue = data.total_revenue_eur * multiplier;
      const mainChannel = data.strongest_channel;
      
      return [
        { label: mainChannel, value: totalRevenue * 0.4 },
        { label: 'Direct Booking', value: totalRevenue * 0.25 },
        { label: 'Booking.com', value: totalRevenue * 0.2 },
        { label: 'Expedia', value: totalRevenue * 0.1 },
        { label: 'Others', value: totalRevenue * 0.05 }
      ].filter(item => item.label !== mainChannel || item.value > 0);
    },
    enabled: !!hotelId && !!month
  });

  return {
    monthlyRevenue: monthlyRevenueQuery.data,
    monthlyBookings: monthlyBookingsQuery.data,
    adrTrend: adrTrendQuery.data,
    channelDistribution: channelDistributionQuery.data,
    isLoading: monthlyRevenueQuery.isLoading || monthlyBookingsQuery.isLoading || adrTrendQuery.isLoading || channelDistributionQuery.isLoading
  };
}