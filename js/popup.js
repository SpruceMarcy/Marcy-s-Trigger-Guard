$ = function (e) { return document.getElementById(e) }
$("addTrigger").onclick = function () {
    newTrigger = $("inputTrigger").value
    storageGet(["triggers"], function (result) {
        newTriggers = result.triggers
        newTriggers.push(newTrigger)
        storageSet({ "triggers": newTriggers }, function () {
            console.log("Value is set to " + newTriggers);
        });
    })
}