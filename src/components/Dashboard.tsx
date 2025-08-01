import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();

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
            <Button variant="outline" onClick={toggleLanguage}>
              {i18n.language === 'tr' ? 'EN' : 'TR'}
            </Button>
            <Button variant="outline" onClick={signOut}>
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {t('dashboard.comingSoon')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hotel analytics dashboard features are being developed.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}