import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-slate-100 text-[#7A1528] border-slate-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    maroon: 'bg-slate-100 text-[#7A1528] border-slate-200 font-semibold',
    navy: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${sizeClasses[size] || sizeClasses.sm} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
