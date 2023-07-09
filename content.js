chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'copy_to_clipboard') {
        
      let pageHTML = document.documentElement.outerHTML;
      navigator.clipboard.writeText(pageHTML)
        .then(() => {
          console.log('HTML copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy HTML: ', err);
        });
    }
  });
  