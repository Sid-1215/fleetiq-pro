// src/components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover-lift">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-black mt-1">{value}</p>
        {change !== null && (
          <p className={`text-sm mt-1 flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`mr-1 ${change >= 0 ? '↗' : '↘'}`}></span>
            {change >= 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
      <Icon className="w-8 h-8" style={{ color }} />
    </div>
  </div>
);

export default StatsCard;