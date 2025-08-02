# Hotel Analytics Dashboard - Complete Project Recreation Prompt

## Project Overview
Create a comprehensive hotel analytics dashboard application with multi-language support, multi-currency conversion, and real-time data visualization. This is a React-TypeScript application built with Vite, using Supabase as the backend database and authentication provider.

## Technology Stack & Dependencies
```json
{
  "core": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  },
  "ui": {
    "@radix-ui": "Multiple components (accordion, dialog, select, tabs, etc.)",
    "tailwindcss": "^3.4.11",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.462.0"
  },
  "data": {
    "@supabase/supabase-js": "^2.53.0",
    "@tanstack/react-query": "^5.56.2"
  },
  "charts": {
    "chart.js": "^4.5.0",
    "react-chartjs-2": "^5.3.0",
    "recharts": "^2.12.7"
  },
  "i18n": {
    "i18next": "^25.3.2",
    "react-i18next": "^15.6.1"
  },
  "routing": {
    "react-router-dom": "^6.26.2"
  },
  "notifications": {
    "sonner": "^1.5.0"
  }
}
```

## Database Schema (Supabase)

### Tables Structure
```sql
-- Hotels table
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  brand_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Monthly statistics table
CREATE TABLE monthly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id),
  month_start DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_revenue_eur NUMERIC DEFAULT 0,
  adr_eur NUMERIC DEFAULT 0,
  strongest_channel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Foreign exchange rates table
CREATE TABLE fx_rates (
  rate_date DATE PRIMARY KEY,
  eur_to_usd NUMERIC DEFAULT 1.0,
  eur_to_try NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User hotel assignments table
CREATE TABLE user_hotels (
  user_id UUID REFERENCES auth.users(id),
  hotel_id UUID REFERENCES hotels(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, hotel_id)
);
```

### Row Level Security Policies
```sql
-- Hotels: Users can only view their assigned hotels
CREATE POLICY "Users can view their assigned hotels" ON hotels
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = hotels.id
  )
);

-- Monthly stats: Users can only view stats for their hotels
CREATE POLICY "Users can view stats for their hotels" ON monthly_stats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_hotels.user_id = auth.uid() 
    AND user_hotels.hotel_id = monthly_stats.hotel_id
  )
);

-- FX rates: All authenticated users can view
CREATE POLICY "Authenticated users can view fx rates" ON fx_rates
FOR SELECT USING (auth.uid() IS NOT NULL);

-- User hotels: Users can view their own assignments
CREATE POLICY "Users can view their own hotel assignments" ON user_hotels
FOR SELECT USING (user_id = auth.uid());
```

## Core Features & Functionality

### 1. Authentication System
- Supabase authentication with email/password
- Protected routes with authentication guards
- Auto-redirect based on authentication status
- Login component with toggle between sign-in/sign-up modes

### 2. Multi-Language Support (Turkish/English)
Complete i18n implementation with the following translation structure:
```typescript
const translations = {
  tr: {
    translation: {
      login: {
        title: 'Otel Analiz Paneli',
        email: 'E-posta',
        password: 'Şifre',
        signIn: 'Giriş Yap',
        signUp: 'Kayıt Ol',
        signInBtn: 'Giriş',
        signUpBtn: 'Kayıt',
        error: 'Giriş sırasında hata oluştu',
        success: 'Başarıyla giriş yapıldı'
      },
      dashboard: {
        title: 'Dashboard',
        selectHotel: 'Otel Seçin',
        selectMonth: 'Ay Seçin',
        selectData: 'Bir otel ve ay seçerek analitiği görüntüleyin',
        logout: 'Çıkış',
        loadingHotels: 'Oteller yükleniyor...'
      },
      kpi: {
        totalBookings: 'Toplam Rezervasyon',
        totalRevenue: 'Toplam Gelir',
        adr: 'Ortalama ADR',
        strongestChannel: 'En Güçlü Kanal',
        futureBookings: 'Gelecek Rezervasyonlar',
        futureRevenue: 'Gelecek Gelir',
        futureADR: 'Gelecek ADR',
        bookingWindow: 'Rezervasyon Penceresi'
      },
      charts: {
        revenueShareByChannel: 'Kanallara Göre Gelir Payı',
        monthlyRevenueTrend: 'Aylık Gelir Trendi',
        monthlyBookingDistribution: 'Aylık Rezervasyon Dağılımı',
        adrTrendAnalysis: 'ADR Trend Analizi'
      },
      tabs: {
        occurredStays: 'Gerçekleşen Konaklamalar',
        futureSales: 'Gelecek Satışlar'
      },
      currency: {
        eur: '€',
        usd: '$',
        try: '₺'
      }
    }
  },
  en: {
    // Complete English translations mirror structure
  }
};
```

### 3. Multi-Currency System (EUR/USD/TRY)
- Context-based currency management
- Real-time FX rate conversion
- Currency toggle component with three-button toggle design
- Automatic currency formatting with proper symbols and locale

### 4. Static Month Selection
- Generate 12 static months for current year (2024-01 to 2024-12)
- Turkish month names formatting using `toLocaleDateString('tr-TR')`
- No database dependency for month options

## Component Architecture

### Core Components Structure
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── Dashboard.tsx (Main dashboard layout)
│   ├── Login.tsx (Authentication component)
│   ├── HotelSelector.tsx (Hotel dropdown selection)
│   ├── MonthSelector.tsx (Static month selection)
│   ├── CurrencyToggle.tsx (Three-currency toggle)
│   ├── AnalyticsTabs.tsx (Occurred/Future tabs)
│   ├── KPIGrid.tsx (4x2 KPI cards grid)
│   ├── ChartComponent.tsx (Chart.js wrapper)
│   └── StatsView.tsx (Statistics display)
├── contexts/
│   └── CurrencyContext.tsx (Global currency state)
├── hooks/
│   ├── useAuth.ts (Supabase authentication)
│   ├── useHotelData.ts (Hotel data queries)
│   └── useChartData.ts (Chart data processing)
├── i18n/
│   └── config.ts (i18next configuration)
└── integrations/supabase/
    ├── client.ts (Supabase client setup)
    └── types.ts (Generated types)
```

### Key Component Specifications

#### Dashboard Component
- Header with title, currency toggle, language toggle, logout button
- Hotel and month selectors
- Conditional rendering of analytics when both hotel and month selected
- Responsive grid layout

#### KPIGrid Component
Two KPI configurations:
```typescript
const kpiConfigs = {
  occurred: [
    { id: 'totalBookings', icon: 'calendar' },
    { id: 'totalRevenue', icon: 'euro' },
    { id: 'adr', icon: 'trending-up' },
    { id: 'strongestChannel', icon: 'crown' }
  ],
  future: [
    { id: 'futureBookings', icon: 'calendar-plus' },
    { id: 'futureRevenue', icon: 'euro' },
    { id: 'futureADR', icon: 'trending-up' },
    { id: 'bookingWindow', icon: 'clock' }
  ]
};
```

#### AnalyticsTabs Component
- Two tabs: "Occurred Stays" and "Future Sales"
- 4 KPI cards per tab in responsive grid
- 4 charts per tab: doughnut, line, bar, line
- Loading states with skeleton cards

#### ChartComponent
- Lazy-loaded Chart.js components
- Support for: line, bar, doughnut, pie
- Consistent styling with Inter font
- Loading states with skeleton UI
- Responsive and animated charts

## Data Management & Hooks

### useHotelData Hook
```typescript
// Fetch hotels for current user
export function useHotels() {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Hotel[];
    }
  });
}

// Fetch statistics with currency conversion
export function useStats(hotelId?: string, month?: string, currency: 'eur' | 'usd' | 'try' = 'eur') {
  const { data: fxRate } = useFxRate(month);
  
  return useQuery({
    queryKey: ['stats', hotelId, month, currency],
    queryFn: async () => {
      if (!hotelId || !month) return null;
      
      const { data, error } = await supabase
        .from('monthly_stats')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('month_start', month + '-01')
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Currency conversion logic
      let multiplier = 1;
      if (currency === 'usd' && fxRate?.eur_to_usd) {
        multiplier = fxRate.eur_to_usd;
      } else if (currency === 'try' && fxRate?.eur_to_try) {
        multiplier = fxRate.eur_to_try;
      }
      
      return {
        ...data,
        total_revenue: data.total_revenue_eur * multiplier,
        adr: data.adr_eur * multiplier
      };
    }
  });
}
```

### useChartData Hook
Generate data for 4 chart types:
1. **Monthly Revenue Trend** (Line Chart)
2. **Monthly Booking Distribution** (Bar Chart)  
3. **ADR Trend Analysis** (Line Chart)
4. **Revenue Share by Channel** (Doughnut Chart)

## Styling & Design System

### Tailwind Configuration
Use semantic CSS variables for theming:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}
```

### UI Guidelines
- Cards with proper spacing and shadows
- Loading states using skeleton UI
- Responsive grid layouts (4x2 for KPIs, 2x2 for charts)
- Consistent button styles with variants
- Proper color contrast for accessibility

## Implementation Priority

### Phase 1: Core Structure
1. Set up Vite + React + TypeScript project
2. Install and configure all dependencies
3. Set up Supabase client and authentication
4. Create basic routing structure

### Phase 2: Authentication & Layout
1. Implement Login component with Supabase auth
2. Create Dashboard layout with header
3. Add protected route guards
4. Implement logout functionality

### Phase 3: Language & Currency Systems
1. Set up i18next with complete translations
2. Create CurrencyContext and toggle component
3. Add language toggle functionality
4. Test all text elements switch properly

### Phase 4: Data Management
1. Create all custom hooks (useAuth, useHotelData, useChartData)
2. Implement hotel and month selectors
3. Add currency conversion logic
4. Set up React Query for caching

### Phase 5: Analytics Dashboard
1. Build KPIGrid component with loading states
2. Create ChartComponent with Chart.js integration
3. Implement AnalyticsTabs with two views
4. Add all chart types with proper data formatting

### Phase 6: Polish & Optimization
1. Add proper error handling
2. Implement loading states throughout
3. Optimize performance with lazy loading
4. Add responsive design improvements

## Technical Implementation Notes

### Supabase Client Setup
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### Currency Formatting
```typescript
const formatCurrency = (amount: number, currency: string) => {
  const symbols = { eur: '€', usd: '$', try: '₺' };
  const locales = { eur: 'de-DE', usd: 'en-US', try: 'tr-TR' };
  
  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency: currency.toUpperCase(),
    symbol: symbols[currency]
  }).format(amount);
};
```

### Chart Data Processing
Transform database data into Chart.js compatible format with proper labels, colors, and responsive design.

### Loading States
Implement skeleton UI for all components during data fetching, with consistent design patterns.

This prompt contains all the essential information needed to recreate the complete hotel analytics dashboard application with full functionality, proper architecture, and production-ready code quality.