import React from 'react';
import '../styles/components/StatCard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className="stat-trend">
            ↑ {trend} from last month
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
