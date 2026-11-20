import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-card transition-shadow ${className}`}
    >
      {(title || subtitle || action) && (
        <div
          className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-800 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center space-x-2">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
