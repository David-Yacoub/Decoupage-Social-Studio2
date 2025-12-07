import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Settings, Wand2, Info } from 'lucide-react';
import { SocialPlatform, ToneStyle, AnalysisResult } from './types';
import { generateSocialPosts } from './services/geminiService';
import PostCard from './components/PostCard';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    SocialPlatform.Instagram, 
    SocialPlatform.Pinterest
  ]);
  const [selectedTone, setSelectedTone] = useState<ToneStyle>(ToneStyle.Artistic);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("Image size too large. Please upload an image under 10MB.");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    if (!selectedImage || selectedPlatforms.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Strip the data:image/xyz;base64, prefix
        const base64Data = base64String.split(',')[1];
        const mimeType = selectedImage.type;

        try {
          const analysis = await generateSocialPosts(base64Data, mimeType, {
            platforms: selectedPlatforms,
            tone: selectedTone
          });
          setResult(analysis);
        } catch (err: any) {
            console.error(err);
            setError("Failed to generate posts. Please try again later or check your API key.");
        } finally {
          setIsGenerating(false);
        }
      };
    } catch (err) {
      setError("Error processing image.");
      setIsGenerating(false);
    }
  };

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-[#fdf8f6] text-gray-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-craft-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-craft-500 text-white p-2 rounded-lg">
              <Wand2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-craft-800 tracking-tight">
              Decoupage<span className="text-craft-500">Studio</span>
            </h1>
          </div>
          <div className="text-sm font-medium text-craft-600 hidden sm:block">
            AI Social Media Assistant
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Image Upload Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-craft-200">
              <h2 className="text-lg font-serif font-semibold mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-craft-500" />
                Creation Photo
              </h2>
              
              {!imagePreview ? (
                <div 
                  className="border-2 border-dashed border-craft-300 rounded-xl p-8 text-center hover:bg-craft-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  <div className="w-12 h-12 bg-craft-100 text-craft-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-craft-800 font-medium">Click to upload photo</p>
                  <p className="text-craft-400 text-sm mt-1">JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden shadow-md group">
                  <img 
                    src={imagePreview} 
                    alt="Upload preview" 
                    className="w-full h-auto object-cover max-h-80" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={clearImage}
                      className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-craft-200">
              <h2 className="text-lg font-serif font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-craft-500" />
                Post Settings
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(SocialPlatform).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedPlatforms.includes(platform)
                          ? 'bg-craft-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                {selectedPlatforms.length === 0 && (
                  <p className="text-red-500 text-xs mt-2">Select at least one platform.</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice & Tone</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(ToneStyle).map((tone) => (
                    <label 
                      key={tone} 
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTone === tone 
                          ? 'border-craft-500 bg-craft-50 ring-1 ring-craft-500' 
                          : 'border-gray-200 hover:border-craft-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="tone" 
                        value={tone}
                        checked={selectedTone === tone}
                        onChange={() => setSelectedTone(tone)}
                        className="w-4 h-4 text-craft-600 border-gray-300 focus:ring-craft-500 mr-3"
                      />
                      <span className="text-sm text-gray-700">{tone}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedImage || selectedPlatforms.length === 0 || isGenerating}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 ${
                  !selectedImage || selectedPlatforms.length === 0 || isGenerating
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-craft-600 to-craft-500 hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Posts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start">
                <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!result && !isGenerating && !selectedImage && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20 border-2 border-dashed border-craft-200 rounded-3xl bg-white/50">
                <div className="w-16 h-16 bg-craft-100 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-craft-400" />
                </div>
                <p className="text-lg font-medium text-craft-800">No image selected</p>
                <p className="text-sm text-craft-500">Upload your decoupage art to get started</p>
              </div>
            )}

            {isGenerating && <LoadingState />}

            {result && !isGenerating && (
              <div className="space-y-8 animate-fade-in">
                {/* Analysis Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-craft-200">
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">AI Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-craft-500 uppercase tracking-wider mb-2">Visual Breakdown</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.visualDescription}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-craft-500 uppercase tracking-wider mb-2">Craftsmanship Details</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.craftsmanshipDetails}</p>
                    </div>
                  </div>
                </div>

                {/* Generated Posts */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center">
                    <span>Generated Posts</span>
                    <span className="ml-3 text-sm font-sans font-normal bg-craft-100 text-craft-700 px-3 py-1 rounded-full">
                      {result.posts.length} Options
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {result.posts.map((post, idx) => (
                      <PostCard key={idx} post={post} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
