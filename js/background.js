storageGet(["setup", "censorOption", "censorValue", "triggers", "triggerConfigs"], function(config){
    if (config.setup) { return }
    if (!config.censorOption && !config.censorValue){
        storageSet(
            {
                "censorOption": "Per",
                "censorValue": "█",
            }, null)
    }
    if (!config.triggerConfigs) {config.triggerConfigs = []}
    if (!config.triggers) {config.triggers = []}
    if (config.triggers.length != config.triggerConfigs.length){
        for (let i = config.triggerConfigs.length; i < config.triggers.length; i++) {
            config.triggerConfigs.push({
                "useDefaults":true,
                "censorOption": "Per",
                "censorValue": "█",
                "caseSensitive": false,
            })
        } 
    }
    storageSet(
        {
            "caseSensitive": false,
            "doTrim": true,
            "triggers":config.triggers,
            "triggerConfigs":config.triggerConfigs,
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
    newTriggerConfig = {
        "useDefaults":true,
        "censorOption": "Per",
        "censorValue": "█",
        "caseSensitive": false,
    }
    if (isValidInput(newTrigger)) {
        storageGet(["triggers", "triggerConfigs", "doTrim"], function (config) {
            if (!config.triggers) { config.triggers = [] }
            if (!config.triggerConfigs) { config.triggerConfigs = [] }
            if (config.doTrim) { newTrigger = newTrigger.trim() }
            newTriggers = config.triggers
            newTriggers.push(newTrigger)
            newTriggerConfigs = config.triggerConfigs
            newTriggerConfigs.push(newTriggerConfig)
            storageSet({ "triggers": newTriggers, "triggerConfigs":newTriggerConfigs }, function () {
                chrome.tabs.sendMessage(tab.id, "TriggerGuardRunMain")
            });
        })
    }
})