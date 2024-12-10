import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuthStore } from '../store/authStore';
import course1 from '../img/course1.jpg';
import course2 from '../img/course2.jpg';
import course3 from '../img/course3.jpg';
import course4 from '../img/course4.jpg';
import course5 from '../img/course5.jpg';
import course6 from '../img/course6.jpg';

export const courses = [
  {
    id: 1,
    title: 'Long Navigation And Direction',
    description: 'Learn the basics of navigation and direction',
    imageUrl: course1,
    progress: 75,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
  {
    id: 2,
    title: 'Long Navigation Foreign',
    description: 'Learn the basics of long navigation in foreing languages',
    imageUrl: course2,
    progress: 45,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
  {
    id: 3,
    title: 'Assistant Commandant Course',
    description: 'Learn the basics assistant commandant course',
    imageUrl: course3,
    progress: 30,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
  {
    id: 4,
    title: 'SLT x Tech Courses ',
    description: 'Learn the basics of SLT x Tech courses',
    imageUrl: course4,
    progress: 60,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
  
  {
    id: 5,
    title: 'PO "Q" Courses',
    description: 'Learn the basics PO "Q" course',
    imageUrl: course5,
    progress: 45,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
  {
    id: 6,
    title: 'Leading Course',
    description: 'Learn the basics of leading course',
    imageUrl: course6,
    progress: 0,
    instructor: 'Capt. Singh',
    duration: '12 weeks',
    modules: [
      'Basic Navigation Principles',
      'Chart Reading',
      'Electronic Navigation Systems',
      'Weather Navigation',
    ],
    enrollmentStatus: 'In Progress',
  },
];

export function CoursesPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} onClick={() => handleCourseClick(course.id)} className="cursor-pointer">
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
