import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {supabase} from '../backend/supabaseClient';

// Dictionary interface
interface DictionaryEntry {
  word: string;
  description: string;
}

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
  
  // Dictionary state
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [hoveredDefinition, setHoveredDefinition] = useState<string | null>(null);
  const [definitionPosition, setDefinitionPosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });

  const courseFileMap: { [key: number]: number } = {
    1: 42,
    2: 49,
    3: 25,
    4: 37,
    5: 29,
    6: 15,
    7: 27,
    8: 31,
    9: 31,
  };

  // Load dictionary on component mount
  useEffect(() => {
    loadDictionary();
  }, []);

  // Original content load effect
  useEffect(() => {
    if (isOpen) {
      loadAllContent(courseNumber);
    }
  }, [isOpen, courseNumber]);

  const loadDictionary = async () => {
    try {
      // Fetch data from the 'dictionary' table
      const { data, error } = await supabase
        .from('dictionary')
        .select('word, description');
  
      if (error) {
        throw error;
      }
      
      console.log("dictionary data", data)
      // Transform the data into the desired format
      const dictionaryEntries = data.map((entry) => ({
        word: entry.word,
        description: entry.description,
      }));
  
      // Set the dictionary state (assuming `setDictionary` is a state setter function)
      setDictionary(dictionaryEntries);
      console.log(dictionaryEntries)

    } catch (err) {
      console.error('Error loading dictionary:', err);
    }
  };

  // Enhanced content formatting to add dictionary identifiers
  const formatContentWithDictionaryIdentifiers = (content: string) => {
    if (!content) return { title: '', header: '', subheader: '', body: '' };
    
    const lines = content.split('\n');
    const title = lines[0] || '';
    const header = lines[1] || '';
    const subheader = lines[2] || '';
    
    // Add dictionary identifiers to words
    const bodyWithIdentifiers = lines.slice(3).map(line => {
      return line.split(/\s+/).map(word => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const dictEntry = dictionary.find(entry => 
          entry.word.toLowerCase() === cleanWord
        );
        
        return dictEntry 
          ? `<span class="dictionary-word cursor-help hover:underline" data-identifier="${dictEntry.word}">${word}</span>` 
          : word;
      }).join(' ');
    }).join('\n');

    return { 
      title, 
      header, 
      subheader, 
      body: bodyWithIdentifiers 
    };
  };

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

  // Handle dictionary word hover
  const handleWordHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const identifier = target.getAttribute('data-identifier');
    
    if (identifier) {
      const entry = dictionary.find(d => d.word === identifier);
      if (entry) {
        setHoveredDefinition(entry.description);
        setDefinitionPosition({ 
          x: e.clientX + 5, 
          y: e.clientY + 5 
        });
      }
    }
  };

  // Clear hover definition
  const handleMouseLeave = () => {
    setHoveredDefinition(null);
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

  const formattedContent = formatContentWithDictionaryIdentifiers(content[currentFile]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden relative">
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
        
        {/* Content Section with Scrollbar and Dictionary Hover */}
        <div 
          className="p-6 h-96 overflow-y-auto relative" 
          onMouseOver={handleWordHover}
          onMouseLeave={handleMouseLeave}
        >
          <div className="prose max-w-none">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {formattedContent.title}
                </h1>
                <h1 className="text-3xl font-bold text-gray-900">
                  {formattedContent.header}
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                  {formattedContent.subheader}
                </h2>
                <div 
                  className="whitespace-pre-wrap text-gray-600"
                  dangerouslySetInnerHTML={{ __html: formattedContent.body }}
                />
              </div>
            )}
          </div>

          {/* Dictionary Popup */}
          {hoveredDefinition && (
            <div 
              className="fixed bg-white shadow-lg rounded-md p-4 z-50 border border-gray-200"
              style={{ 
                top: definitionPosition.y, 
                left: definitionPosition.x 
              }}
            >
              <div className="flex items-center mb-2">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-semibold text-gray-700">Definition</span>
              </div>
              <p className="text-gray-600">{hoveredDefinition}</p>
            </div>
          )}
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

export default ContentWindow;