'use client';

import { useEffect, useState } from 'react';
import { PWAUpdateDialog } from './pwa-update-dialog';

export function PWALifecycle() {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [workbox, setWorkbox] = useState(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      setWorkbox(wb);

      // Add event listeners to handle PWA lifecycle
      const promptNewVersionAvailable = () => {
        // Show our custom dialog instead of browser confirm
        setShowUpdateDialog(true);
      };

      wb.addEventListener('waiting', promptNewVersionAvailable);
      wb.addEventListener('externalwaiting', promptNewVersionAvailable);

      // Register the service worker
      wb.register();
    }
  }, []);

  const handleUpdate = () => {
    if (workbox) {
      workbox.addEventListener('controlling', () => {
        window.location.reload();
      });
      workbox.messageSkipWaiting();
    }
    setShowUpdateDialog(false);
  };

  return (
    <PWAUpdateDialog
      open={showUpdateDialog}
      onOpenChange={setShowUpdateDialog}
      onUpdate={handleUpdate}
    />
  );
}
