import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthSelectorProps {
  hotelId?: string;
  value?: string;
  onValueChange: (value: string) => void;
}

export function MonthSelector({ hotelId, value, onValueChange }: MonthSelectorProps) {
  const { t } = useTranslation();

  // Generate static months for current year
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return `${currentYear}-${month}`;
  });

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