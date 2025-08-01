import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { HotelSelector } from '@/components/HotelSelector';
import { MonthSelector } from '@/components/MonthSelector';
import { CurrencyToggle } from '@/components/CurrencyToggle';
import { AnalyticsTabs } from '@/components/AnalyticsTabs';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <div className="flex gap-2">
            <CurrencyToggle />
            <Button variant="outline" onClick={toggleLanguage}>
              {i18n.language === 'tr' ? 'EN' : 'TR'}
            </Button>
            <Button variant="outline" onClick={signOut}>
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <HotelSelector 
            value={selectedHotel} 
            onValueChange={(value) => {
              setSelectedHotel(value);
              setSelectedMonth(''); // Reset month when hotel changes
            }} 
          />
          <MonthSelector 
            hotelId={selectedHotel}
            value={selectedMonth} 
            onValueChange={setSelectedMonth} 
          />
        </div>

        {/* Content */}
        {selectedHotel && selectedMonth ? (
          <AnalyticsTabs hotelId={selectedHotel} month={selectedMonth} />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  {selectedHotel ? t('dashboard.selectMonth') : t('dashboard.selectHotel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {selectedHotel 
                    ? 'Please select a month to view analytics'
                    : 'Please select a hotel to view analytics'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}