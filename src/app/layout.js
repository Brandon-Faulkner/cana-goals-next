import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-provider';
import { SavingStateProvider } from '@/contexts/saving-state-context';
import { Toaster } from '@/components/ui/sonner';
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt';
import { PWALifecycle } from '@/components/pwa/pwa-lifecycle';
import { OfflineDetector } from '@/components/pwa/offline-detector';
import { DynamicThemeColor } from '@/components/pwa/dynamic-theme-color';
import { TooltipProvider } from '@/components/ui/tooltip';
import localFont from 'next/font/local';

const futura = localFont({
  src: [
    {
      path: '../resources/fonts/FuturaCyrillicLight.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicBook.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicMedium.woff',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicDemi.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicHeavy.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicBold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../resources/fonts/FuturaCyrillicExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-futura',
  display: 'swap',
});

export const metadata = {
  title: 'Cana Goals',
  description:
    'Web app used to add, monitor and complete goals during 100 day or 300 day goal periods for Cana Church staff members.',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#00aa63' },
    ],
  },
  applicationName: 'Cana Goals',
  msTileColor: '#2d2d2d',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cana Goals',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Cana Goals',
    'msapplication-TileColor': '#2d2d2d',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${futura.variable} font-default antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <DynamicThemeColor />
          <AuthProvider>
            <SavingStateProvider>
              <PWALifecycle />
              <OfflineDetector />
              <TooltipProvider delayDuration={1600} skipDelayDuration={0}>
                {children}
              </TooltipProvider>
              <PWAInstallPrompt />
              <Toaster position='top-right' richColors />
            </SavingStateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
