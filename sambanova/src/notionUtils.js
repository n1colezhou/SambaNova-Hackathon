import { CONFIG } from './config';

// Function to extract page ID from Notion URL
export const extractPageId = (notionUrl) => {
  const matches = notionUrl.match(/([a-zA-Z0-9]{32})/);
  return matches ? matches[1] : null;
};

// Function to validate ISO date format
export const isValidISODate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}/);
};

// Function to create a database in Notion
const createDatabase = async (pageId, title, accessToken) => {
  const response = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`, // Use access token here
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

// Function to create an event page
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

// Function to create events in batches
const createEventsInBatches = async (validEvents, accessToken) => {
  const batchSize = 100;
  for (let i = 0; i < validEvents.length; i += batchSize) {
    const batch = validEvents.slice(i, i + batchSize);
    await Promise.all(batch.map(pageData =>
      fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Use access token here
          'Notion-Version': CONFIG.NOTION_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      })
    ));
  }
};

// Function to retrieve and exchange the code for an access token
function retrieveAndExchangeToken() {
  const redirectUri = "https://sync-redirectpage.netlify.app/"; // Hardcoded redirect URI here

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
            "Authorization": "Basic " + btoa(`${process.env.REACT_APP_NOTION_CLIENT_ID}:${process.env.REACT_APP_NOTION_CLIENT_SECRET}`) // Use env variables here
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri // Use the hardcoded redirect URI
          })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const accessToken = data.access_token; // Extracts only the access_token
        console.log("Access Token:", accessToken);
        resolve(accessToken); // Return only the access token
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        reject(error);
      }
    });
  });
}

// Function to create a Notion calendar
export const createNotionCalendar = async (pageId, events, title) => {
  try {
    // Retrieve the access token
    const accessToken = await retrieveAndExchangeToken();
    
    // Create the database using the access token
    const dbData = await createDatabase(pageId, title, accessToken);
    
    const validEvents = [];

    // Validate and process the events
    for (const dayEvent of events) {
      if (!isValidISODate(dayEvent.date)) continue;

      for (const event of dayEvent.events) {
        if (!event.description?.trim()) continue;
        validEvents.push(createEventPage(dbData.id, event, dayEvent.date));
      }
    }

    // Create events in batches
    await createEventsInBatches(validEvents, accessToken);
    return dbData;
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
};
