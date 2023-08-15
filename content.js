// Include axios for HTTP requests
// const axios = require('axios');
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
    // log url and content as a debug
    console.log({ url, content });

    // POST request to 127.0.0.1:8000/geomannonce
    axios.post(BASE_URL + "/geomannonce/save/", {
      url: url,
      content: content
    }).then(response => {
      // Parse response
      let uuid = response.data.uuid;
      console.log(uuid);
      let target = BASE_URL + `/geomannonce/${uuid}/search/`;
      window.open(target, '_blank');
      // GET request to the target
      return axios.get(target);
    }).then(response => {
      console.log(url);
      console.log(response.data);
    }).catch(error => {
      console.error("Error:", error);
    });
  }
});
