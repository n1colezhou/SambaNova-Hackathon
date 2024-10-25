// src/App.js
import React, { useState } from 'react';
import './App.css';
import { generateChatCompletion } from './api/chatCompletions';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [status, setStatus] = useState('Inactive');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setIsActive(!isActive);
    setLoading(true);

    // Show processing state
    const buttonText = isActive ? 'Activating...' : 'Processing...';

    // Inject content script to grab text from the active tab
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      window.chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractPageText
        },
        async (results) => {
          if (chrome.runtime.lastError) {
            alert('Error extracting text: ' + chrome.runtime.lastError.message);
            setLoading(false);
            return;
          }
          const pageText = results[0].result.trim();
          setExtractedText(pageText);

          const messages = [
            { role: "user", content: pageText } // User's extracted text
          ]

          try {
            console.log("API Sent");
            const apiResponse = await generateChatCompletion(messages);
            console.log(apiResponse);
          } catch (error) {
            console.error('Error generating chat completion:', error);
          }

          // Update status and button text
          setTimeout(() => {
            setStatus(isActive ? 'Inactive' : 'Active');
            setIsActive(!isActive);
            setLoading(false);
          }, 1000);
        }
      );
    });
  };

  // Content script function to extract all text from the page
  function extractPageText() {
    return document.body.innerText;  // Extracts all visible text
  }

  return (
    <div className="App">
      <button
        id="mainButton"
        onClick={handleButtonClick}
        disabled={loading}
        className={loading ? 'disabled' : ''}
      >
        {loading ? <span className="spinner"></span> : (isActive ? 'Deactivate' : 'Activate')}
      </button>
      <p>Status: <span className={isActive ? 'active' : 'inactive'}>{status}</span></p>
      <textarea
        id="textOutput"
        value={extractedText}
        readOnly
        placeholder="Extracted text will appear here..."
      />
    </div>
  );
}

export default App;
