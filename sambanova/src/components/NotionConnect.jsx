import React, { useState } from 'react';
import { Link, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { generateChatCompletion } from '../api/chatCompletions';

const NotionConnect = ({ initialUrl = '', onSuccess }) => {
  const [notionUrl, setNotionUrl] = useState(initialUrl);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateNotionUrl = (url) => {
    return url.includes('notion.so/');
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setNotionUrl(url);
    setIsUrlValid(validateNotionUrl(url));
    setError(null);
  };

  function extractPageText() {
    return document.body.innerText;
  }

  const formatEventsData = (apiResponse) => {
    try {
      const data = typeof apiResponse === 'string' ? JSON.parse(apiResponse) : apiResponse;

      const formattedEvents = Object.entries(data).map(([date, eventData]) => ({
        date,
        events: Array.isArray(eventData.event) ? eventData.event : [eventData.event]
      }));
  
      return formattedEvents;
    } catch (error) {
      console.error('Error formatting events:', error);
      throw new Error('Failed to format event data properly');
    }
  };
  
  
  const handleButtonClick = () => {
    setLoading(true);
    setError(null);
  
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      window.chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractPageText
        },
        async (results) => {
          try {
            if (chrome.runtime.lastError) {
              throw new Error(chrome.runtime.lastError.message);
            }
  
            const pageText = results[0].result.trim();
            
            if (!pageText) {
              throw new Error('No content found on the page');
            }
  
            const messages = [
              { role: "user", content: pageText }
            ];
  
            const apiResponse = await generateChatCompletion(messages);
            const responseContent = apiResponse.choices[0].message.content;
            
            const formattedEvents = formatEventsData(responseContent);
            
            if (formattedEvents.length === 0) {
              throw new Error('No events found in the response');
            }
  
            onSuccess(notionUrl, formattedEvents);
  
          } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setLoading(false);
          }
        }
      );
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="text-center px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center justify-center gap-2">
          <Link className="w-5 h-5 text-blue-500" />
          Connect to Notion
        </h2>
        <p className="text-sm text-gray-600">
          Open your Notion page, then click "Get Events" to extract your schedule.
        </p>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="relative">
          <input
            type="url"
            placeholder="notion.so/your-page-url"
            value={notionUrl}
            onChange={handleUrlChange}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Link className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        
        {notionUrl && !isUrlValid && (
          <div className="flex items-center gap-1 text-red-500 text-sm animate-fadeIn">
            <span className="block w-1 h-1 rounded-full bg-red-500" />
            Please enter a valid Notion URL
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 animate-fadeIn">
          <div className="flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error Extracting Events
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleButtonClick}
        disabled={!isUrlValid || loading}
        className={`group w-full relative rounded-xl transition-all duration-200
          ${!isUrlValid || loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg'
          }`}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200" />
        <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-medium text-gray-900 group-hover:text-white transition-all duration-200">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extracting Events...
            </>
          ) : (
            <>
              Get Events
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-2.5 h-2.5 text-white" />
              </div>
            </>
          )}
        </div>
      </button>

      <div className="mt-3 p-4 bg-blue-50 rounded-md animate-fadeIn">
        <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4" />
          Quick Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 ml-6 list-disc">
          <li>Make sure your Notion page is open in another tab</li>
          <li>The page should be public or shared</li>
          <li>Dates should be clearly visible in the page</li>
        </ul>
      </div>
    </div>
  );
};

export default NotionConnect;