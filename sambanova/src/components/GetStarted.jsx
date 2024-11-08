import React from 'react';
import { 
  Link, 
  ArrowRight,
  CalendarCheck,
  Sparkles
} from 'lucide-react';

const GetStarted = ({ onGetStarted }) => (
  <div className="animate-fadeIn flex flex-col items-center justify-center h-full text-center px-4 space-y-8">
    <h1 className="text-xl font-bold text-gray-800">
      Sync
    </h1>
    <a href="https://api.notion.com/v1/oauth/authorize?client_id=136d872b-594c-8013-b929-003746f7e5f7&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fsync-redirectpage.netlify.app%2F" target="_blank">Integration Link</a>
    <div className="space-y-6">
      <div className="flex items-start gap-3 text-left animate-slideUp delay-100">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Link className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Connect Notion</h3>
          <p className="text-sm text-gray-600">Paste your Notion page URL to start the sync process</p>
        </div>
      </div>

      <div className="flex items-start gap-3 text-left animate-slideUp delay-200">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <CalendarCheck className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Review Events</h3>
          <p className="text-sm text-gray-600">Check and confirm your course schedule and events</p>
        </div>
      </div>

      <div className="flex items-start gap-3 text-left animate-slideUp delay-300">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-green-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Generate Study Plan</h3>
          <p className="text-sm text-gray-600">Get an AI-powered study schedule based on your events</p>
        </div>
      </div>
    </div>

    <button
      onClick={onGetStarted}
      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium animate-fadeIn delay-500 transform hover:scale-[1.02] transition-all"
    >
      Get Started
      <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

export default GetStarted;