import React, { useState } from 'react';
import { Calendar, Brain, Sparkles, ArrowRight } from 'lucide-react';

// This is a reusable component for each prompt option
const PromptOption = ({ icon: Icon, title, description, onClick, disabled, isSelected }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-3 rounded-lg border-2 text-left transition-all 
      ${disabled
        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
        : isSelected
          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 ring-2 ring-blue-200'
          : 'border-blue-100 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
      }`}
  >
    <div className="flex gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all
        ${disabled 
          ? 'bg-gray-100' 
          : isSelected 
            ? 'bg-gradient-to-r from-blue-400 to-indigo-400' 
            : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'}`}>

        <Icon className={`w-3.5 h-3.5 ${disabled ? 'text-gray-400' : 'text-white'}`} />
      </div>
      <div>
        <h3 className={`font-medium text-sm ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-xs mt-0.5 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  </button>
);

const SelectPromptOptions = ({ onSelect }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const handleSelectPrompt = (promptKey) => {
    setSelectedPrompt(promptKey);
  };

  const handleContinue = () => {
    if (selectedPrompt) {
      onSelect(selectedPrompt);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn pt-2">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center p-1 mb-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100">
          <span className="text-xs font-medium bg-white px-3 py-0.5 rounded-full text-blue-600">
            Choose Your Path
          </span>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Select Study Mode
        </h1>
        <p className="text-xs text-gray-600">
          Choose how you want to organize your study schedule
        </p>
      </div>

      <div className="space-y-2 px-1">
        <PromptOption
          icon={Calendar}
          title="Basic Schedule"
          description="Simple event extraction and study planning"
          onClick={() => handleSelectPrompt('prompt1')}  // Use specific prompt key
          isSelected={selectedPrompt === 'prompt1'}
        />

        <PromptOption
          icon={Brain}
          title="Advanced Analysis"
          description="Comprehensive study strategy with AI insights"
          onClick={() => handleSelectPrompt('prompt2')}  // Use specific prompt key
          disabled={false}
          isSelected={selectedPrompt === 'prompt2'}
        />

        <PromptOption
          icon={Sparkles}
          title="Custom Learning"
          description="Personalized learning path optimization"
          onClick={() => handleSelectPrompt('prompt3')}  // Use specific prompt key
          disabled={false}
          isSelected={selectedPrompt === 'prompt3'}
        />

        <button
          onClick={handleContinue}  // When the user clicks continue, call the selected prompt
          disabled={!selectedPrompt}
          className="group w-full relative rounded-xl transition-all duration-200 mt-4"
        >
          <div className={`absolute -inset-0.5 rounded-xl blur opacity-60 transition duration-200
            ${selectedPrompt 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:opacity-100' 
              : 'bg-gray-200 opacity-40'}`}
/>
          <div className={`relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-medium transition-all duration-200
            ${selectedPrompt 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg' 
              : 'bg-gray-100 text-gray-400'}`}>
            {selectedPrompt ? 'Continue' : 'Select a Study Mode'}
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelectPromptOptions;
