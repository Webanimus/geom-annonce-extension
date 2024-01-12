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
    let parser = new DOMParser();
    let doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');

    console.log("DOM size: ", doc.documentElement.outerHTML.length);

    // Remove all script tags
    let scripts = doc.getElementsByTagName('script');
    while (scripts[0]) {
        scripts[0].parentNode.removeChild(scripts[0]);
    }

    // Remove all iframe tags
    let iframes = doc.getElementsByTagName('iframe');
    while (iframes[0]) {
        iframes[0].parentNode.removeChild(iframes[0]);
    }

    let domContent = doc.documentElement.outerHTML;
    let url = window.location.href;
    let save_url = BASE_URL + "/geomannonce/save/";
    
    console.log("Sending DOM to remote Geom Annonce: ", save_url, url, domContent.length)

    axios.post(save_url, {
        url: url,
        content: domContent
    }).then(response => {
        let uuid = response.data.uuid;
        let target = BASE_URL + `/geomannonce/${uuid}/search/`;
        window.open(target, '_blank');
        return axios.get(target);
    }).catch(error => {
        let alertMessage = `Geom Annonce :\nAnnonce immobilière non reconnue, êtes-vous sur que ceci est une annonce immobilière ? \n\n${save_url}\n`;
        if (error.response) {
            alert(alertMessage);
        } else {
            alert(alertMessage);
        }
    });
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'geomannonce-lookup') {

        // alert users when they are not on a supported website, and return.
        if (hostnameIsSupported(window.location.hostname)) {
            console.log("Compatible hostname recognised: ", window.location.hostname);
        } else {
            let alert_message = "Geom Annonce :\nAnnonce immobilière non reconnue : " + window.location.hostname + ".\n\nVeuillez ré-essayer sur une annonce immobilière d'un site compatible : \n - "
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
        sendResponse({ success: isRunning, hostname: window.location.hostname, href: window.location.href, title: document.title });
    }
});
