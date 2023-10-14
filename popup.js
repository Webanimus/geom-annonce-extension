document.addEventListener('DOMContentLoaded', function() {
    // Query for the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // tabs[0] is the first (and only) tab returned by the query
      const currentTab = tabs[0];
  
      try {
        // Send a message to the content script running in the current tab
        chrome.tabs.sendMessage(currentTab.id, { text: 'geomannonce-lookup' }, function(response) {
          if(chrome.runtime.lastError) {
            // If there was an error, log it
            console.log(`Could not send message to tab ${currentTab.id}: ${chrome.runtime.lastError}`);
          } else {
            // If there's no error, handle the response
            console.log(`Message sent to tab ${currentTab.id} successfully!`);
            // handle response here
            console.log(response);
          }
        });
      } catch(err) {
        // If an exception occurred while sending the message, log it
        console.error(`Failed to send message to tab ${currentTab.id}: ${err}`);
      }
    });
  });
  