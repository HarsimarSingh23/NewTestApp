import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../backend/supabaseClient';

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

interface CollapsibleSection {
  title: string;
  content: string;
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
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  
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

  useEffect(() => {
    loadDictionary();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAllContent(courseNumber);
    }
  }, [isOpen, courseNumber]);

  const loadDictionary = async () => {
    try {
      const { data, error } = await supabase
        .from('dictionary')
        .select('word, description');
  
      if (error) {
        throw error;
      }
      
      const dictionaryEntries = data.map((entry) => ({
        word: entry.word,
        description: entry.description,
      }));
  
      setDictionary(dictionaryEntries);
    } catch (err) {
      console.error('Error loading dictionary:', err);
    }
  };

  const parseCollapsibleSections = (text: string): { regularContent: string, collapsibleSections: CollapsibleSection[] } => {
    const sections: CollapsibleSection[] = [];
    let regularContent = '';
    
    const lines = text.split('\n');
    let isInCollapsibleSection = false;
    let currentSection: CollapsibleSection = { title: '', content: '' };
    
    lines.forEach(line => {
      if (line.startsWith('>>>')) {
        isInCollapsibleSection = true;
        currentSection = {
          title: line.slice(3).trim(),
          content: ''
        };
      } else if (line.startsWith('<<<') && isInCollapsibleSection) {
        isInCollapsibleSection = false;
        sections.push(currentSection);
      } else if (isInCollapsibleSection) {
        currentSection.content += line + '\n';
      } else {
        regularContent += line + '\n';
      }
    });

    return { regularContent, collapsibleSections: sections };
  };

  const formatContentWithDictionaryIdentifiers = (content: string) => {
    if (!content) return { title: '', header: '', subheader: '', body: '', collapsibleSections: [] };
    
    const lines = content.split('\n');
    const title = lines[0] || '';
    const header = lines[1] || '';
    const subheader = lines[2] || '';
    
    const remainingContent = lines.slice(3).join('\n');
    const { regularContent, collapsibleSections } = parseCollapsibleSections(remainingContent);
    
    const processText = (text: string) => {
      // Split by lines first to preserve line breaks
      return text.split('\n').map(line => {
        // Process each line separately
        const processedLine = line.split(/(\s+)/).map(part => {
          // Keep whitespace as is
          if (part.trim() === '') return part;
          
          const cleanWord = part.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const dictEntry = dictionary.find(entry => 
            entry.word.toLowerCase() === cleanWord
          );
          
          return dictEntry 
            ? `<span class="dictionary-word cursor-help hover:underline" data-identifier="${dictEntry.word}">${part}</span>` 
            : part;
        }).join('');

        // Convert bullet points to proper HTML
        return line.trim().startsWith('•') 
          ? `<div class="flex items-start space-x-2 my-1">
              <span class="text-gray-500 mt-1">•</span>
              <span>${processedLine.slice(1)}</span>
            </div>`
          : `<div>${processedLine}</div>`;
      }).join('\n');
    };

    const bodyWithIdentifiers = processText(regularContent);
    const processedSections = collapsibleSections.map(section => ({
      ...section,
      content: processText(section.content)
    }));

    return { 
      title, 
      header, 
      subheader, 
      body: bodyWithIdentifiers,
      collapsibleSections: processedSections
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

  const handleMouseLeave = () => {
    setHoveredDefinition(null);
  };

  const toggleSection = (index: number) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(index)) {
      newExpandedSections.delete(index);
    } else {
      newExpandedSections.add(index);
    }
    setExpandedSections(newExpandedSections);
  };

  const handleNext = () => {
    if (currentFile < totalFiles - 1) {
      setCurrentFile(currentFile + 1);
      setExpandedSections(new Set());
    }
  };

  const handlePrevious = () => {
    if (currentFile > 0) {
      setCurrentFile(currentFile - 1);
      setExpandedSections(new Set());
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
        
        <div 
          className="p-6 h-[calc(100vh-16rem)] overflow-y-auto relative" 
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {formattedContent.title}
                </h1>
                {formattedContent.header && (
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {formattedContent.header}
                  </h2>
                )}
                {formattedContent.subheader && (
                  <h3 className="text-xl font-medium text-gray-700 mb-4">
                    {formattedContent.subheader}
                  </h3>
                )}

                

                <div 
                  className="text-gray-600 space-y-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formattedContent.body }}
                />

            {formattedContent.collapsibleSections.map((section, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden mb-4">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{section.title}</span>
                      {expandedSections.has(index) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.has(index) && (
                      <div 
                        className="p-4 bg-white text-gray-600 space-y-2"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    )}
                  </div>
                ))}
            
                
              </div>
            )}
          </div>

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