
import React from 'react';

interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-lab-bg-light p-6 rounded-lg border border-lab-border shadow-lg">
      <h2 className="text-xl font-bold text-lab-text mb-4 flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
};
