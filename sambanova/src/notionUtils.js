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

const createDatabase = async (pageId, title, accessToken, includeSuggestions) => {
  const properties = {
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
  };

  // Add suggestion-related properties if needed
  if (includeSuggestions) {
    properties.Task_Description = {
      type: "rich_text",
      rich_text: {}
    };
    properties.Time_Block = {
      type: "rich_text",
      rich_text: {}
    };
    properties.Start_Time = {
      type: "date",
      date: {}
    };
    properties.End_Time = {
      type: "date",
      date: {}
    };
    properties.Suggestion_Details = {
      type: "rich_text",
      rich_text: {}
    };
  }

  const response = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
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
      properties,
      is_inline: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create calendar database');
  }

  return response.json();
};

const createEventPage = (dbId, event, date, includeSuggestions) => {
  const properties = {
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
  };

  if (includeSuggestions) {
    properties.Type = {
      select: {
        name: "Event"
      }
    };
  }

  return {
    parent: {
      type: "database_id",
      database_id: dbId
    },
    properties
  };
};

const createSuggestionPage = (dbId, suggestion, date) => ({
  parent: {
    type: "database_id",
    database_id: dbId
  },
  properties: {
    Event: {
      title: [
        {
          text: {
            content: "Suggestion"  // Default title for suggestions
          }
        }
      ]
    },
    Date: {
      date: {
        start: date
      }
    },
    Task_Description: {
      rich_text: [
        {
          type: "text",
          text: {
            content: suggestion.task_description || ''
          }
        }
      ]
    },
    Time_Block: {
      rich_text: [
        {
          type: "text",
          text: {
            content: suggestion.time_block || ''
          }
        }
      ]
    },
    Start_Time: {
      date: {
        start: suggestion.start_time || null
      }
    },
    End_Time: {
      date: {
        start: suggestion.end_time || null
      }
    },
    Suggestion_Details: {
      rich_text: [
        {
          type: "text",
          text: {
            content: suggestion.details || ''
          }
        }
      ]
    }
  }
});

const createItemsInBatches = async (items, accessToken) => {
  const batchSize = 100;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(pageData =>
      fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': CONFIG.NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      })
    ));
  }
};

export function retrieveAndExchangeToken() {
  const redirectUri = "https://sync-redirectpage.netlify.app/"; 

  return new Promise((resolve, reject) => {
    chrome.storage.local.get("integrationCode", async (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving integration code:", chrome.runtime.lastError);
        return reject(chrome.runtime.lastError);
      }

      const code = result.integrationCode;
      if (!code) {
        console.log("No integration code found in local storage.");
        return reject(new Error("No integration code found"));
      }

      console.log("Retrieved integration code:", code);

      try {
        const url = "https://api.notion.com/v1/oauth/token";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(`${process.env.REACT_APP_NOTION_CLIENT_ID}:${process.env.REACT_APP_NOTION_CLIENT_SECRET}`)
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API response:', errorData);
        }

        const data = await response.json();
        const accessToken = data.access_token;
        console.log("Access Token:", accessToken);
        resolve(accessToken);
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        reject(error);
      }
    });
  });
}

export const createNotionCalendar = async (pageId, events, title, includeSuggestions = false) => {
  try {
    const accessToken = await retrieveAndExchangeToken();
    const dbData = await createDatabase(pageId, title, accessToken, includeSuggestions);

    const items = [];
    for (const dayEvent of events) {
      if (!isValidISODate(dayEvent.date)) continue;

      if (dayEvent.events) {
        for (const event of dayEvent.events) {
          if (!event.description?.trim()) continue;
          items.push(createEventPage(dbData.id, event, dayEvent.date, includeSuggestions));
        }
      }

      if (includeSuggestions && dayEvent.suggestions) {
        for (const suggestion of dayEvent.suggestions) {
          if (!suggestion.description?.trim()) continue;
          items.push(createSuggestionPage(dbData.id, suggestion, dayEvent.date));
        }
      }
    }

    await createItemsInBatches(items, accessToken);
    return dbData;
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
};
