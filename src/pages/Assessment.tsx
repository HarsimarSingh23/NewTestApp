import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import MCQTest from '../components/McqTest';
import { supabase } from '../backend/supabaseClient';

// Interfaces for Supabase data
interface Test {
  id: string;
  title: string;
  course_id: string;
  total_marks: number;
  passing_marks: number;
  is_retestable: boolean;
}

interface TestResult {
  id: string;
  test_id: string;
  test_title: string;
  course_id: string;
  course_name: string;
  marks: number;
  total_marks: number;
  result: string;
  created_at: string;
  is_retestable: boolean;
}

interface CourseAssessment {
  courseName: string;
  tests: TestResult[];
}

const Assessment: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tests and test results
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: testsData, error: testsError } = await supabase.from("tests").select("*");
      const { data: testResultsData, error: testResultsError } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user?.id);
  
      if (testsError) throw testsError;
      if (testResultsError) throw testResultsError;
  
      setTests(testsData || []);
      setTestResults(testResultsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch assessment data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);
  

  // Group test results by course
  const groupedTestResults = testResults.reduce<CourseAssessment[]>((acc, result) => {
    // Find or create course in accumulator
    let courseEntry = acc.find(course => course.courseName === result.course_name);
    
    if (!courseEntry) {
      courseEntry = { courseName: result.course_name, tests: [] };
      acc.push(courseEntry);
    }
    
    // Add test result to course
    courseEntry.tests.push({
      ...result,
      result: result.marks > result.total_marks * 0.5 ? 'Pass' : 'Fail'
    });

    return acc;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTestClick = (test: Test) => {
    setSelectedTest(test);
    setShowTest(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading assessments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Course Assessments</h1>
            <div className="flex items-center space-x-4">
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
        {/* Available Tests Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => handleTestClick(test)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
                <p className="text-sm text-gray-600">Total Marks: {test.total_marks}</p>
                <p className="text-sm text-gray-600">Passing Marks: {test.passing_marks}</p>
                {test.is_retestable && (
                  <span className="text-xs text-green-600 mt-2 block">Unlimited attempts for Practice</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Test Results Section */}
        <div className="space-y-4">
          {groupedTestResults.length === 0 ? (
            <div className="text-center text-gray-600">
              No test results available yet.
            </div>
          ) : (
            groupedTestResults.map((course) => (
              <div key={course.courseName} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-indigo-600">
                  <h2 className="text-xl font-semibold text-white">{course.courseName}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {course.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`px-6 py-4 ${
                        test.result === 'Pass' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{test.test_title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Marks: {test.marks}/{test.total_marks}
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
                          <p className="mt-1 text-sm text-gray-500">
                            Taken on: {new Date(test.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-2xl font-bold">
                          {Math.round((test.marks / test.total_marks) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showTest && selectedTest && (
        <MCQTest 
          test={selectedTest} 
          onClose={() => setShowTest(false)}
          onTestComplete={async () => {
            setShowTest(false); // Re-fetch assessment results without reloading the page
            await fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Assessment;