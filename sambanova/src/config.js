export const CONFIG = {
    NOTION_API_KEY: process.env.REACT_APP_NOTION_API_KEY,
    NOTION_API_VERSION: '2022-06-28'
  };
  
  if (!CONFIG.NOTION_API_KEY) {
    console.error('Missing NOTION_API_KEY');
  }