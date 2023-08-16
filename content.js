const BASE_URL = 'http://127.0.0.1:8000';

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
  if (msg.text === 'geomannonce-lookup') {

    let content = document.documentElement.outerHTML;
    let url = window.location.href;

    // POST request to 127.0.0.1:8000/geomannonce
    axios.post(BASE_URL + "/geomannonce/save/", {
      url: url,
      content: content
    }).then(response => {
      // Parse response
      let uuid = response.data.uuid;
      let target = BASE_URL + `/geomannonce/${uuid}/search/`;
      window.open(target, '_blank');
      // GET request to the target
      return axios.get(target);
    }).catch(error => {
      console.error("Error:", error);
    });
  }
});
