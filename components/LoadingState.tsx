import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-craft-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg mb-6 animate-bounce">
          <Sparkles className="w-8 h-8 text-craft-600" />
        </div>
      </div>
      <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
        Crafting your posts...
      </h3>
      <p className="text-gray-500 max-w-sm">
        Analyzing your decoupage details, identifying patterns, and writing the perfect captions.
      </p>
    </div>
  );
};

export default LoadingState;
