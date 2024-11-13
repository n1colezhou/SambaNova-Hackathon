import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import GetStarted from './components/GetStarted';
import NotionConnect from './components/NotionConnect';
import EventSchedule from './components/EventSchedule';
import Success from './components/Success';
import SelectPromptOptions from './components/SelectPromptOptions';
import Login from './components/Login';
import { retrieveAndExchangeToken } from './notionUtils';

const App = () => {
  const [step, setStep] = useState(-1);
  const [notionUrl, setNotionUrl] = useState('');
  const [events, setEvents] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        chrome.storage.local.get('integrationCode', async (result) => {
          const token = result.integrationCode;
          console.log(token)

          if (token) {
            handlePageTransition(0);
          } else {
              handlePageTransition(-1);
            }
          
        });
      } catch (error) {
        console.error('Error retrieving token:', error);
        handlePageTransition(-1);
      }
    };
    retrieveToken();
  }, []);

  const handlePageTransition = (newStep) => {
    setIsAnimating(true);
    setStep(newStep);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const handleBack = () => {
    if (step === 0 && localStorage.getItem('integrationCode')) {
      chrome.storage.local.remove('integrationCode');
    }
    handlePageTransition(Math.max(-1, step - 1));
  };

  const handleNotionConnect = async () => {
    try {
      const authorizationUrl = 'https://api.notion.com/v1/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI';
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Error connecting to Notion:', error);
      handlePageTransition(-1);
    }
  };
  
  const exchangeAuthorizationCode = async (authorizationCode) => {
    try {
      const token = await retrieveAndExchangeToken(authorizationCode);
      if (token) {
        chrome.storage.local.set({ integrationCode: token });
        handlePageTransition(0);
      } else {
        handlePageTransition(-1);
      }
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      handlePageTransition(-1);
    }
  };
  
  const authorizationCode = new URLSearchParams(window.location.search).get('code');
  if (authorizationCode) {
    exchangeAuthorizationCode(authorizationCode);
  }

  const handlePromptSelect = (promptType) => {
    if (promptType === 'prompt1') {
      handlePageTransition(1);
    }
  };

  const handleEventSuccess = (url, fetchedEvents) => {
    setNotionUrl(url);
    setEvents(fetchedEvents);
    handlePageTransition(3);
  };

  const handleExportToNotion = () => {
    handlePageTransition(4);
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
          {step > -1 && (
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
          )}
        </div>

        {step > 0 && (
          <div className="flex items-center justify-between mb-6 px-2 animate-fadeIn">
          </div>
        )}

        <div className="flex-1 relative">
          <div key={step} className={pageClasses}>
            {step === -1 && (
              <Login
                onNotionConnect={handleNotionConnect}
                isDark={isDark}
              />
            )}

            {step === 0 && (
              <SelectPromptOptions 
                onSelect={handlePromptSelect} 
                isDark={isDark}
              />
            )}
            
            {step === 1 && (
              <GetStarted 
                onGetStarted={() => handlePageTransition(2)} 
                isDark={isDark} 
              />
            )}
            
            {step === 2 && (
              <NotionConnect
                onSuccess={handleEventSuccess}
                isDark={isDark}
              />
            )}
            
            {step === 3 && (
              <EventSchedule
                events={events}
                notionUrl={notionUrl}
                onUpdateEvents={setEvents}
                onExport={handleExportToNotion}
                isDark={isDark}
              />
            )}
            
            {step === 4 && (
              <Success 
                notionUrl={notionUrl} 
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
