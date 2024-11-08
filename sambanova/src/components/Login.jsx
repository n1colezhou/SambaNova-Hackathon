import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

const Login = ({ isDark }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn px-3">
      <div className="text-center space-y-4 mb-5">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <div className="absolute top-5 -left-10">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse delay-100" />
              </div>
              <div className="absolute top-3 -right-8">
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse delay-200" />
              </div>
            </div>
          </div>
          <div className="w-18 h-18 mx-auto relative">
            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl rotate-12 absolute" />
            <div className="w-full h-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl -rotate-12 absolute" />
            <div className="w-full h-full bg-white rounded-2xl shadow-sm flex items-center justify-center relative">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl rotate-45 transform origin-center transition-transform group-hover:rotate-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
              Welcome to Sync
            </span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Sync.ai
          </h1>
          <p className="text-sm text-gray-600 max-w-[250px] mx-auto leading-relaxed">
            Elevate your learning experience with AI-powered study plans
          </p>
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="rounded-xl p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-2.5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
            Premium Features
          </h3>
          <ul className="space-y-2">
            {[
              'Smart schedule optimization',
              'AI study plan generation',
              'Seamless Notion integration'
            ].map((feature, index) => (
              <li key={index} 
                className="flex items-start gap-2 text-sm text-gray-700 bg-white/80 py-1.5 px-3 rounded-lg border border-blue-100/50"
              >
                <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-1.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://api.notion.com/v1/oauth/authorize?client_id=136d872b-594c-8013-b929-003746f7e5f7&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fsync-redirectpage.netlify.app%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full relative rounded-xl transition-all duration-200 block"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200" />
          <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transition-all duration-200">
            Connect to Notion
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Login;