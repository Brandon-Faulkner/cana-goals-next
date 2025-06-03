'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running as PWA
    if (window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show install prompt if user hasn't dismissed it recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const daysSinceDismissed = lastDismissed
        ? (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
        : 999; // Show if never dismissed

      // Show prompt if never dismissed or if it's been more than 1 day
      if (daysSinceDismissed > 1) {
        showInstallToast(e);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
      toast.success('App installed successfully! 🎉');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallToast = (promptEvent) => {
    toast(
      <div className='flex w-full items-center gap-3'>
        <Smartphone className='text-primary h-5 w-5 flex-shrink-0' />
        <div className='flex-1'>
          <div className='text-sm font-medium'>Install Cana Goals</div>
          <div className='text-muted-foreground mt-1 text-xs'>
            Get better performance and offline access
          </div>
        </div>
        <div className='flex flex-shrink-0 gap-2'>
          <Button size='sm' onClick={() => handleInstall(promptEvent)} className='h-8 px-3'>
            <Download className='mr-1 h-3 w-3' />
            Install
          </Button>
          <Button variant='outline' size='sm' onClick={handleDismiss} className='h-8 w-8 p-0'>
            <X className='h-3 w-3' />
          </Button>
        </div>
      </div>,
      {
        duration: Infinity,
        position: 'bottom-center',
        id: 'pwa-install-prompt',
      },
    );
  };

  const handleInstall = async (promptEvent) => {
    const prompt = promptEvent || deferredPrompt;
    if (!prompt) return;

    // Dismiss the toast first
    toast.dismiss('pwa-install-prompt');

    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast.success('Installing app... Please wait');
      } else {
        toast.info('Installation cancelled');
      }
    } catch (error) {
      toast.error('Installation failed: ' + error.message);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    toast.dismiss('pwa-install-prompt');
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // This component doesn't render anything - it just manages the toast
  return null;
}

export default PWAInstallPrompt;
