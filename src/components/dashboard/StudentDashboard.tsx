import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProgressChart } from '../progress/ProgressChart';
import { DurationTracker } from '../progress/DurationTracker';
import { VideoPlayer } from '../course/VideoPlayer';
import { PracticeBoard } from '../course/PracticeBoard';
import { AIInterface } from '../ai/AIInterface';
import { Notifications } from '../notifications/Notifications';
import { Progress } from '../../types';
import { CourseList } from '../course/CourseList';

export const StudentDashboard: React.FC = () => {
  const { data: progress } = useQuery<Progress[]>({
    queryKey: ['progress'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/progress', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    },
  });

  const { data: duration } = useQuery({
    queryKey: ['duration'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/duration', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch duration');
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer />
          <PracticeBoard />
        </div>
        <div className="space-y-6">
          <DurationTracker duration={duration || { daily: 0, weekly: 0, monthly: 0 }} />
          <ProgressChart progress={progress || []} />
          <Notifications />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
        <CourseList />
      </div>
    </div>
  );
};