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
	filter = (node) => (['SCRIPT', 'STYLE'].includes(node.parentNode.tagName) || node.nodeValue.trim() === '' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);
	var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, filter, false);
	while (n = walk.nextNode()) a.push(n);
	return a;
}

function censorTextNode(node, config) {
	text = node.nodeValue
	config.triggers.forEach(trigger => {
		tokenisedText = tokenise(text, config)
		matches = findAll(tokenisedText, trigger)
		censorValue = config.censorOption === "Per" ? config.censorValue.repeat(trigger.length) : config.censorValue
		text = censorAtIndices(text, matches, trigger.length, censorValue)
	})
	node.nodeValue = text
}

function findAll(str, substr) {
	matches = []
	caret = 0
	while ((index = str.indexOf(substr, caret)) > -1) {
		matches.push(index)
		caret = index + substr.length
	}
	return matches
}

function censorAtIndices(str, indices, gap, replacement) {
	substrings = []
	lastIndex = 0
	indices.forEach(index => {
		substrings.push(str.substring(lastIndex, index))
		lastIndex = index + gap
		substrings.push(replacement)
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