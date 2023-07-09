chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'document.documentElement.outerHTML'
    }, function(results) {
        let dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = results[0];
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    });
});