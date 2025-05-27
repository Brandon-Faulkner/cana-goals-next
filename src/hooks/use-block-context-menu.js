import { useEffect } from 'react';

export function useBlockContextMenu(enabled) {
  useEffect(() => {
    if (!enabled) return;

    const onContextMenu = (e) => e.preventDefault();
    // use capture so it's fired before any other handlers
    document.addEventListener('contextmenu', onContextMenu, true);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu, true);
    };
  }, [enabled]);
}
