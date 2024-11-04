import React from 'react';
import { BarChart } from 'lucide-react';
import { Progress } from '../../types';

interface ProgressChartProps {
  progress: Progress[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  const totalCourses = progress.length;
  const completedCourses = progress.filter(p => p.completed).length;
  const completionPercentage = totalCourses ? (completedCourses / totalCourses) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <BarChart className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">Learning Progress</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-blue-600">{completionPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {progress.map((p) => (
          <div key={`${p.courseId}-${p.lessonId}`} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Course Progress</h3>
              <span className="text-sm text-gray-500">
                Last accessed: {new Date(p.lastAccessed).toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time spent: {Math.round(p.timeSpent / 60)} minutes</span>
                {p.score && <span>Score: {p.score}%</span>}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: p.completed ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};