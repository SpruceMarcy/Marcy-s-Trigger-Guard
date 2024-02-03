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
                $("addMessage").innerText = "Phrase successfully added"
                addToTriggerList(newTrigger)
            });
        })
    } else {
        $("addMessage").innerText = "Invalid Entry"
    }
    return false
}

$("inputTrigger").oninput = function () {
    $("addMessage").innerText = ""
}

function addToTriggerList(trigger) {
    tl = $("triggerList")

    let div1 = document.createElement('div')
    let div2 = document.createElement('div')
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let a = document.createElement('a');
    p1.textContent = trigger;
    a.textContent = "delete"
    a.href = "javascript:void(0)"

    tl.appendChild(div1)
    tl.appendChild(div2)
    div1.appendChild(p1)
    div2.appendChild(p2)
    p2.appendChild(a)

    a.onclick = function () {
        storageGet(["triggers"], function (result) {
            newTriggers = result.triggers
            index = newTriggers.indexOf(trigger)
            newTriggers.splice(index, 1)
            storageSet({ "triggers": newTriggers }, function () {
                tl.removeChild(div1)
                tl.removeChild(div2)
            });
        })
    }
}

function updateTriggerList() {
    storageGet(["triggers"], function (config) {
        if (!config.triggers) { return }
        config.triggers.forEach(trigger => {
            addToTriggerList(trigger)
        });
    })
}

updateTriggerList()

// Give functionality to buttons
csCheckbox = $("caseSensitive")
csCheckbox.addEventListener('change', (event) => {
    storageSet({ "caseSensitive": event.currentTarget.checked }, null);
})

blackoutAllRadio = $("blackoutAll")
blackoutAllRadio.onchange = function () {
    storageSet({ "censorOption": "All", "censorValue": "█████" }, null)
}
blackoutPerRadio = $("blackoutPer")
blackoutPerRadio.onchange = function () {
    storageSet({ "censorOption": "Per", "censorValue": "█" }, null)
}
underscoreAllRadio = $("underscoreAll")
underscoreAllRadio.onchange = function () {
    storageSet({ "censorOption": "All", "censorValue": "-----" }, null)
}
underscorePerRadio = $("underscorePer")
underscorePerRadio.onchange = function () {
    storageSet({ "censorOption": "Per", "censorValue": "-" }, null)
}
customCensorRadio = $("customCensor")
customCensorTextbox = $("customCensorValue")
handleCustomCensor = function () {
    storageSet({ "censorOption": "Custom", "censorValue": customCensorTextbox.value }, null)
}
customCensorRadio.onchange = handleCustomCensor
customCensorTextbox.oninput = handleCustomCensor

dtCheckbox = $("doTrim")
dtCheckbox.addEventListener('change', (event) => {
    storageSet({ "doTrim": event.currentTarget.checked }, null);
})

// Set defaults
storageGet(["caseSensitive", "doTrim"], function (config) {
    csCheckbox.checked = config.caseSensitive
    dtCheckbox.checked = config.doTrim
})

storageGet(["censorOption", "censorValue"], function (config) {
    switch (config.censorOption) {
        case "All":
            if (config.censorValue === "█████") {
                blackoutAllRadio.checked = true
            } else if (config.censorValue === "-----") {
                underscoreAllRadio.checked = true
            }
            break;
        case "Per":
            if (config.censorValue === "█") {
                blackoutPerRadio.checked = true
            } else if (config.censorValue === "-") {
                underscorePerRadio.checked = true
            }
            break;
        case "Custom":
            customCensorRadio.checked = true
            customCensorTextbox.value = config.censorValue ? config.censorValue : ""
    }
})