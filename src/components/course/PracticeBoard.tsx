import React, { useState } from 'react';
import { AIInterface } from '../ai/AIInterface';

export const PracticeBoard: React.FC = () => {
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');

  const handleClear = () => {
    setCode('');
    setNotes('');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Coding Practice</h2>
            <button
              onClick={() => setCode('')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Code
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 font-mono text-sm p-4 border rounded-md"
            placeholder="Write your code here..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <button
              onClick={() => setNotes('')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Notes
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-96 p-4 border rounded-md"
            placeholder="Take notes here..."
          />
        </div>
      </div>

      <div className="col-span-2">
        <AIInterface code={code} notes={notes} />
      </div>
    </div>
  );
};