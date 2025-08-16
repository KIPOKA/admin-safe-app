import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Headers (optional for grid) */}
      <div className="hidden md:grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 px-4 py-2 bg-gray-50 rounded-lg text-gray-500 font-semibold uppercase text-sm">
        {headers.map((header, index) => (
          <div key={index}>{header}</div>
        ))}
      </div>

      {/* Body */}
      <div className="grid gap-4">
        {React.Children.map(children, (child) => (
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
