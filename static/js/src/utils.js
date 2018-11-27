/* exported readSession, writeSession */

// https://developer.mozilla.org/en-US/docs/Web/API/
//    Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if
            // there's something already stored
            storage.length !== 0;
    }
}

function readSession(label) {
    /* eslint-disable scanjs-rules/identifier_sessionStorage */
    if (storageAvailable('sessionStorage')) {
        return sessionStorage.getItem(label);
    }
    /* eslint-enable scanjs-rules/identifier_sessionStorage */
    return '';
}

function writeSession(label, str) {
    /* eslint-disable scanjs-rules/identifier_sessionStorage */
    /* eslint-disable scanjs-rules/property_sessionStorage */
    if (storageAvailable('sessionStorage')) {
        window.sessionStorage.setItem(label, str);
    }
    /* eslint-enable scanjs-rules/identifier_sessionStorage */
    /* eslint-enable scanjs-rules/property_sessionStorage */
}