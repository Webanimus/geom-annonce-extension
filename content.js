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

// wait for the DOM to be interactive or complete
function domReadyToSend() {
    return new Promise((resolve, reject) => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            resolve();
        } else {
            document.addEventListener('readystatechange', function () {
                if (document.readyState === 'interactive' || document.readyState === 'complete') {
                    document.removeEventListener('readystatechange', arguments.callee);
                    resolve();
                }
            });
        }
    });
}

function sendDOMToRemoteGeomAnnonce() {
    let domContent = document.documentElement.outerHTML;
    let url = window.location.href;
    let save_url = BASE_URL + "/geomannonce/save/";
    axios.post(save_url, {
        url: url,
        content: domContent
    }).then(response => {
        let uuid = response.data.uuid;
        let target = BASE_URL + `/geomannonce/${uuid}/search/`;
        window.open(target, '_blank');
        return axios.get(target);
    }).catch(error => {

        if (error.response) {
            alert(`Geom Annonce :\nAnnonce immobilière non reconnue, êtes-vous sur que ceci est une annonce immobilière ? \n\n${save_url}\n`);
        } else {
            alert(`Geom Annonce :\nAnnonce immobilière non reconnue, êtes-vous sur que ceci est une annonce immobilière ? \n\n${save_url}\n`);
        }
    });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'geomannonce-lookup') {

        // alert users when they are not on a supported website, and return.
        if (hostnameIsSupported(window.location.hostname)) {
            console.log("Compatible hostname recognised: ", window.location.hostname);
        } else {
            let alert_message ="Geom Annonce :\nAnnonce immobilière non reconnue : " + window.location.hostname + ".\n\nVeuillez ré-essayer sur une annonce immobilière d'un site compatible : \n - "
                + SUPPORTED_HOSTNAMES.join("\n - ");
            //TODO @JorisPLA7: replace alert by a cleaner popup
            alert(alert_message);
            return;
        }

        async function shipPayload() {
            await domReadyToSend();
            sendDOMToRemoteGeomAnnonce();
        }
        shipPayload();

    }
});

// Variable to store the "running" status of this content script
let isRunning = true;

// Listen for incoming messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is asking if the content script is running
  if (request.action === 'isContentScriptRunning') {
    // Send a response indicating success
    sendResponse({success: isRunning, hostname: window.location.hostname, href: window.location.href, title: document.title});
  }
});
