'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function DynamicThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === 'dark' ? '#1d1d1d' : '#00aa63';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', color);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'theme-color';
      newMeta.content = color;
      document.head.appendChild(newMeta);
    }
  }, [resolvedTheme]);

  return null;
}
