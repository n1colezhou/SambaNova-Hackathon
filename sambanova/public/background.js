console.log('Background script running');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        if (url.hostname === 'sync-redirectpage.netlify.app') {
            const code = url.searchParams.get('code');
            if (code) {
                console.log("Code found:", code);
                chrome.storage.local.set({ "integrationCode": code });
            }
        }
    }
});