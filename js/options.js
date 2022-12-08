$ = function(e){return document.getElementById(e)}
$("addTrigger").onclick = function() {
    newTrigger = $("inputTrigger").value
    chrome.storage.sync.get(["triggers"], function(result) {
        console.log(result)
        newTriggers = result.triggers
        newTriggers.push(newTrigger)
        chrome.storage.sync.set({ "triggers": newTriggers }, function() {
            console.log("Value is set to " + newTriggers);
            addToTriggerList(newTrigger)
        });
    })
}

function addToTriggerList(trigger){
    tl = $("triggerList")

    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let a = document.createElement('a');
    p1.textContent = trigger;
    a.textContent = "delete"
    a.href = "#"

    tl.appendChild(div1)
    tl.appendChild(div2)
    div1.appendChild(p1)
    div2.appendChild(p2)
    p2.appendChild(a)

    a.onclick = function(){
        chrome.storage.sync.get(["triggers"], function(result) {
            newTriggers = result.triggers
            index = newTriggers.indexOf(trigger)
            newTriggers.splice(index,1)
            chrome.storage.sync.set({ "triggers": newTriggers }, function() {
                console.log("Value is set to " + newTriggers);
                tl.removeChild(div1)
                tl.removeChild(div2)
            });
        })
    }
}

function updateTriggerList(){
    chrome.storage.sync.get(["triggers"], function(result) {
        result.triggers.forEach(trigger => {
            addToTriggerList(trigger)
        });
    })
}

updateTriggerList()

csCheckbox = $("caseSensitive")
csCheckbox.addEventListener('change', (event) => {
    chrome.storage.sync.set({ "caseSensitive": event.currentTarget.checked}, function(){});
})
chrome.storage.sync.get(["caseSensitive"], function(result) {
    csCheckbox.checked = result.caseSensitive
})
