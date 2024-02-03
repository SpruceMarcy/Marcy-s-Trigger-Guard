storageGet(["setup"], function(config){
    if (config.setup) { return }
    storageSet(
        {
            "censorOption": "Per",
            "censorValue": "█",
            "caseSensitive": false,
            "doTrim": true,
            "setup": true
        }, null)
})

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "title": 'Block "%s"',
        "contexts": ["selection"],
        "id": "TriggerGuardsContextMenuId"
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    newTrigger = info.selectionText
    if (isValidInput(newTrigger)) {
        storageGet(["triggers", "doTrim"], function (config) {
            if (!config.triggers) { config.triggers = [] }
            if (config.doTrim) { newTrigger = newTrigger.trim() }
            newTriggers = config.triggers
            newTriggers.push(newTrigger)
            storageSet({ "triggers": newTriggers }, function () {
                chrome.tabs.sendMessage(tab.id, "TriggerGuardRunMain")
            });
        })
    }
})