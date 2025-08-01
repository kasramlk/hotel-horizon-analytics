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
        comingSoon: 'Yakında',
        logout: 'Çıkış',
        totalBookings: 'Toplam Rezervasyon',
        totalRevenue: 'Toplam Gelir',
        averageRate: 'Ortalama Fiyat',
        strongestChannel: 'En Güçlü Kanal'
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
        comingSoon: 'Coming Soon',
        logout: 'Logout',
        totalBookings: 'Total Bookings',
        totalRevenue: 'Total Revenue',
        averageRate: 'Average Rate',
        strongestChannel: 'Strongest Channel'
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