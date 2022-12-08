$ = function(e){return document.getElementById(e)}
$("addTrigger").onclick = function() {
    newTrigger = $("inputTrigger").value
    chrome.storage.sync.get(["triggers"], function(result) {
        newTriggers = result.triggers
        newTriggers.push(newTrigger)
        chrome.storage.sync.set({ "triggers": newTriggers }, function() {
            console.log("Value is set to " + newTriggers);
        });
    })
}