document.addEventListener('DOMContentLoaded', function() {
    // Query for the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // tabs[0] is the first (and only) tab returned by the query
      const currentTab = tabs[0];
  
      // Send a message to the content script running in the current tab
      chrome.tabs.sendMessage(currentTab.id, { text: 'geomannonce-lookup' });
    });
  });
  