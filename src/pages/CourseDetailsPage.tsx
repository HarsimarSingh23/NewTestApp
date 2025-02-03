import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { courses } from './CoursesPage';
import { ImageCarousel } from '../components/ImageCarousel';
import { ContentWindow } from '../components/CourseContentWindow';

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showCarousel, setShowCarousel] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const course = courses.find((c) => c.id === Number(courseId));

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showCarousel && <ImageCarousel onClose={() => setShowCarousel(false)} />}
      <ContentWindow isOpen={showContent} onClose={() => setShowContent(false)} />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${showCarousel ? 'hidden' : ''}`}>
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center text-indigo-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-64">
            <img
              src={`${course.imageUrl}`}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-6">
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
                <ul className="list-disc list-inside space-y-2">
                  {course.modules.map((module: string, index: number) => (
                    <li key={index} className="text-gray-600">{module}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Course Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Instructor</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.progress}% Complete</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{course.enrollmentStatus}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCarousel(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                View Course Images
              </button>
              <button
                onClick={() => setShowContent(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Open Course Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}