import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentWindowProps {
  isOpen: boolean;
  onClose: () => void;
  courseNumber: number;
}

export function ContentWindow({ 
  isOpen, 
  onClose, 
  courseNumber, 
}: ContentWindowProps) {
  const [content, setContent] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const courseFileMap: { [key: number]: number } = {
    1: 47,
    2: 49,
    3: 25,
    4: 37,
    5: 29,
    6: 15,
    7: 27,
    8: 58,
    9: 31,
  };

  useEffect(() => {
    if (isOpen) {
      loadAllContent(courseNumber);
    }
  }, [isOpen, courseNumber]);

  const loadAllContent = async (courseNum: number) => {
    try {
      setIsLoading(true);
      setError('');

      const pages: string[] = [];
      const totalFiles = courseFileMap[courseNum];
      
      if (!totalFiles) {
        throw new Error('Course not found or no files available.');
      }

      for (let pageNumber = 1; pageNumber <= totalFiles; pageNumber++) {
        const filePath = `/content/course/course${courseNum}/page${pageNumber}.txt`;
        const response = await fetch(filePath);

        if (!response.ok) {
          console.warn(`File not found: ${filePath}`);
          continue;
        }

        const text = await response.text();
        pages.push(text);
      }

      if (pages.length === 0) {
        throw new Error('No content found for this course.');
      }

      setContent(pages);
      setTotalFiles(pages.length);
      setCurrentFile(0);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Content not found or failed to load.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentFile < totalFiles - 1) {
      setCurrentFile(currentFile + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFile > 0) {
      setCurrentFile(currentFile - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-48">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Course Banner"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Section with Scrollbar */}
        <div className="p-6 h-96 overflow-y-auto">
          <div className="prose max-w-none">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : (
              <div className="whitespace-pre-wrap">
                <p>{content[currentFile]}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentFile === 0 || isLoading}
            className={`flex items-center ${
              currentFile === 0 || isLoading
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentFile + 1} of {totalFiles}
          </span>
          <button
            onClick={handleNext}
            disabled={currentFile === totalFiles - 1 || isLoading}
            className={`flex items-center ${
              currentFile === totalFiles - 1 || isLoading
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
