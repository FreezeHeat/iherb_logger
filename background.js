// Listener for saving data (Modified to check iherbUrls before saving)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_PRODUCT") {
        const urlKey = message.url;

        // 1. Fetch both the data array and the URL list
        chrome.storage.local.get(['iherbData', 'iherbUrls'], (result) => {
            const existingData = result.iherbData || [];
            const existingUrls = new Set(result.iherbUrls || []);

            // 2. Check for duplicate URL
            if (existingUrls.has(urlKey)) {
                sendResponse({ status: 'Skipped', message: 'URL already logged.' });
                return;
            }

            // 3. If unique, prepare new data and update both keys
            const newData = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                size: (message.content.length / 1024).toFixed(2) + ' KB',
                ...message
            };

            existingData.push(newData);
            existingUrls.add(urlKey);
            
            // Convert Set back to Array for storage
            const updatedUrls = Array.from(existingUrls);

            // 4. Save both keys back to storage
            chrome.storage.local.set({ 
                iherbData: existingData,
                iherbUrls: updatedUrls 
            }, () => {
                sendResponse({ status: 'Success' });
            });
        });

        // Return true to enable asynchronous response
        return true;
    }

    // Listener for GET_DATA (No change needed, still returns the flat array)
    if (message.type === "GET_DATA") {
        chrome.storage.local.get('iherbData', (result) => {
            sendResponse({ data: result.iherbData || [] });
        });
        return true;
    }

    // Listener for DELETE_ROW (Modified to update both keys)
    if (message.type === "DELETE_ROW") {
        chrome.storage.local.get(['iherbData', 'iherbUrls'], (result) => {
            const existingData = result.iherbData || [];
            
            // Find the URL of the item being deleted
            const itemToDelete = existingData.find(item => item.id === message.id);
            const urlToDelete = itemToDelete ? itemToDelete.url : null;

            // Filter the data array
            const updatedData = existingData.filter(item => item.id !== message.id);

            // Update the URL list
            let updatedUrls = result.iherbUrls || [];
            if (urlToDelete) {
                // If the URL exists, remove it from the list of logged URLs
                updatedUrls = updatedUrls.filter(url => url !== urlToDelete);
            }
            
            // Save both updated keys
            chrome.storage.local.set({ 
                iherbData: updatedData,
                iherbUrls: updatedUrls 
            }, () => {
                sendResponse({ status: 'Success' });
            });
        });
        return true;
    }

    // Listener for DELETE_ALL (Modified to remove both keys)
    if (message.type === "DELETE_ALL") {
        chrome.storage.local.remove(['iherbData', 'iherbUrls'], () => {
            sendResponse({ status: 'Success' });
        });
        return true;
    }
});
