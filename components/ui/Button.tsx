import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-bg-DEFAULT disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20 border border-transparent",
    secondary: "bg-bg-card text-slate-700 hover:bg-bg-DEFAULT border border-slate-200 shadow-sm focus:ring-slate-500",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 focus:ring-red-500",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700",
    outline: "border border-slate-300 bg-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-400"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};