import React from 'react';
import { User } from '../../types';

interface StudentListProps {
  students: User[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Students</h3>
        <p className="mt-1 text-sm text-gray-500">View and manage student progress</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {students.map((student) => (
          <li key={student.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
              <button
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                onClick={() => {/* TODO: Implement view details */}}
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};