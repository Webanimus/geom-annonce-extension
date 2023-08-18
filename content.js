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

    axios.post(BASE_URL + "/geomannonce/save/", {
        url: url,
        content: domContent
    }).then(response => {
        let uuid = response.data.uuid;
        let target = BASE_URL + `/geomannonce/${uuid}/search/`;
        window.open(target, '_blank');
        return axios.get(target);
    }).catch(error => {

        if (error.response) {
            alert(`Erreur lors du chargement de cette page dans GeomAnnonce. Veuilez contacter le support à contact@webanimus.com avec les informations suivantes :\n\nStatus = ${error.response.status}, Error text = ${error.response.statusText}`);
        } else {
            alert("Erreur lors du chargement de cette page dans GeomAnnonce. Veuilez contacter le support à contact@webanimus.com avec les informations suivantes :\n\n" + error.message); // Getting message property of the error object.
        }
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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

        async function shipPayload() {
            await domReadyToSend();
            sendDOMToRemoteGeomAnnonce();
        }
        shipPayload();

    }
});
