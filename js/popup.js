$ = function (e) { return document.getElementById(e) }
$("addTrigger").onclick = function () {
    newTrigger = $("inputTrigger").value
    if (isValidInput(newTrigger)) {
        storageGet(["triggers"], function (config) {
            if (!config.triggers) { config.triggers = [] }
            newTriggers = config.triggers
            newTriggers.push(newTrigger)
            storageSet({ "triggers": newTriggers }, function () {
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