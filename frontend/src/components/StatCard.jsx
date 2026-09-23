import React from 'react';

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
          <div style={{ fontSize: '0.75rem', color: 'var(--status-active)', marginTop: '0.25rem' }}>
            ↑ {trend} from last month
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
