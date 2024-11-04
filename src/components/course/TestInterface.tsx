import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '../Button';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: number;
}

interface Test {
  id: number;
  title: string;
  questions: Question[];
  passingScore: number;
}

export const TestInterface: React.FC<{ lessonId: number }> = ({ lessonId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { data: test, isLoading } = useQuery<Test>({
    queryKey: ['test', lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}/test`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch test');
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (answers: Record<number, number>) => {
      const response = await fetch(`/api/lessons/${lessonId}/test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error('Failed to submit test');
      return response.json();
    },
  });

  if (isLoading || !test) return <div>Loading test...</div>;

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = () => {
    submitMutation.mutate(answers);
  };

  const question = test.questions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{test.title}</h2>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {test.questions.length}</span>
          <span>Passing Score: {test.passingScore}%</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{question.text}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              className={`w-full text-left p-4 rounded-lg border ${
                answers[question.id] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion < test.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!answers[question.id]}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== test.questions.length}
            isLoading={submitMutation.isPending}
          >
            Submit Test
          </Button>
        )}
      </div>

      {submitMutation.isSuccess && (
        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg">
          Test submitted successfully! Your score will be available shortly.
        </div>
      )}

      {submitMutation.isError && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
          Failed to submit test. Please try again.
        </div>
      )}
    </div>
  );
};