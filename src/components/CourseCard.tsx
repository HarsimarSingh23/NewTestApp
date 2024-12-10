import React from 'react';
import { BookOpen } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
}

export function CourseCard({ title, description, imageUrl, progress }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <h3 className="ml-2 text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}