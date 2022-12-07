$ = function(e){return document.getElementById(e)}
$("addTrigger").onclick = function() {
    value = $("inputTrigger").value
    chrome.storage.sync.set({ "triggers": [value] },function() {
        console.log("Value is set to " + value);
      });
}