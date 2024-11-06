import React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

const Success = ({ notionUrl }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 px-6 animate-fadeIn">
    <div className="text-center">
      <div className="animate-bounce-slow">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Successfully exported!
      </h2>
      <p className="text-sm text-gray-600">
        Your calendar and study plan have been added to your Notion page.
      </p>
    </div>
    
    <button
      onClick={() => window.open(notionUrl, '_blank')}
      className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 text-sm font-medium w-full transform hover:scale-[1.02] transition-all"
    >
      View in Notion
      <ExternalLink className="w-4 h-4" />
    </button>
  </div>
);

export default Success;