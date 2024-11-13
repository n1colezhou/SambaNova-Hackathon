import React from 'react';
import {
  Link,
  ArrowRight,
  CalendarCheck,
  Sparkles,
  Stars
} from 'lucide-react';

const StepItem = ({ icon: Icon, title, description, color, delay }) => (
  <div className={`flex items-start gap-2.5 text-left animate-slideUp`} style={{ animationDelay: `${delay}ms` }}>
    <div className={`relative group`}>
      <div className={`absolute -inset-1.5 bg-gradient-to-r ${color} rounded-full blur-sm opacity-25 group-hover:opacity-40 transition-opacity`} />
      <div className={`relative flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <div>
      <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const GetStarted = ({ onGetStarted }) => (
  <div className="animate-fadeIn flex flex-col items-center justify-center h-full text-center px-5 py-2">
    {/* Header */}
    <div className="space-y-1 mb-5">
      <div className="relative">
        <Stars className="w-4 h-4 text-blue-400 absolute -top-4 -left-3 animate-pulse" />
        <Stars className="w-3 h-3 text-indigo-400 absolute -top-3 right-0 animate-pulse delay-100" />
        <div className="inline-flex items-center justify-center p-0.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100">
          <span className="text-xs font-medium bg-white px-2.5 py-0.5 rounded-full text-blue-600">
            How it works
          </span>
        </div>
      </div>
      <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Three Simple Steps
      </h1>
    </div>

    {/* Steps */}
    <div className="space-y-4 w-full mb-5">
      <StepItem
        icon={Link}
        title="Connect Notion"
        description="Link your Notion page to enable synchronization"
        color="from-blue-500 to-blue-600"
        delay={100}
      />
      
      <StepItem
        icon={CalendarCheck}
        title="Review Schedule"
        description="Verify your course timeline and events"
        color="from-indigo-500 to-indigo-600"
        delay={200}
      />
      
      <StepItem
        icon={Sparkles}
        title="AI Study Plan"
        description="Get a personalized study roadmap"
        color="from-purple-500 to-purple-600"
        delay={300}
      />
    </div>

    {/* Action Button */}
    <div className="w-full">
      <button
        onClick={onGetStarted}
        className="group w-full relative rounded-xl transition-all duration-200"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200" />
        <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transition-all duration-200">
          Get Started
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
      </button>
    </div>
  </div>
);

export default GetStarted;