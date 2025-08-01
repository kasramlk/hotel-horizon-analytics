import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';

export function CurrencyToggle() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const currencies = [
    { code: 'eur', symbol: t('currency.eur') },
    { code: 'usd', symbol: t('currency.usd') },
    { code: 'try', symbol: t('currency.try') }
  ] as const;

  return (
    <div className="flex bg-muted rounded-lg p-1">
      {currencies.map(({ code, symbol }) => (
        <Button
          key={code}
          variant={currency === code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setCurrency(code)}
          className="h-8 px-3"
        >
          {symbol}
        </Button>
      ))}
    </div>
  );
}