import React from 'react';
import { clsx } from 'clsx';

interface TagProps {
  children: React.ReactNode;
  variant?: 'inbound' | 'outreach' | 'warning' | 'default';
  size?: 'sm' | 'md';
}

export function Tag({ children, variant = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-md',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        {
          'bg-blue-100 text-blue-700': variant === 'inbound',
          'bg-green-100 text-green-700': variant === 'outreach',
          'bg-amber-100 text-amber-700': variant === 'warning',
          'bg-slate-100 text-slate-700': variant === 'default',
        }
      )}
    >
      {children}
    </span>
  );
}