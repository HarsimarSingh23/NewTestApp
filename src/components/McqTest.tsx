import React, { useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of a ship's compass?",
    options: [
      "To measure water depth",
      "To determine direction",
      "To calculate speed",
      "To predict weather"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of these is NOT a cardinal direction?",
    options: [
      "North",
      "Southeast",
      "Northwest-east",
      "Southwest"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What does GPS stand for?",
    options: [
      "Global Positioning System",
      "Geographic Place Search",
      "General Position Satellite",
      "Global Path System"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which celestial body is most commonly used for celestial navigation?",
    options: [
      "Mars",
      "Venus",
      "The Sun",
      "Polaris (North Star)"
    ],
    correctAnswer: 3
  },
  {
    id: 5,
    question: "What is a nautical mile equal to?",
    options: [
      "1.852 kilometers",
      "1 kilometer",
      "1 mile",
      "1.5 kilometers"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    question: "What is the purpose of a sextant?",
    options: [
      "Measure wind speed",
      "Calculate celestial angles",
      "Determine water depth",
      "Monitor weather patterns"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which navigation chart scale provides the most detail?",
    options: [
      "1:1,000,000",
      "1:100,000",
      "1:10,000",
      "1:1,000"
    ],
    correctAnswer: 3
  },
  {
    id: 8,
    question: "What is dead reckoning?",
    options: [
      "Navigation without instruments",
      "Calculating position based on previous position and movement",
      "Using depth soundings for navigation",
      "Navigation during nighttime"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What color is typically used for safe water marks on navigation charts?",
    options: [
      "Red",
      "Green",
      "Yellow",
      "Red and White"
    ],
    correctAnswer: 3
  },
  {
    id: 10,
    question: "Which type of chart projection is most commonly used for marine navigation?",
    options: [
      "Mercator",
      "Gnomonic",
      "Lambert",
      "Azimuthal"
    ],
    correctAnswer: 0
  }
];

interface MCQTestProps {
  onClose: () => void;
}

const MCQTest: React.FC<MCQTestProps> = ({ onClose }) => {
  const [currentAnswers, setCurrentAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentAnswers(newAnswers);
  };

  const calculateResults = () => {
    const correctAnswers = currentAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
    setShowResults(true);
    setShowBanner(true);
  };

  const isTestComplete = currentAnswers.every(answer => answer !== -1);
  const percentage = (score / questions.length) * 100;
  const isPassing = percentage >= 70;

  const handleBack = () => {
    setShowResults(false);
    setCurrentAnswers(new Array(questions.length).fill(-1));
    setScore(0);
    setShowBanner(false);
  };

  const ResultBanner = () => {
    if (!showBanner) return null;

    return (
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${isPassing ? 'bg-green-100' : 'bg-red-100'} rounded-lg p-4 shadow-lg max-w-md w-full flex items-center justify-between`}>
        <div className="flex items-center">
          {isPassing ? (
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
          )}
          <p className={`font-medium ${isPassing ? 'text-green-800' : 'text-red-800'}`}>
            {isPassing
              ? "Outstanding! You've passed with excellence!"
              : "Unfortunately, you didn't meet the passing criteria. Keep practicing!"}
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <ResultBanner />
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Test Results</h2>
          <div className="mb-6">
            <p className="text-xl mb-2">Your Score: {score} out of {questions.length}</p>
            <p className="text-lg mb-4">Percentage: {percentage.toFixed(1)}%</p>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {currentAnswers[index] === question.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm mt-1">
                        Your answer: {question.options[currentAnswers[index]]}
                      </p>
                      {currentAnswers[index] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Test
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Navigation Knowledge Test</h2>
        <div className="space-y-6">
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="border rounded-lg p-4">
              <p className="font-medium mb-3">
                {questionIndex + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={currentAnswers[questionIndex] === optionIndex}
                      onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={calculateResults}
            disabled={!isTestComplete}
            className={`px-4 py-2 rounded-md text-white ${
              isTestComplete
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCQTest;