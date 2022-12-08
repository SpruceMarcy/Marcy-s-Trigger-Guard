
function main(){

	chrome.storage.sync.get(["caseSensitive"], function(result) {
		caseSensitive = result.caseSensitive
		
		mutateTextNodesUnder(document.body, caseSensitive)

		const config = { attributes: false, childList: true, subtree: true };
		const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.type === 'childList') {
			mutation.addedNodes.forEach(node => {
				mutateTextNodesUnder(node, caseSensitive)
			})
			}
		}
		};

		const observer = new MutationObserver(callback);
		observer.observe(document.body, config);
	})
}

function mutateTextNodesUnder(node, caseSensitive){
	textNodesUnder(node).forEach(subNode => {
		mutateTextNode(subNode, caseSensitive)
	})
}

function textNodesUnder(el){
	filter=(node)=>(['SCRIPT','STYLE'].includes(node.parentNode.tagName)||node.nodeValue.trim()===''?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT);
	var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,filter,false);
	while(n=walk.nextNode()) a.push(n);
	return a;
}

function mutateTextNode(node, caseSensitive){
	chrome.storage.sync.get(["triggers"], function(data) {
		text = node.nodeValue
		processedText = caseSensitive ? text : text.toLowerCase()
		data.triggers.forEach(trigger =>{
			processedTrigger = caseSensitive ? trigger : trigger.toLowerCase()
			matchIndex = processedText.indexOf(processedTrigger)
			while (matchIndex>-1){
				matchTrigger = text.substr(matchIndex,trigger.length)
				text = text.replace(matchTrigger,"█████████")
				matchIndex = processedText.indexOf(processedTrigger,matchIndex+1)
			} 
		}) 
		node.nodeValue = text
	});
}

main()