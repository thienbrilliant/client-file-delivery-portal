import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap border text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px',
  {
    variants: {
      variant: {
        primary: 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:border-[var(--primary-strong)] hover:bg-[var(--primary-strong)] hover:shadow-md',
        secondary: 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-xs)] hover:border-[var(--primary)]/35 hover:bg-[var(--primary-soft)]',
        ghost: 'border-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]',
        destructive: 'border-[var(--destructive)] bg-[var(--destructive)] text-white hover:brightness-95',
        accent: 'border-[var(--accent)] bg-[var(--accent)] text-white hover:brightness-95',
      },
      size: {
        sm: 'h-8 rounded-[7px] px-3',
        md: 'h-9 rounded-[8px] px-3.5',
        lg: 'h-10 rounded-[9px] px-4',
        icon: 'h-9 w-9 rounded-[8px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant, size, ...props }, ref) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});
