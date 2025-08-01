import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHotels } from '@/hooks/useHotelData';

interface HotelSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function HotelSelector({ value, onValueChange }: HotelSelectorProps) {
  const { t } = useTranslation();
  const { data: hotels, isLoading } = useHotels();

  if (isLoading) return <div>{t('dashboard.loadingHotels')}</div>;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder={t('dashboard.selectHotel')} />
      </SelectTrigger>
      <SelectContent>
        {hotels?.map(hotel => (
          <SelectItem key={hotel.id} value={hotel.id}>
            {hotel.name} - {hotel.city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}