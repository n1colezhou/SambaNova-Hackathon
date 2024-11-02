import React, { useState } from 'react';
import { Link, Calendar, NotebookPen } from 'lucide-react';
import GetStarted from './components/GetStarted';
import NotionConnect from './components/NotionConnect';
import EventSchedule from './components/EventSchedule';
import Success from './components/Success';

const App = () => {
  const [step, setStep] = useState(0);
  const [notionUrl, setNotionUrl] = useState('');
  const [events, setEvents] = useState([]);

  const handleExportToNotion = () => {
    setStep(3);
  };

  return (
    <div className="App w-[400px] h-[500px] p-[10px] box-border outline outline-1 outline-gray-300 bg-white">
      <div className="h-full flex flex-col">
        {step > 0 && (
          <div className="flex items-center justify-between mb-6 px-2 animate-fadeIn">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
              <Link className="w-5 h-5" />
              <span className="text-xs mt-1">Connect</span>
            </div>
            <div className={`h-px w-12 transition-colors duration-500 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
              <Calendar className="w-5 h-5" />
              <span className="text-xs mt-1">Events</span>
            </div>
            <div className={`h-px w-12 transition-colors duration-500 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
              <NotebookPen className="w-5 h-5" />
              <span className="text-xs mt-1">Export</span>
            </div>
          </div>
        )}

        {step === 0 && <GetStarted onGetStarted={() => setStep(1)} />}
        
        {step === 1 && (
          <NotionConnect 
            onSuccess={(url, fetchedEvents) => {
              setNotionUrl(url);
              setEvents(fetchedEvents);
              setStep(2);
            }} 
          />
        )}
        
        {step === 2 && (
          <EventSchedule 
            events={events} 
            onUpdateEvents={setEvents}
            onExport={handleExportToNotion}
          />
        )}
        
        {step === 3 && (
          <Success notionUrl={notionUrl} />
        )}
      </div>
    </div>
  );
};

export default App;