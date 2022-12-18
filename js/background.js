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
        storageGet(["triggers"], function (config) {
            if (!config.triggers) { config.triggers = [] }
            console.log(config)
            newTriggers = config.triggers
            newTriggers.push(newTrigger)
            storageSet({ "triggers": newTriggers }, function () {
                chrome.tabs.sendMessage(tab.id, "TriggerGuardRunMain")
            });
        })
    }
})