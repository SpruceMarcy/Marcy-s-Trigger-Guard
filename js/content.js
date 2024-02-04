function main() {
	storageGet(["triggers", "triggerConfigs", "caseSensitive", "censorValue", "censorOption", "censorExtent"], function (config) {
		if (!config.triggers) { return }

		tokeniseTriggers(config)

		basalNode = document.body ? document.body : document

		mutateTextNodesUnder(basalNode, config)

		const moConfig = { attributes: false, childList: true, subtree: true };
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(node => {
						mutateTextNodesUnder(node, config)
					})
				}
			}
		};
		if (observer) {
			observer.disconnect()
		}
		observer = new MutationObserver(callback);
		observer.observe(basalNode, moConfig);
	})
}

function mutateTextNodesUnder(node, config) {
	textNodesUnder(node).forEach(subNode => {
		censorTextNode(subNode, config)
	})
}

function textNodesUnder(el) {
	filter = (node) => (['script', 'style', 'meta'].includes(node.parentNode.tagName.toLowerCase()) || node.nodeValue.trim() === '' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);
	var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, filter, false);
	while (n = walk.nextNode()) a.push(n);
	return a;
}

function censorTextNode(node, config) {
	text = node.nodeValue
	allMatches = []
	config.triggers.forEach((trigger, index) => {
		triggerConfig = config.triggerConfigs[index]
		configUsed = triggerConfig
		if (triggerConfig.useDefaults){ configUsed = config }
		tokenisedText = tokenise(text, configUsed)
		allMatches = allMatches.concat(findAll(tokenisedText, trigger, configUsed))
	})
	if (allMatches.length != 0) {
		allMatches.sort((a, b) => { return (a['i'] - b['i'] || a['l'] - b['l']) });
		text = censorAtIndices(text, allMatches)
		node.nodeValue = text
	}
}

function findAll(str, substr, config) {
	matches = []
	caret = 0
	const regex1 = /[^.!?\s][^.!?\n]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g
	let result;
	sentenceIndices = []
	while ((result = regex1.exec(str)) !== null) {
	  sentenceIndices.push(result.index)
	}	  
	sentenceIndices.push(str.length)


	while ((index = str.indexOf(substr, caret)) > -1) {
		match = { 'i': index, 'l': substr.length, 'c': "" }
		doMatch = true
		switch (config.censorExtent){
			case "exact":
				if (index > 0 && "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(str.charAt(index-1))){
					doMatch = false
					break
				}
				if (index+substr.length < str.length && "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(str.charAt(index+substr.length))){
					doMatch = false
					break
				}	
			case "substring":
				break;
			case "word":
				wordStart = str.lastIndexOf(" ", index) + 1
				wordEnd = str.indexOf(" ", index+substr.length)
				wordEnd = wordEnd == -1? str.length : wordEnd
				match['i'] = wordStart
				match['l'] = wordEnd - wordStart
				break;
			case "sentence":
				wordStart = 0
				wordEnd = str.length
				for (let i = 0; i < sentenceIndices.length; i++) {
					if (sentenceIndices[i]>index){
						wordStart = sentenceIndices[i-1]
						wordEnd = sentenceIndices[i]
					}
					break
				}
				match['i'] = wordStart
				match['l'] = wordEnd - wordStart
				break;
		}
		if (doMatch){
			match['c'] = config.censorOption === "Per" ? config.censorValue.repeat(match['l']) : config.censorValue
			matches.push(match)
		}
		caret = index + 1
	}
	return matches
}

function censorAtIndices(str, indices) {
	substrings = []
	lastIndex = 0
	indices.forEach(index => {
		if (index['i'] >= lastIndex) {
			substrings.push(str.substring(lastIndex, index['i']))
			substrings.push(index['c'])
		}
		lastIndex = index['i'] + index['l']
	})
	substrings.push(str.substring(lastIndex))
	return substrings.join('')
}

function tokeniseTriggers(config) {
	tokenisedTriggers = []
	config.triggers.forEach((trigger, index) => {
		triggerConfig = config.triggerConfigs[index]
		configUsed = triggerConfig
		if (triggerConfig.useDefaults){ configUsed = config }
		tokenisedTriggers.push(tokenise(trigger, configUsed))
	})
	config.triggers = tokenisedTriggers
}

function tokenise(word, config) {
	word = config.caseSensitive ? word : word.toLowerCase()
	return word
}

var observer

main()

chrome.runtime.onMessage.addListener(
	function (message) {
		if (message === "TriggerGuardRunMain") {
			main()
		}
	}
);