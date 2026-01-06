import React from 'react';
import { cn } from '@/lib/utils';

// Actually, I'll just use simple props.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const variantsMap = {
    primary: 'btn-vibrant rounded-full',
    secondary: 'bg-white text-primary-600 hover:bg-white/80 shadow-md hover:shadow-lg rounded-full border border-primary-100',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 bg-transparent rounded-full',
    ghost: 'text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-full',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-red-500/30 rounded-full',
};

const sizesMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base font-semibold',
};

export const buttonVariants = ({ variant = 'primary', size = 'md', fullWidth = false, className = '' }: any = {}) => {
    return cn(
        "flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variantsMap[variant as keyof typeof variantsMap],
        sizesMap[size as keyof typeof sizesMap],
        fullWidth ? 'w-full' : '',
        className
    );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, size, fullWidth, className })}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
