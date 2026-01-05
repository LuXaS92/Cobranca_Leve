import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot'; // I didn't install radix slot, so I will remove this and use simple button for now or install it.
// Actually, I'll just use simple props.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {

        const variants = {
            primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg transition-all',
            secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm',
            outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
            ghost: 'text-slate-600 hover:bg-slate-100',
            danger: 'bg-red-500 text-white hover:bg-red-600',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-8 py-4 text-base font-semibold',
        };

        return (
            <button
                ref={ref}
                className={`
          flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className || ''}
        `}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
