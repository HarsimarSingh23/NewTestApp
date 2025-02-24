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
    question: "What does continuous sounding of fog signaling apparatus mean?",
    options: [
      "Vessel is in distress and requires immediate assistance",
      "Vessel is approaching dangerous weather",
      "Vessel is stopping engines",
      "Vessel is changing course"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "What does it indicate when a vessel in bad visibility sounds signal 'GU'?",
    options: [
      "Vessel is not under command",
      "Vessel is requesting pilot",
      "Vessel is towing another vessel",
      "Vessel is turning to starboard"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Where are the anchor lights of an aircraft carrier positioned?",
    options: [
      "Forward and aft of the flight deck",
      "At the highest point of the superstructure",
      "On the bow and stern",
      "At the fore and aft ends of the island structure"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "A vessel flying Inter-co group NE 2 indicates:",
    options: [
      "Vessel is changing course to port",
      "Vessel requires medical assistance",
      "Vessel's engines are broken down",
      "Vessel requires immediate assistance"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the luminous range of a submarine's NUC light?",
    options: [
      "2 nautical miles",
      "3 nautical miles",
      "4 nautical miles",
      "5 nautical miles"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "How much clearance should you give to a vessel engaged in seismic survey?",
    options: [
      "1 nautical mile",
      "2 nautical miles",
      "3 nautical miles",
      "5 nautical miles"
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "When two vessels are approaching one another at different ports in a tidal river, which vessel should wait?",
    options: [
      "The vessel with tide against her",
      "The vessel with tide in her favor",
      "The larger vessel",
      "The vessel on the port side"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "A submarine flashing amber light indicates:",
    options: [
      "Preparing to surface",
      "Emergency condition",
      "Request for assistance",
      "Diving operations in progress"
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    question: "A vessel using an anchor light to turn is said to be underway. Is this statement true or false?",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Does the narrow channel rule apply to lanes of TSS although such lanes may be relatively narrow?",
    options: [
      "Yes, always",
      "No, never",
      "Only during daylight hours",
      "Only in heavy traffic"
    ],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "When is fishing permitted in a narrow channel?",
    options: [
      "Never permitted",
      "Only during daylight hours",
      "When it does not impede passage of vessels that can safely navigate only within the channel",
      "Only during slack water"
    ],
    correctAnswer: 2
  },
  {
    id: 12,
    question: "Is anchoring permitted in narrow channels and traffic separation schemes?",
    options: [
      "Yes, always permitted",
      "No, never permitted",
      "Only in emergencies or with proper authorization",
      "Only during daylight hours"
    ],
    correctAnswer: 2
  },
  {
    id: 13,
    question: "Which vessels are exempted from entering traffic separation zones?",
    options: [
      "Only fishing vessels",
      "Only military vessels",
      "No vessels are exempted",
      "Vessels less than 20 meters"
    ],
    correctAnswer: 2
  },
  {
    id: 14,
    question: "When is a vessel permitted to enter or cross a traffic separation zone?",
    options: [
      "In cases of emergency to avoid immediate danger",
      "During daylight hours only",
      "When traffic is light",
      "When visibility is good"
    ],
    correctAnswer: 0
  },
  {
    id: 15,
    question: "What factors should you consider when overtaking in a narrow channel?",
    options: [
      "Only vessel speed",
      "Only water depth",
      "Only traffic density",
      "All factors including vessel speed, water depth, traffic density, and channel characteristics"
    ],
    correctAnswer: 3
  },
  {
    id: 16,
    question: "Who has the right of way: a NUC vessel overtaking a power-driven vessel?",
    options: [
      "The NUC vessel",
      "The power-driven vessel",
      "The faster vessel",
      "The vessel with more maneuverability"
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    question: "A vessel constrained by her draught is expected to keep out of the way of a power-driven vessel crossing from her starboard side so as to involve risk of collision. True or False?",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    question: "What should be the fundamental frequency range and audibility of a ship's sound signaling apparatus?",
    options: [
      "70-200Hz, 1 nautical mile",
      "130-350Hz, 1.5 nautical miles",
      "70-700Hz, 2 nautical miles",
      "200-800Hz, 2.5 nautical miles"
    ],
    correctAnswer: 2
  },
  {
    id: 19,
    question: "Hovercraft/hydrofoils are classified as seaplanes even when operating in the non-displacement mode. True or False?",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "Why do air cushion vessels operating in non-displacement mode exhibit an all-round flashing yellow light in addition to the lights prescribed for power-driven vessels underway?",
    options: [
      "To indicate their unique operating mode and unusual maneuvering characteristics",
      "To show they are restricted in maneuverability",
      "To indicate they are engaged in special operations",
      "To show they are operating at high speed"
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
        <h2 className="text-2xl font-bold mb-6">Maritime Navigation and Regulations Test</h2>
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