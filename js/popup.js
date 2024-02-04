$ = function (e) { return document.getElementById(e) }
$("addTrigger").onclick = function () {
    newTrigger = $("inputTrigger").value
    newTriggerConfig = {
        "useDefaults":true,
        "censorOption": "Per",
        "censorValue": "█",
        "caseSensitive": false,
    }
    if (isValidInput(newTrigger)) {
        storageGet(["triggers", "triggerConfigs"], function (config) {
            if (!config.triggers) { config.triggers = [] }
            if (!config.triggerConfigs) { config.triggerConfigs = [] }
            newTriggers = config.triggers
            newTriggers.push(newTrigger)
            newTriggerConfigs = config.triggerConfigs
            newTriggerConfigs.push(newTriggerConfig)
            storageSet({ "triggers": newTriggers, "triggerConfigs":newTriggerConfigs }, function () {
                $("inputTrigger").value = ""
                $("quickAddMessage").innerText = "Phrase successfully added"
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, "TriggerGuardRunMain")
                });
            });
        })
    } else {
        $("quickAddMessage").innerText = "Invalid Entry"
    }
    return false
}
$("inputTrigger").oninput = function () {
    $("quickAddMessage").innerText = ""
}