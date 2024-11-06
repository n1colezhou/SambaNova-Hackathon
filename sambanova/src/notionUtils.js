import { CONFIG } from './config';

export const extractPageId = (notionUrl) => {
  const matches = notionUrl.match(/([a-zA-Z0-9]{32})/);
  return matches ? matches[1] : null;
};

export const isValidISODate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}/);
};

const createDatabase = async (pageId, title) => {
  const response = await fetch('https://api.notion.com/v1/databases', {
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create calendar database');
  }

  return response.json();
};

const createEventPage = (dbId, event, date) => ({
  parent: { 
    type: "database_id",
    database_id: dbId 
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
        start: date
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

const createEventsInBatches = async (validEvents) => {
  const batchSize = 100;
  for (let i = 0; i < validEvents.length; i += batchSize) {
    const batch = validEvents.slice(i, i + batchSize);
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
};

export const createNotionCalendar = async (pageId, events, title) => {
  try {
    const dbData = await createDatabase(pageId, title);
    const validEvents = [];
    
    for (const dayEvent of events) {
      if (!isValidISODate(dayEvent.date)) continue;

      for (const event of dayEvent.events) {
        if (!event.description?.trim()) continue;
        validEvents.push(createEventPage(dbData.id, event, dayEvent.date));
      }
    }

    await createEventsInBatches(validEvents);
    return dbData;
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
};