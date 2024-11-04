import React from 'react';
import { Clock } from 'lucide-react';

interface DurationTrackerProps {
  duration: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export const DurationTracker: React.FC<DurationTrackerProps> = ({ duration }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Learning Duration</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Today</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(duration.daily / 60)}h {duration.daily % 60}m
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">This Week</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(duration.weekly / 60)}h {duration.weekly % 60}m
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(duration.monthly / 60)}h {duration.monthly % 60}m
          </p>
        </div>
      </div>
    </div>
  );
};