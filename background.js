chrome.action.onClicked.addListener((tab) => {
  // send a message to the content script
  chrome.tabs.sendMessage(tab.id, { text: 'copy_to_clipboard' });
});
