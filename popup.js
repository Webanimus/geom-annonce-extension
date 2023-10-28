

statusDiv = document.getElementById("status-div");
statusDiv.style.display = "block";
statusText = document.getElementById("status-text");
statusText.innerHTML = "Chargement de la page ...";

var tryLookup = false;

document.addEventListener('DOMContentLoaded', () => {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Send a message to the content script running in the active tab
        chrome.tabs.sendMessage(activeTab.id, { action: 'isContentScriptRunning' }, (response) => {
            // Check for errors (content script not running)
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            tryLookup = true;

            // Process the response from the content script
            if (response && response.success) {
                console.log('Content script is running and returned success.');
                statusText.innerHTML = "Recherche en cours de la page :<br>" + response.title;
            } else {
                console.log('Content script is either not running or returned failure.');
                statusText.innerHTML = "Content script is either not running or returned failure.";
            }
        });

        // Send a message "geomannonce-lookup" to the content script running in the active tab
        chrome.tabs.sendMessage(activeTab.id, { text: 'geomannonce-lookup' }, (response) => {
            // Check for errors (content script not running)
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            // Process the response from the content script
            if (response && response.success) {
                console.log('Content script is running and returned success.');
                statusText.innerHTML = "Recherche en cours de la page :<br>" + response.title;
            } else {
                console.log('Content script is either not running or returned failure.');
                statusText.innerHTML = "Content script is either not running or returned failure.";
            }
        });
    });
});
