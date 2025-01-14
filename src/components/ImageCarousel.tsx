import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dynamically import all images from the folder using import.meta.glob
const imageFiles = import.meta.glob('../img/Courses/Course1/*.png', { eager: false });

// Define the correct type for the imported images
type ImageModule = { default: string };
const images = Object.values(imageFiles).map((importFn) =>
  (importFn as () => Promise<ImageModule>)().then((module) => module.default)
);

export function ImageCarousel({ onClose }: { onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    // Load images dynamically
    Promise.all(images).then((loadedImages) => {
      setImageList(loadedImages);
    });
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const progress = imageList.length
    ? ((currentIndex + 1) / imageList.length) * 100
    : 0;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-auto">
        {imageList.length > 0 && (
          <img
            src={imageList[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-[80vh] object-contain"
          />
        )}

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white-600 text-black px-4 py-2 rounded"
        >
          Close
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md">
          <div className="bg-black/20 rounded-full h-1 mb-2">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white text-center">
            {currentIndex + 1} / {imageList.length} ({Math.round(progress)}% completed)
          </p>
        </div>
      </div>
    </div>
  );
}
