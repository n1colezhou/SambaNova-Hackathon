import React, { useState } from 'react';
import { Link, Calendar, NotebookPen, ArrowLeft, Sun, Moon } from 'lucide-react';
import GetStarted from './components/GetStarted';
import NotionConnect from './components/NotionConnect';
import EventSchedule from './components/EventSchedule';
import Success from './components/Success';

const App = () => {
  const [step, setStep] = useState(0);
  const [notionUrl, setNotionUrl] = useState('');
  const [events, setEvents] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleExportToNotion = () => {
    handlePageTransition(3);
  };

  const handleBack = () => {
    handlePageTransition(Math.max(0, step - 1));
  };

  const handlePageTransition = (newStep) => {
    setIsAnimating(true);
    setStep(newStep);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const handleNotionConnect = (url, fetchedEvents) => {
    setNotionUrl(url);
    setEvents(fetchedEvents);
    handlePageTransition(2);
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const pageClasses = `
    absolute top-0 left-0 w-full h-full
    transition-all duration-500
    ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
  `;

  return (
    <div className={`App w-96 h-[600px] p-4 box-border rounded-lg shadow-lg transition-colors duration-200
      ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {step > 0 ? (
            <button 
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors
                ${isDark 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6 px-2 animate-fadeIn">
          <div className={`flex flex-col items-center ${
            step >= 1 
              ? 'text-blue-500' 
              : isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <Link className="w-5 h-5" />
            <span className="text-xs mt-1">Connect</span>
          </div>
          <div className={`h-px w-12 transition-colors duration-500 ${
            step >= 2 
              ? 'bg-blue-500' 
              : isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`} />
          <div className={`flex flex-col items-center ${
            step >= 2 
              ? 'text-blue-500' 
              : isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Events</span>
          </div>
          <div className={`h-px w-12 transition-colors duration-500 ${
            step >= 3 
              ? 'bg-blue-500' 
              : isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`} />
          <div className={`flex flex-col items-center ${
            step >= 3 
              ? 'text-blue-500' 
              : isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <NotebookPen className="w-5 h-5" />
            <span className="text-xs mt-1">Export</span>
          </div>
        </div>

        <div className="flex-1 relative">
          <div key={step} className={pageClasses}>
            {step === 0 && (
              <GetStarted 
                onGetStarted={() => handlePageTransition(1)} 
                isDark={isDark} 
              />
            )}
            
            {step === 1 && (
              <NotionConnect
                onSuccess={handleNotionConnect}
                isDark={isDark}
              />
            )}
            
            {step === 2 && (
              <EventSchedule
                events={events}
                notionUrl={notionUrl}
                onUpdateEvents={setEvents}
                onExport={handleExportToNotion}
                isDark={isDark}
              />
            )}
            
            {step === 3 && (
              <Success notionUrl={notionUrl} isDark={isDark} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;