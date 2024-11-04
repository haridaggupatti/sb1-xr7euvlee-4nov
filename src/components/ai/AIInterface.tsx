import React, { useState, useEffect } from 'react';
import { Bot, Mic, Volume2 } from 'lucide-react';

interface AIInterfaceProps {
  code?: string;
  notes?: string;
  isVideoPlaying?: boolean;
}

export const AIInterface: React.FC<AIInterfaceProps> = ({ code, notes, isVideoPlaying = false }) => {
  const [isActive, setIsActive] = useState(!isVideoPlaying);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsActive(!isVideoPlaying);
  }, [isVideoPlaying]);

  useEffect(() => {
    if (isActive && (code || notes)) {
      analyzePractice();
    }
  }, [isActive, code, notes]);

  const analyzePractice = () => {
    if (code) {
      setFeedback(prev => [
        ...prev,
        "I notice you're using nested loops. Consider using array methods for better performance.",
        "Your code could benefit from more descriptive variable names."
      ]);
    }
    if (notes) {
      setFeedback(prev => [
        ...prev,
        "Your notes are well-structured. Consider adding more examples to reinforce the concepts.",
        "Try linking these concepts to previous lessons for better retention."
      ]);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  if (!isActive) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bot className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium">AI Learning Assistant</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full ${
              isListening ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-full ${
              isSpeaking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {feedback.map((message, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <Bot className="w-5 h-5 text-blue-600 mt-1" />
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            I'm here to help! Ask me anything about your current lesson or practice.
          </div>
        )}
      </div>
    </div>
  );
};