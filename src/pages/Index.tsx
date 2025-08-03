import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { PMSLayout } from '@/components/PMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar, Users, Bed, CreditCard } from 'lucide-react';
import { HotelSelector } from '@/components/HotelSelector';
import { MonthSelector } from '@/components/MonthSelector';
import { AnalyticsTabs } from '@/components/AnalyticsTabs';

const Index = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Hotel PMS</h1>
          <p className="text-xl text-muted-foreground mb-8">Professional Property Management System</p>
          <a href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Quick stats for dashboard overview
  const quickStats = [
    { title: 'Today\'s Arrivals', value: '12', icon: Calendar, color: 'text-blue-600' },
    { title: 'Today\'s Departures', value: '8', icon: Calendar, color: 'text-green-600' },
    { title: 'Occupied Rooms', value: '45/60', icon: Bed, color: 'text-orange-600' },
    { title: 'Revenue Today', value: '€2,450', icon: CreditCard, color: 'text-purple-600' },
  ];

  return (
    <PMSLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your Hotel PMS</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Check-ins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">John Doe - Room 101</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jane Smith - Room 205</span>
                      <span className="text-xs text-muted-foreground">4 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mike Johnson - Room 302</span>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <a href="/reservations" className="flex items-center justify-center p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <span className="text-sm font-medium">New Reservation</span>
                    </a>
                    <a href="/rooms" className="flex items-center justify-center p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <span className="text-sm font-medium">Room Status</span>
                    </a>
                    <a href="/guests" className="flex items-center justify-center p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <span className="text-sm font-medium">Guest Check-in</span>
                    </a>
                    <a href="/payments" className="flex items-center justify-center p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                      <span className="text-sm font-medium">Process Payment</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <HotelSelector 
                value={selectedHotel} 
                onValueChange={(value) => {
                  setSelectedHotel(value);
                  setSelectedMonth('');
                }} 
              />
              <MonthSelector 
                hotelId={selectedHotel}
                value={selectedMonth} 
                onValueChange={setSelectedMonth} 
              />
            </div>

            {selectedHotel && selectedMonth ? (
              <AnalyticsTabs hotelId={selectedHotel} month={selectedMonth} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {selectedHotel ? t('dashboard.selectMonth') : t('dashboard.selectHotel')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('dashboard.selectData')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PMSLayout>
  );
};

export default Index;
