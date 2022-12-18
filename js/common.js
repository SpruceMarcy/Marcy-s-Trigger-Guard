function storageGet(key, callback) {
    if (!typeof browser === "undefined") {
        return browser.storage.sync.get(key, callback)
    }
    if (chrome) {
        return chrome.storage.sync.get(key, callback)
    }
}

function storageSet(data, callback) {
    if (!typeof browser === "undefined") {
        return browser.storage.sync.set(data, callback)
    }
    if (chrome) {
        return chrome.storage.sync.set(data, callback)
    }
}

function isValidInput(word) {
    return word && word.length && word.trim().length
}