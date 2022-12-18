function main() {
	storageGet(["triggers", "caseSensitive", "censorValue", "censorOption"], function (config) {
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
		const observer = new MutationObserver(callback);
		observer.observe(basalNode, moConfig);
	})
}

function mutateTextNodesUnder(node, config) {
	textNodesUnder(node).forEach(subNode => {
		censorTextNode(subNode, config)
	})
}

function textNodesUnder(el) {
	filter = (node) => (['script', 'style'].includes(node.parentNode.tagName.toLowerCase()) || node.nodeValue.trim() === '' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);
	var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, filter, false);
	while (n = walk.nextNode()) a.push(n);
	return a;
}

function censorTextNode(node, config) {
	text = node.nodeValue
	allMatches = []
	config.triggers.forEach(trigger => {
		tokenisedText = tokenise(text, config)
		allMatches = allMatches.concat(findAll(tokenisedText, trigger, config))
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
	censorValue = config.censorOption === "Per" ? config.censorValue.repeat(substr.length) : config.censorValue
	while ((index = str.indexOf(substr, caret)) > -1) {
		matches.push({ 'i': index, 'l': substr.length, 'c': censorValue })
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
	config.triggers.forEach(trigger => {
		tokenisedTriggers.push(tokenise(trigger, config))
	})
	config.triggers = tokenisedTriggers
}

function tokenise(word, config) {
	word = config.caseSensitive ? word : word.toLowerCase()
	return word
}

main()

chrome.runtime.onMessage.addListener(
	function (message) {
		if (message === "TriggerGuardRunMain") {
			main()
		}
	}
);