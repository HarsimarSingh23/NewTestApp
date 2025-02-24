import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, PenSquare } from 'lucide-react';
import MCQTest from '../components/mcqtest';

interface TestResult {
  testTitle: string;
  marks: number;
  totalMarks: number;
  result: 'Pass' | 'Fail';
  timestamp: string;
}

interface CourseAssessment {
  courseName: string;
  tests: TestResult[];
}

const Assessment: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sample data - replace with actual data from your backend
  const assessmentData: CourseAssessment[] = [
    {
      courseName: 'Long Navigation And Direction',
      tests: [
        {
          testTitle: 'Navigation Fundamentals Quiz',
          marks: 85,
          totalMarks: 100,
          result: 'Pass',
          timestamp: '2024-03-20 14:30',
        },
        {
          testTitle: 'Chart Reading Assessment',
          marks: 70,
          totalMarks: 100,
          result: 'Pass',
          timestamp: '2024-03-18 10:15',
        },
      ],
    },
    {
      courseName: 'Long Navigation Foreign',
      tests: [
        {
          testTitle: 'Foreign Navigation Terms',
          marks: 45,
          totalMarks: 100,
          result: 'Fail',
          timestamp: '2024-03-15 16:45',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Course Assessments</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTest(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PenSquare className="h-4 w-4 mr-2" />
                Take New Test
              </button>
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {assessmentData.map((course) => (
            <div key={course.courseName} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-indigo-600 cursor-pointer">
                <h2 className="text-xl font-semibold text-white">{course.courseName}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {course.tests.map((test) => (
                  <div
                    key={test.testTitle}
                    className={`px-6 py-4 ${
                      test.result === 'Pass' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{test.testTitle}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Marks: {test.marks}/{test.totalMarks}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Result:{' '}
                          <span
                            className={`font-medium ${
                              test.result === 'Pass' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {test.result}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Taken on: {test.timestamp}</p>
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round((test.marks / test.totalMarks) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showTest && <MCQTest onClose={() => setShowTest(false)} />}
    </div>
  );
};

export default Assessment;