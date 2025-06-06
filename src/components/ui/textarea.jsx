import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }) {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Check for field-sizing support
      const isFieldSizingSupported =
        'fieldSizing' in document.documentElement.style ||
        'webkitFieldSizing' in document.documentElement.style;

      if (!isFieldSizingSupported) {
        const adjustHeight = () => {
          // Get minHeight from computed style or fallback to 36px
          const minHeight = parseFloat(getComputedStyle(textarea).minHeight) || 36;
          textarea.style.height = `${minHeight}px`;

          // Only expand if content exceeds minimum height
          if (textarea.scrollHeight > minHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`;
          }
        };

        // Adjust height on initial render and when the value changes
        adjustHeight();
        textarea.addEventListener('input', adjustHeight);

        return () => {
          textarea.removeEventListener('input', adjustHeight);
        };
      }
    }
  }, [props.value]);

  return (
    <textarea
      ref={textareaRef}
      data-slot='textarea'
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content max-h-48 min-h-9 w-full resize-none overflow-y-auto rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
