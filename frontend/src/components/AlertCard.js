// src/components/AlertCard.js
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return CheckCircle;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-800';
      case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-blue-500 bg-blue-50 text-blue-800';
      default: return 'border-green-500 bg-green-50 text-green-800';
    }
  };

  const AlertIcon = getAlertIcon(alert.severity);

  return (
    <div className={`border-l-4 p-4 mb-4 bg-white rounded-r-lg ${getAlertColor(alert.severity)}`}>
      <div className="flex items-start">
        <AlertIcon className="w-5 h-5 mr-3 mt-0.5" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-black">{alert.vehicle}</p>
              <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
            </div>
            <span className="text-xs text-gray-500">
              {alert.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;