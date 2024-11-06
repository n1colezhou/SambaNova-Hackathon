
import React, { useState } from 'react';
import { Calendar, Edit2, Check, X } from 'lucide-react';

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
            <button onClick={handleSave} className="text-green-500 hover:text-green-600">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-600">
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

export default EventCard;