'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme}
      className='toaster group'
      style={{
        '--normal-bg': 'var(--card)',
        '--normal-border': 'var(--border)',
        '--normal-text': 'var(--popover-foreground)',

        '--success-bg': 'var(--card)',
        '--success-border': 'var(--border)',
        '--success-text': 'var(--primary)',

        '--info-bg': 'var(--card)',
        '--info-border': 'var(--border)',
        '--info-text': 'var(--info)',

        '--warning-bg': 'var(--card)',
        '--warning-border': 'var(--border)',
        '--warning-text': 'var(--warning)',

        '--error-bg': 'var(--card)',
        '--error-border': 'var(--border)',
        '--error-text': 'var(--destructive)',
      }}
      {...props}
    />
  );
};

export { Toaster };
