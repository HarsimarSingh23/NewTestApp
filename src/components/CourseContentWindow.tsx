import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import page1Content from '../content/course/course1/page1.txt';
import page2Content from '../content/course/course1/page2.txt';
import page3Content from '../content/course/course1/page3.txt';

// Map file numbers to their corresponding imported content
const contentMap: { [key: number]: string } = {
  1: page1Content,
  2: page2Content,
  3: page3Content,
};

function bytesToBase64(bytes) {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

interface ContentWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContentWindow({ isOpen, onClose }: ContentWindowProps) {
  const [content, setContent] = useState('');
  const [currentFile, setCurrentFile] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const totalFiles = 3;

  useEffect(() => {
    loadContent(currentFile);
  }, [currentFile]);

  const loadContent = (fileNumber: number) => {
    try {
      // Get the content from the imported file
      const text = contentMap[fileNumber];
      if (text) {
    
        // Convert base64 to readable text
        const base64Content = text.split(',')[1]; // Get the base64 part after the comma
        const decodedContent = atob(base64Content); // Decode base64
        
        const unicodeString = new TextDecoder('utf-8').decode(new Uint8Array([...decodedContent].map(c => c.charCodeAt(0))));

        // Set the decoded content
        setContent(unicodeString);
      } else {
        setContent('Content not found.');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent('Error loading content. Please try again.');
    }
  };


  const handleNext = () => {
    if (currentFile < totalFiles) {
      setCurrentFile(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFile > 1) {
      setCurrentFile(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden">
        {/* Banner Image */}
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

        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : (
              <div className="whitespace-pre-wrap">
                <p>{content}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentFile === 1 || isLoading}
            className={`flex items-center ${
              currentFile === 1 || isLoading
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Module {currentFile} of {totalFiles}
          </span>
          <button
            onClick={handleNext}
            disabled={currentFile === totalFiles || isLoading}
            className={`flex items-center ${
              currentFile === totalFiles || isLoading
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