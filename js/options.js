$ = function (e) { return document.getElementById(e) }
$("addTrigger").onclick = function () {
    newTrigger = $("inputTrigger").value
    newTriggerConfig = {
        "useDefaults":true,
        "censorOption": "Per",
        "censorValue": "█",
        "censorExtent": "substring",
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
                $("addMessage").innerText = "Phrase successfully added"
                addToTriggerList(newTrigger, newTriggerConfig)
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

function triggerConfigSet(trigger, data) {
    storageGet(["triggers", "triggerConfigs"], function (result) {
        newTriggerConfigs = result.triggerConfigs
        index = result.triggers.indexOf(trigger)
        newTriggerConfig = newTriggerConfigs[index]
        for (const [key, value] of Object.entries(data)) {
            newTriggerConfig[key] = value
        }
        newTriggerConfigs[index] = newTriggerConfig
        storageSet({ "triggerConfigs":newTriggerConfigs }, null)
    })
}

function triggerConfigGet(trigger, callback) {
    storageGet(["triggers", "triggerConfigs"], function (result) {
        index = result.triggers.indexOf(trigger)
        callback(result.triggerConfigs[index])
    })
}

function addToTriggerList(trigger, triggerConfig) {
    tl = $("triggerList")
    let template = $("listItemTemplate").content.cloneNode(true);
    $$ = function (e) { return template.getElementById(e) }

    let triggerEntryText = $$('triggerEntryText');
    let deleteButton = $$('deleteButton');
    let dropdown = $$('defaultDropdown');
    let settingsButton = $$('settingsButton');
    let collapseSettings = $$('collapseSettings')
    triggerEntryText.textContent = trigger;
    dropdown.value = triggerConfig.useDefaults ? "default" : "custom"
    settingsButton.hidden = triggerConfig.useDefaults

    // Give functionality to buttons
    let csCheckboxLI = $$("caseSensitiveLI")
    csCheckboxLI.addEventListener('change', (event) => {
        triggerConfigSet(trigger, { "caseSensitive": event.currentTarget.checked });
    })
    let blackoutAllRadioLI = $$("blackoutAllLI")
    blackoutAllRadioLI.onchange = function () {
        triggerConfigSet(trigger, { "censorOption": "All", "censorValue": "█████" })
    }
    let blackoutPerRadioLI = $$("blackoutPerLI")
    blackoutPerRadioLI.onchange = function () {
        triggerConfigSet(trigger, { "censorOption": "Per", "censorValue": "█" })
    }
    let underscoreAllRadioLI = $$("underscoreAllLI")
    underscoreAllRadioLI.onchange = function () {
        triggerConfigSet(trigger, { "censorOption": "All", "censorValue": "-----" })
    }
    let underscorePerRadioLI = $$("underscorePerLI")
    underscorePerRadioLI.onchange = function () {
        triggerConfigSet(trigger, { "censorOption": "Per", "censorValue": "-" })
    }
    let customCensorRadioLI = $$("customCensorLI")
    let customCensorTextboxLI = $$("customCensorValueLI")
    handleCustomCensor = function () {
        triggerConfigSet(trigger, { "censorOption": "Custom", "censorValue": customCensorTextboxLI.value })
    }
    customCensorRadioLI.onchange = handleCustomCensor
    customCensorTextboxLI.oninput = handleCustomCensor

    let extentExactRadioLI = $$("extentExactLI")
    extentExactRadioLI.onchange = function () { triggerConfigSet(trigger, { "censorExtent": "exact"}) }
    let extentSubstringRadioLI = $$("extentSubstringLI")
    extentSubstringRadioLI.onchange = function () { triggerConfigSet(trigger, { "censorExtent": "substring"}) }
    let extentWordRadioLI = $$("extentWordLI")
    extentWordRadioLI.onchange = function () { triggerConfigSet(trigger, { "censorExtent": "word"}) }
    let extentSentenceRadioLI = $$("extentSentenceLI")
    extentSentenceRadioLI.onchange = function () { triggerConfigSet(trigger, { "censorExtent": "sentence"}) }

    triggerConfigGet(trigger, function(result){
        csCheckboxLI.checked = result.caseSensitive
        switch (result.censorOption) {
            case "All":
                if (result.censorValue === "█████") {
                    blackoutAllRadioLI.checked = true
                } else if (result.censorValue === "-----") {
                    underscoreAllRadioLI.checked = true
                }
                break;
            case "Per":
                if (result.censorValue === "█") {
                    blackoutPerRadioLI.checked = true
                } else if (result.censorValue === "-") {
                    underscorePerRadioLI.checked = true
                }
                break;
            case "Custom":
                customCensorRadioLI.checked = true
                customCensorTextboxLI.value = result.censorValue ? result.censorValue : ""
        }
        switch (result.censorExtent){
            case "exact":
                extentExactRadioLI.checked = true
                break;
            case "substring":
                extentSubstringRadioLI.checked = true
                break;
            case "word":
                extentWordRadioLI.checked = true
                break;
            case "sentence":
                extentSentenceRadioLI.checked = true
                break;
        }
    })


    Array.from(collapseSettings.children).forEach(child => {
        let labels = child.getElementsByTagName("label")
        Array.from(labels).forEach(label => {
            label.setAttribute("for", label.getAttribute("for")+btoa(trigger))     
        })
        let inputs = child.getElementsByTagName("input")
        Array.from(inputs).forEach(input => {
            input.setAttribute("id", input.getAttribute("id")+btoa(trigger))
            input.setAttribute("name", input.getAttribute("name")+btoa(trigger))      
        })
    });

    triggerEntryText.removeAttribute('id'); 
    deleteButton.removeAttribute('id');
    dropdown.removeAttribute('id');
    settingsButton.removeAttribute('id');
    collapseSettings.removeAttribute('id');
    let childrenToDelete = []
    Array.from(template.children).forEach(child => {
        childrenToDelete.push(child)
    });
    deleteButton.onclick = function () {
        storageGet(["triggers", "triggerConfigs"], function (result) {
            newTriggers = result.triggers
            newTriggerConfigs = result.triggerConfigs
            index = newTriggers.indexOf(trigger)
            newTriggers.splice(index, 1)
            newTriggerConfigs.splice(index, 1)
            storageSet({ "triggers": newTriggers, "triggerConfigs":newTriggerConfigs }, function () {
                childrenToDelete.forEach(child => {
                    tl.removeChild(child)
                });
            });
        })
    }
    dropdown.onchange = function(event){
        storageGet(["triggers", "triggerConfigs"], function (result){
            index = result.triggers.indexOf(trigger)
            newTriggerConfigs = result.triggerConfigs
            useDefaults = event.target.value === "default"
            newTriggerConfigs[index].useDefaults = useDefaults
            settingsButton.hidden = useDefaults
            if (useDefaults && collapseSettings.style.height === "auto"){
                collapseSettings.style.height = 0 
            }
            storageSet({ "triggerConfigs":newTriggerConfigs }, null);
        })
    }
    settingsButton.onclick = function (){
        collapseSettings.style.height = collapseSettings.style.height === "auto" ?  0 : "auto"
    }

    tl.appendChild(template)
}

function updateTriggerList() {
    storageGet(["triggers", "triggerConfigs"], function (config) {
        if (!config.triggers) { return }
        config.triggers.forEach((trigger, i) => {
            addToTriggerList(trigger, config.triggerConfigs[i])
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

extentExactRadio = $("extentExact")
extentExactRadio.onchange = function () { storageSet({ "censorExtent": "exact"}, null) }
extentSubstringRadio = $("extentSubstring")
extentSubstringRadio.onchange = function () { storageSet({ "censorExtent": "substring"}, null) }
extentWordRadio = $("extentWord")
extentWordRadio.onchange = function () { storageSet({ "censorExtent": "word"}, null) }
extentSentenceRadio = $("extentSentence")
extentSentenceRadio.onchange = function () { storageSet({ "censorExtent": "sentence"}, null) }

dtCheckbox = $("doTrim")
dtCheckbox.addEventListener('change', (event) => {
    storageSet({ "doTrim": event.currentTarget.checked }, null);
})

// Set defaults
storageGet(["caseSensitive", "doTrim"], function (config) {
    csCheckbox.checked = config.caseSensitive
    dtCheckbox.checked = config.doTrim
})

storageGet(["censorOption", "censorValue", "censorExtent"], function (config) {
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
    switch (config.censorExtent){
        case "exact":
            extentExactRadio.checked = true
            break;
        case "substring":
            extentSubstringRadio.checked = true
            break;
        case "word":
            extentWordRadio.checked = true
            break;
        case "sentence":
            extentSentenceRadio.checked = true
            break;
    }
})