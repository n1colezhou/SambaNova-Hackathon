console.log('Background script running');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        // Check if it's the specific URL we are interested in
        if (url.hostname === 'sync-redirectpage.netlify.app') {
            const code = url.searchParams.get('code');
            if (code) {
                console.log("Code found:", code);
                // You can store or send the code to other parts of your extension
                chrome.storage.local.set({ "integrationCode": code });
            }
        }
    }
});