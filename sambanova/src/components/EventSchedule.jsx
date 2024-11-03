import React, { useState } from 'react';
import { Calendar, NotebookPen, Edit2, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { CONFIG } from '../config';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] max-w-md w-full animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
};

const extractPageId = (notionUrl) => {
  const matches = notionUrl.match(/([a-zA-Z0-9]{32})/);
  return matches ? matches[1] : null;
};

const createNotionCalendar = async (pageId, events, title) => {
  try {
    const database = await fetch('https://api.notion.com/v1/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.NOTION_API_KEY}`,
        'Notion-Version': CONFIG.NOTION_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: {
          type: "page_id",
          page_id: pageId,
        },
        icon: {
          type: "emoji",
          emoji: "📅"
        },
        title: [
          {
            type: "text",
            text: {
              content: title,
              link: null
            }
          }
        ],
        properties: {
          Event: {
            title: {}
          },
          Date: {
            type: "date",
            date: {}
          },
          Details: {
            type: "rich_text",
            rich_text: {}
          }
        },
        is_inline: true
      })
    });

    if (!database.ok) {
      const error = await database.json();
      throw new Error(error.message || 'Failed to create calendar database');
    }

    const dbData = await database.json();
    const validEvents = [];
    
    for (const dayEvent of events) {
      if (!isValidISODate(dayEvent.date)) continue;

      for (const event of dayEvent.events) {
        if (!event.description?.trim()) continue;

        validEvents.push({
          parent: { 
            type: "database_id",
            database_id: dbData.id 
          },
          properties: {
            Event: {
              title: [
                {
                  text: {
                    content: event.description
                  }
                }
              ]
            },
            Date: {
              date: {
                start: dayEvent.date
              }
            },
            Details: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: event.details || ''
                  }
                }
              ]
            }
          }
        });
      }
    }

    // Create events in batches of 100
    const batchSize = 100;
    for (let i = 0; i < validEvents.length; i += batchSize) {
      const batch = validEvents.slice(i, i + batchSize);
      
      // Create pages in parallel for better performance
      await Promise.all(batch.map(pageData => 
        fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONFIG.NOTION_API_KEY}`,
            'Notion-Version': CONFIG.NOTION_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData)
        })
      ));
    }

    return dbData;
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
};

const isValidISODate = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);

  return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}/);
};
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

  const handleExportClick = () => {
    setShowModal(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      if (!CONFIG.NOTION_API_KEY) {
        throw new Error('Missing Notion API key in environment variables');
      }

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
          onClick={handleExportClick}
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
            <div className="text-sm text-red-600">
              {exportError}
            </div>
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