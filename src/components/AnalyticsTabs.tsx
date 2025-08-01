import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/KPIGrid';
import { ChartComponent } from '@/components/ChartComponent';
import { useStats } from '@/hooks/useHotelData';
import { useChartData } from '@/hooks/useChartData';

interface AnalyticsTabsProps {
  hotelId: string;
  month: string;
}

export function AnalyticsTabs({ hotelId, month }: AnalyticsTabsProps) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { data: stats, isLoading: statsLoading } = useStats(hotelId, month, currency);
  const { 
    monthlyRevenue, 
    monthlyBookings, 
    adrTrend, 
    channelDistribution, 
    isLoading: chartsLoading 
  } = useChartData(hotelId, month);

  // Prepare KPI data for occurred stays
  const occurredKPIs = {
    totalBookings: stats?.total_bookings || 0,
    totalRevenue: stats?.total_revenue || 0,
    adr: stats?.adr || 0,
    strongestChannel: stats?.strongest_channel || 'N/A'
  };

  // Mock future KPIs (since we don't have future booking data)
  const futureKPIs = {
    futureBookings: Math.round((stats?.total_bookings || 0) * 1.15),
    futureRevenue: Math.round((stats?.total_revenue || 0) * 1.08),
    futureADR: Math.round((stats?.adr || 0) * 1.05),
    bookingWindow: '45 days'
  };

  // Chart color schemes
  const brandColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
  const successColor = '#10b981';
  const dangerColor = '#ef4444';

  // Prepare chart data
  const revenueChartData = {
    labels: monthlyRevenue?.map(item => item.label) || [],
    datasets: [{
      label: t('kpi.totalRevenue'),
      data: monthlyRevenue?.map(item => item.value) || [],
      borderColor: brandColors[0],
      backgroundColor: `${brandColors[0]}20`,
      fill: true,
      tension: 0.4
    }]
  };

  const bookingsChartData = {
    labels: monthlyBookings?.map(item => item.label) || [],
    datasets: [{
      label: t('kpi.totalBookings'),
      data: monthlyBookings?.map(item => item.value) || [],
      backgroundColor: successColor,
      borderColor: successColor,
      borderWidth: 1
    }]
  };

  const adrChartData = {
    labels: adrTrend?.map(item => item.label) || [],
    datasets: [{
      label: t('kpi.adr'),
      data: adrTrend?.map(item => item.value) || [],
      borderColor: dangerColor,
      backgroundColor: `${dangerColor}20`,
      fill: true,
      tension: 0.4
    }]
  };

  const channelChartData = {
    labels: channelDistribution?.map(item => item.label) || [],
    datasets: [{
      data: channelDistribution?.map(item => item.value) || [],
      backgroundColor: brandColors,
      borderWidth: 0
    }]
  };

  return (
    <Tabs defaultValue="occurred" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="occurred">
          {t('tabs.occurredStays')}
        </TabsTrigger>
        <TabsTrigger value="future">
          {t('tabs.futureSales')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="occurred" className="space-y-6">
        {/* Occurred Stays KPIs */}
        <KPIGrid data={occurredKPIs} type="occurred" loading={statsLoading} />
        
        {/* Charts for Occurred Stays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartComponent
            type="doughnut"
            data={channelChartData}
            title={t('charts.revenueShareByChannel')}
            loading={chartsLoading}
          />
          <ChartComponent
            type="line"
            data={revenueChartData}
            title={t('charts.monthlyRevenueTrend')}
            loading={chartsLoading}
          />
        </div>
      </TabsContent>

      <TabsContent value="future" className="space-y-6">
        {/* Future Sales KPIs */}
        <KPIGrid data={futureKPIs} type="future" loading={statsLoading} />
        
        {/* Charts for Future Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartComponent
            type="bar"
            data={bookingsChartData}
            title={t('charts.monthlyBookingDistribution')}
            loading={chartsLoading}
          />
          <ChartComponent
            type="line"
            data={adrChartData}
            title={t('charts.adrTrendAnalysis')}
            loading={chartsLoading}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}