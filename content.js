// Description: This script is injected into the page by the extension.

// hostnameIsCompatible(hostname) returns true if hostname is compatible with the extension.
// Compatible hostnames are defined in COMPATIBLE_HOSTNAMES, in env.js
function hostnameIsSupported(hostname) {
  // lambda that tests if there is a === or endsWith string match
  let test = (x) => {
    if (x === hostname) {
      return true;
    }
    if (hostname.endsWith(x)) {
      return true;
    }
    return false;
  }
  // return true if any of the COMPATIBLE_HOSTNAMES matches
  return SUPPORTED_HOSTNAMES.some(test);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  //TODO @JorisPLA7: clean this dead code
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

    // alert users when they are not on a supported website, and return.
    if (hostnameIsSupported(window.location.hostname)) {
      console.log("Compatible hostname recognised: ", window.location.hostname);
    } else {
      let alert_message = window.location.hostname + " n'est pas supporté pour le moment.\nVeuillez essayer sur une annonce immobilière sur un site compatible : "
        + SUPPORTED_HOSTNAMES.join(", ");
      //TODO @JorisPLA7: replace alert by a cleaner popup (to make in figma 1st)
      alert(alert_message);
      return;
    }

    // wait for the DOM to be loaded
    function sendDOMToRemoteGeomAnnonce() {
      // Your code to copy the DOM content
      let domContent = document.documentElement.outerHTML;
      console.log(domContent);
    }

    // // ie if document.readyState is not loading, send the DOM to the remote server
    // // from interactive and beyond, the DOM html is complete, but images, stylesheets, and subframes may still be loading.
    // if (document.readyState === 'interactive' || document.readyState === 'complete') {
    //     sendDOMToRemoteGeomAnnonce();
    //   alert("DOM is ready already");
    // } else {

    //   document.addEventListener('readystatechange', function () {
    //     if (document.readyState === 'interactive' || document.readyState === 'complete') {
    //       sendDOMToRemoteGeomAnnonce();
    //       alert("DOM is ready now");
    //     }
    //   });
    // }


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
