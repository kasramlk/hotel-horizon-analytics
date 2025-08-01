import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMonths } from '@/hooks/useHotelData';

interface MonthSelectorProps {
  hotelId?: string;
  value?: string;
  onValueChange: (value: string) => void;
}

export function MonthSelector({ hotelId, value, onValueChange }: MonthSelectorProps) {
  const { t } = useTranslation();
  const { data: months, isLoading } = useMonths(hotelId);

  if (isLoading) return <div>Loading months...</div>;

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={!hotelId}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t('dashboard.selectMonth')} />
      </SelectTrigger>
      <SelectContent>
        {months?.map(month => (
          <SelectItem key={month} value={month}>
            {formatMonth(month)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}