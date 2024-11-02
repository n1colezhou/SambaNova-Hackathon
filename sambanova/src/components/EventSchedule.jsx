import React, { useState } from 'react';
import { Calendar, NotebookPen, Edit2, Check, X } from 'lucide-react';

const EventCard = ({ dayEvents, onUpdate }) => {
  const safeEvents = dayEvents.events?.map(event => ({
    description: event?.description || '',
    details: event?.details || ''
  })) || [];

  const [isEditing, setIsEditing] = useState(false);
  const [editedEvents, setEditedEvents] = useState(safeEvents);

  const handleSave = () => {
    onUpdate({
      ...dayEvents,
      events: editedEvents
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvents(safeEvents);
    setIsEditing(false);
  };

  const updateEvent = (index, field, value) => {
    const newEvents = [...editedEvents];
    newEvents[index] = {
      ...newEvents[index],
      [field]: value
    };
    setEditedEvents(newEvents);
  };

  return (
    <div className="p-3 border border-gray-200 rounded-md shadow-sm bg-white hover:border-blue-200 hover:shadow-md transition-all animate-slideUp">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          {dayEvents.date}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-600"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {editedEvents.map((event, eventIdx) => (
        <div key={eventIdx} className="ml-6 mt-2">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={event.description}
                onChange={(e) => updateEvent(eventIdx, 'description', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Event description"
              />
              <input
                type="text"
                value={event.details}
                onChange={(e) => updateEvent(eventIdx, 'details', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="Event details"
              />
            </div>
          ) : (
            <>
              <p className="font-medium text-gray-700 text-sm">
                {event.description || 'No description'}
              </p>
              <p className="text-xs text-gray-600">
                {event.details || 'No details'}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const EventSchedule = ({ events = [], onUpdateEvents, onExport }) => {
  // Ensure events is an array and each event has required structure
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

      <div className="mt-auto px-4 pb-4 bg-white">
        <button 
          onClick={onExport}
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
    </div>
  );
};

export default EventSchedule;