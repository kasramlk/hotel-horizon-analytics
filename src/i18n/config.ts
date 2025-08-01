import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
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
        comingSoon: 'Yakında',
        logout: 'Çıkış',
        loadingHotels: 'Oteller yükleniyor...',
        loadingMonths: 'Aylar yükleniyor...',
        totalBookings: 'Toplam Rezervasyon',
        totalRevenue: 'Toplam Gelir',
        averageRate: 'Ortalama Fiyat',
        strongestChannel: 'En Güçlü Kanal'
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
    translation: {
      login: {
        title: 'Hotel Analytics Dashboard',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signInBtn: 'Sign In',
        signUpBtn: 'Sign Up',
        error: 'Error during login',
        success: 'Successfully logged in'
      },
      dashboard: {
        title: 'Dashboard',
        selectHotel: 'Select Hotel',
        selectMonth: 'Select Month',
        selectData: 'Select a hotel and month to view analytics',
        comingSoon: 'Coming Soon',
        logout: 'Logout',
        loadingHotels: 'Loading hotels...',
        loadingMonths: 'Loading months...',
        totalBookings: 'Total Bookings',
        totalRevenue: 'Total Revenue',
        averageRate: 'Average Rate',
        strongestChannel: 'Strongest Channel'
      },
      kpi: {
        totalBookings: 'Total Bookings',
        totalRevenue: 'Total Revenue',
        adr: 'Average ADR',
        strongestChannel: 'Top Channel',
        futureBookings: 'Future Bookings',
        futureRevenue: 'Future Revenue',
        futureADR: 'Future ADR',
        bookingWindow: 'Booking Window'
      },
      charts: {
        revenueShareByChannel: 'Revenue Share by Channel',
        monthlyRevenueTrend: 'Monthly Revenue Trend',
        monthlyBookingDistribution: 'Monthly Booking Distribution',
        adrTrendAnalysis: 'ADR Trend Analysis'
      },
      tabs: {
        occurredStays: 'Occurred Stays',
        futureSales: 'Future Sales'
      },
      currency: {
        eur: '€',
        usd: '$',
        try: '₺'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;