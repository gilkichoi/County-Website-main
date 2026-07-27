import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

export function ImageLightboxModal({
  images,
  initialIndex = 0,
  title,
  onClose
}: ImageLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          title="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title & Counter */}
        <div className="absolute top-4 left-4 z-50 text-white">
          {title && <h3 className="font-bold text-sm sm:text-base text-gray-100">{title}</h3>}
          <span className="text-xs text-gray-400 font-semibold">
            Photo {currentIndex + 1} of {images.length}
          </span>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Image */}
        <div className="max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center p-2">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery photo ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            title="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Thumbnails row at bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-black/60 p-2 rounded-2xl border border-white/10 overflow-x-auto max-w-[90vw] hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  idx === currentIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
