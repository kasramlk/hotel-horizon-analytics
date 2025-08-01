import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Trophy,
  CalendarCheck,
  Coins,
  BarChart3,
  Clock
} from 'lucide-react';

interface KPICardProps {
  id: string;
  value: string | number;
  iconKey?: string;
  loading?: boolean;
}

const iconMap = {
  'fa-bed': Calendar,
  'fa-money-bill-wave': DollarSign,
  'fa-chart-bar': BarChart3,
  'fa-trophy': Trophy,
  'fa-calendar-check': CalendarCheck,
  'fa-coins': Coins,
  'fa-chart-area': TrendingUp,
  'fa-clock': Clock
};

export function KPICard({ id, value, iconKey, loading }: KPICardProps) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  
  const getLabel = (id: string) => {
    const labels: Record<string, { tr: string; en: string }> = {
      totalBookings: { tr: 'Toplam Rezervasyon', en: 'Total Bookings' },
      totalRevenue: { tr: 'Toplam Gelir', en: 'Total Revenue' },
      adr: { tr: 'Ortalama ADR', en: 'Average ADR' },
      strongestChannel: { tr: 'En Güçlü Kanal', en: 'Top Channel' },
      futureBookings: { tr: 'Toplam Gelecek Rezervasyon', en: 'Future Bookings' },
      futureRevenue: { tr: 'Toplam Gelecek Satış', en: 'Future Revenue' },
      futureADR: { tr: 'Ortalama ADR', en: 'Average ADR' },
      bookingWindow: { tr: 'Rezervasyon Dönemi', en: 'Booking Window' }
    };
    
    return labels[id]?.[t('currency.eur') === '€' ? 'tr' : 'en'] || id;
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && (id.includes('Revenue') || id.includes('adr'))) {
      const symbols = { eur: '€', usd: '$', try: '₺' };
      return `${symbols[currency]}${val.toLocaleString('tr-TR', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      })}`;
    }
    return val;
  };

  const IconComponent = iconKey ? iconMap[iconKey as keyof typeof iconMap] : null;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {IconComponent && <IconComponent className="h-4 w-4" />}
          {getLabel(id)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
      </CardContent>
    </Card>
  );
}

interface KPIGridProps {
  data: Record<string, any>;
  type: 'occurred' | 'future';
  loading?: boolean;
}

export function KPIGrid({ data, type, loading }: KPIGridProps) {
  const kpiConfigs = {
    occurred: [
      { id: 'totalBookings', iconKey: 'fa-bed' },
      { id: 'totalRevenue', iconKey: 'fa-money-bill-wave' },
      { id: 'adr', iconKey: 'fa-chart-bar' },
      { id: 'strongestChannel', iconKey: 'fa-trophy' }
    ],
    future: [
      { id: 'futureBookings', iconKey: 'fa-calendar-check' },
      { id: 'futureRevenue', iconKey: 'fa-coins' },
      { id: 'futureADR', iconKey: 'fa-chart-area' },
      { id: 'bookingWindow', iconKey: 'fa-clock' }
    ]
  };

  const configs = kpiConfigs[type];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {configs.map(config => (
        <KPICard
          key={config.id}
          id={config.id}
          value={data?.[config.id] || 0}
          iconKey={config.iconKey}
          loading={loading}
        />
      ))}
    </div>
  );
}