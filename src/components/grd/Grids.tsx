import React from 'react';

interface GridProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  showHeader?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  title,
  subtitle,
  children, 
  className = '',
  columns = 3,
  gap = 'md',
  showHeader = true
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-3';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showHeader && (title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
      )}

      <div className={`grid ${getGridCols()} ${getGapClass()}`}>
        {React.Children.map(children, (child, index) => (
          <div 
            key={index}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md hover:shadow-xl dark:hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none"></div>
            <div className="relative p-6">{child}</div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        ))}
      </div>

      {React.Children.count(children) === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No items found</h3>
          <p className="text-gray-500 dark:text-gray-300">There are no items to display at the moment.</p>
        </div>
      )}
    </div>
  );
};

// Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return '';
      case 'sm': return 'p-4';
      case 'md': return 'p-6';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md border border-gray-100 dark:border-gray-700 ${getPaddingClass()} ${className}`}>
      {children}
    </div>
  );
};

// CardHeader, CardBody, CardFooter can also be updated similarly:
export const CardHeader: React.FC<any> = ({ title, subtitle, icon, badge, className = '' }) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div className="flex items-center space-x-3">
      {icon && <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">{icon}</div>}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{subtitle}</p>}
      </div>
    </div>
    {badge && <div className="flex-shrink-0">{badge}</div>}
  </div>
);

export const CardBody: React.FC<any> = ({ children, className = '' }) => (
  <div className={`text-gray-600 dark:text-gray-300 leading-relaxed ${className}`}>{children}</div>
);

export const CardFooter: React.FC<any> = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between ${className}`}>{children}</div>
);
