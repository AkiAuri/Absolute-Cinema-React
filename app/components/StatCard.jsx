import React from 'react';

function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 dark:bg-gray-900">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && <Icon className="text-amber-600" size={24} />}
      </div>

      <p className="text-white text-3xl font-bold mb-2">{value}</p>

      {trend && (
        <p className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '+' : '-'} {trend.percentage}% from last month
        </p>
      )}
    </div>
  );
}

export default StatCard;
