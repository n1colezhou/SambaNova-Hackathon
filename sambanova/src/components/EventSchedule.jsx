import React, { useState } from 'react';
import { Calendar, NotebookPen, Loader2, AlertCircle } from 'lucide-react';
import { createNotionCalendar, extractPageId } from '../notionUtils';
import Modal from './Modal';
import EventCard from './EventCard';

const EventSchedule = ({ events = [], onUpdateEvents, onExport, notionUrl }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('Course Schedule');
  
  const validEvents = Array.isArray(events) ? events.map(event => ({
    date: event.date || 'No date',
    events: Array.isArray(event.events) ? event.events : []
  })) : [];

  const handleUpdateEvent = (updatedDayEvents) => {
    const newEvents = validEvents.map(dayEvents => 
      dayEvents.date === updatedDayEvents.date ? updatedDayEvents : dayEvents
    );
    onUpdateEvents(newEvents);
  };

  const handleExport = async () => {
   
    setIsExporting(true);
    setExportError(null);
    
    try {

      if (!title.trim()) {
        throw new Error('Please enter a title for your calendar');
      }

      const pageId = extractPageId(notionUrl);
      if (!pageId) {
        throw new Error('Invalid Notion URL format');
      }

      await createNotionCalendar(pageId, validEvents, title);
      setShowModal(false);
      onExport();
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Review Events
        </h2>
        <p className="text-sm text-gray-600">
          These events will be used to create your study plan. Click the edit icon to make changes.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 pb-4">
        <div className="space-y-3">
          {validEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No events found. Please go back and try again.
            </div>
          ) : (
            validEvents.map((dayEvents, idx) => (
              <EventCard 
                key={idx}
                dayEvents={dayEvents}
                onUpdate={handleUpdateEvent}
              />
            ))
          )}
        </div>
      </div>

      {exportError && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{exportError}</p>
          </div>
        </div>
      )}

      <div className="mt-auto px-4 pb-4 bg-white">
        <button 
          onClick={() => setShowModal(true)}
          disabled={validEvents.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transform hover:scale-[1.02] transition-all
            ${validEvents.length === 0
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          Export to Notion
          <NotebookPen className="w-4 h-4" />
        </button>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Export to Notion"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 block">Calendar Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter calendar title"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isExporting}
            />
          </div>

          {exportError && (
            <div className="text-sm text-red-600">{exportError}</div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setShowModal(false)}
              disabled={isExporting}
              className="flex-1 py-2 px-4 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || !title.trim()}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isExporting || !title.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventSchedule;