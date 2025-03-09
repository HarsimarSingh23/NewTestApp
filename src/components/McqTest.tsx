import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../backend/supabaseClient';
import { useAuthStore } from '../store/authStore';

interface Question {
  id: string;
  test_id: string;
  question_text: string;
  marks: number;
  options: string[];
  correct_answer: string;
  is_image_options: boolean;
}

interface Test {
  id: string;
  title: string;
  course_id: string;
  total_marks: number;
  passing_marks: number;
  is_retestable: boolean;
}

interface MCQTestProps {
  test: Test;
  onClose: () => void;
  onTestComplete: () => void;
}

const MCQTest: React.FC<MCQTestProps> = ({ test, onClose, onTestComplete }) => {
  const { user } = useAuthStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [testResult, setTestResult] = useState<{ marks: number; totalMarks: number; result: string } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('test_id', test.id);

        if (error) throw error;
        
        const questionsList = data || [];
        setQuestions(questionsList);
        setTimeRemaining(questionsList.length * 60);
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, [test.id]);

  useEffect(() => {
    if (!showResult && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, showResult]);

  const handleAnswerSelect = (questionId: string, selectedOption: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const calculateTestResults = useCallback(() => {
    let correctAnswers = 0;
    let totalMarks = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers += question.marks;
      }
      totalMarks += question.marks;
    });

    const marks = correctAnswers;
    const result = marks >= test.passing_marks ? 'Pass' : 'Fail';

    return { marks, totalMarks, result };
  }, [questions, selectedAnswers, test.passing_marks]);

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const results = calculateTestResults();
      setTestResult(results);
      setShowResult(true);

      const { error: resultError } = await supabase
        .from('test_results')
        .insert({
          user_id: user?.id,
          test_id: test.id,
          test_title: test.title,
          course_id: test.course_id,
          marks: results.marks,
          total_marks: results.totalMarks,
          result: results.result,
          is_retestable: test.is_retestable
        });

      if (resultError) throw resultError;
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onTestComplete();
    onClose();
  };

  const renderResults = () => {
    if (!testResult) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        <div className="space-y-4">
          <p className="text-lg">
            Score: <span className="font-bold">{testResult.marks}/{testResult.totalMarks}</span>
          </p>
          <p className="text-lg">
            Result: {' '}
            <span className={`font-bold ${testResult.result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.result}
            </span>
          </p>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Return to Assessment Page
          </button>
        </div>
      </div>
    );
  };

  const renderImageOption = (option: string, isSelected: boolean, onClick: () => void) => (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <img
        src={option}
        alt="Option"
        className="w-full h-48 object-contain bg-white"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        }}
      />
    </div>
  );

  const renderTextOption = (option: string, isSelected: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-md border ${
        isSelected
          ? 'bg-blue-100 border-blue-500'
          : 'bg-gray-100 border-gray-300'
      } hover:bg-gray-200 transition`}
    >
      {option}
    </button>
  );

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="text-red-500 font-bold">
            Time Left: {Math.floor(timeRemaining / 60)}:
            {timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
          </div>
        </div>

        <p className="mb-4 text-gray-800">{currentQuestion.question_text}</p>

        <div className={`${currentQuestion.is_image_options ? 'grid grid-cols-2 gap-4' : 'space-y-3'}`}>
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              {currentQuestion.is_image_options
                ? renderImageOption(
                    option,
                    selectedAnswers[currentQuestion.id] === option,
                    () => handleAnswerSelect(currentQuestion.id, option)
                  )
                : renderTextOption(
                    option,
                    selectedAnswers[currentQuestion.id] === option,
                    () => handleAnswerSelect(currentQuestion.id, option)
                  )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          {currentQuestionIndex > 0 && (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Previous
            </button>
          )}

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 bg-green-600 text-white rounded-md ml-auto"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading test questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {showResult ? renderResults() : renderQuestion()}
      </div>
    </div>
  );
};

export default MCQTest;