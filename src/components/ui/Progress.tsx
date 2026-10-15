import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({
  value,
  indicatorColor = 'bg-red-500',
  className,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', indicatorColor)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
