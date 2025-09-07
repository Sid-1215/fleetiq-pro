// src/components/StatsCard.js - Enhanced with Better Change Handling
import React from 'react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  // Handle edge cases for change values
  const getChangeDisplay = () => {
    if (change === null || change === undefined) return null;
    
    // Handle infinite or very large changes
    if (!isFinite(change) || Math.abs(change) > 999) {
      return "New";
    }
    
    // Round to 1 decimal place for small changes
    const roundedChange = Math.abs(change) < 1 && change !== 0 
      ? parseFloat(change.toFixed(1))
      : Math.round(change);
    
    return roundedChange;
  };

  const getChangeColor = () => {
    if (change === null || change === undefined) return '';
    
    // Special handling for alerts (where increase is bad)
    if (title.toLowerCase().includes('alert')) {
      return change > 0 ? 'text-red-600' : 'text-green-600';
    }
    
    // Normal metrics (where increase is good)
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = () => {
    if (change === null || change === undefined) return '';
    
    // Special handling for alerts
    if (title.toLowerCase().includes('alert')) {
      return change > 0 ? '↗' : '↘';
    }
    
    return change >= 0 ? '↗' : '↘';
  };

  const displayChange = getChangeDisplay();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-black mt-1 mb-1">{value}</p>
          
          {displayChange !== null && (
            <div className={`text-sm flex items-center ${getChangeColor()}`}>
              <span className="mr-1 font-medium">
                {getChangeIcon()}
              </span>
              <span className="font-medium">
                {displayChange === "New" ? "New" : `${change >= 0 ? '+' : ''}${displayChange}%`}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                vs previous
              </span>
            </div>
          )}
          
          {displayChange === null && (
            <div className="text-sm text-gray-400">
              No change data
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;