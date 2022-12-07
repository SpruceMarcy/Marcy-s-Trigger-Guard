
function main(){
	//chrome.storage.sync.get(["triggers"]).then((result) => {
	//	buildACDS(result.triggers)
	//});

	mutateTextNodesUnder(document.body)

	const config = { attributes: false, childList: true, subtree: true };

	const callback = (mutationList, observer) => {
	for (const mutation of mutationList) {
		if (mutation.type === 'childList') {
		mutation.addedNodes.forEach(node => {
			mutateTextNodesUnder(node)
		})
		}
	}
	};

	const observer = new MutationObserver(callback);
	observer.observe(document.body, config);
}

//function buildACDS(triggers){
//
//}

function mutateTextNodesUnder(node){
	textNodesUnder(node).forEach(subNode => {
		mutateTextNode(subNode)
	})
}

function textNodesUnder(el){
	filter=(node)=>(['SCRIPT','STYLE'].includes(node.parentNode.tagName)||node.nodeValue.trim()===''?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT);
	var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,filter,false);
	while(n=walk.nextNode()) a.push(n);
	return a;
}

function mutateTextNode(node){
	chrome.storage.sync.get(["triggers"], function(result) {
		text = node.nodeValue
		result.triggers.forEach(trigger =>{
			if (text.indexOf(trigger)>-1){
				console.log(text)
				console.log(trigger)
				text = text.replace(trigger,"[blocked]")
			}
		}) 
		node.nodeValue = text
	});
}

main()