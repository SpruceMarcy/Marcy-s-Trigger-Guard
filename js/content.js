
function main(){
	//find notice
	var allDivs = $$("div,span,form,#dialog")
	var cookieJars = []
	for(var d of allDivs){
		if(isFixed(d)){
			d2 = getSimplestChild(d);
			//console.log("Fixed:")
			//console.log(d.innerText.toLowerCase())
			// At this point 'd' is an element that scrolls with the screen
			if(containsKeyPhrase(d2)){
				//console.log(d2)
				if(!cookieJars.includes(d2)){
					cookieJars.push(d2)
				}
			}
		}
	}
	
	//console.log(cookieJars)
	var cookieJars = filterForChildren(cookieJars)
	//console.log(cookieJars)
	
	for(var jar of cookieJars){	
		//console.log(jar)
		
		var gButCount = 0
		var bButCount = 0
		var goodButton
		var badButton
		for(var b of getButtons(jar)){
			
			if(isGoodButton(b)){
				gButCount += 1
				goodButton = b
				styleGoodButton(b)
			}
			else if(isBadButton(b)){
				bButCount += 1
				badButton = b
				styleBadButton(b)
			}
		}
		
		if(gButCount>0||bButCount>0){
			styleCaughtNotice(jar)
		}
		if(gButCount>0&&bButCount>0){
			console.log("Buttons:")
			console.log(goodButton.innerText)
			console.log(badButton.innerText)
		}
	}
}

// Detection methods

function isFixed(e){
	pos = window.getComputedStyle(e).getPropertyValue("position")
	return pos==="fixed" || pos==="absolute" || e.className.toLowerCase().includes("cookie") || e.className.toLowerCase().includes("consent")
}

function getSimplestChild(e){
	currentE = e
	while(currentE.children.length==1){
		currentE = currentE.children[0]
	}
	return currentE
}

function getButtons(e){
	buttonsNL = e.querySelectorAll("button,a,input")
	buttons = Array.prototype.slice.call(buttonsNL);
	
	for(var c of e.getElementsByTagName("*")){
		if(c.children.length==0 && c.innerText && c.innerText.length<20){
			buttons.push(c)
		}
	}
	//console.log(buttons)
	return filterForChildren(buttons)
}

function isGoodButton(e){
	bText = e.innerText.toLowerCase()
	return bText.includes("reject") || bText.includes("manage") || bText.includes("configure") || bText.includes("option") || bText.includes("customi") || bText===("learn more") || bText.includes("setting") 
}
function isBadButton(e){
	bText = e.innerText.toLowerCase()
	return bText.includes("accept") || bText.includes("agree")
}


function containsKeyPhrase(e){
	return e.innerText && e.innerText.toLowerCase().includes("cookie")
}
// Mutator methods

function styleCaughtNotice(e){
	e.style.boxShadow = "0px 0px 19px 13px #FF0000";
	addConditionalPadding(e)
	//e.style.backgroundColor = "purple";
}

function styleGoodButton(e){
	e.style.borderStyle = "solid";
	e.style.borderColor = "green";
	e.style.borderWidth = "3px";
	e.style.backgroundColor = "green";
	e.style.color = "white";
	for(var c of e.children){
		c.style.color = "white";
	}
	addConditionalCurves(e)
}

function styleBadButton(e){
	e.style.borderStyle = "solid";
	e.style.borderColor = "red";
	e.style.borderWidth = "3px";
	e.style.backgroundColor = "transparent";
	e.style.color = "darkgray";
	for(var c of e.children){
		c.style.color = "darkgray";
	}
	addConditionalCurves(e)
}

function addConditionalPadding(e){
	if (window.getComputedStyle(e).getPropertyValue("padding")==="0px"){
		e.style.padding = "2px"
	}
	
}

function addConditionalCurves(e){
	if (window.getComputedStyle(e).getPropertyValue("border-radius")==="0px"){
		e.style.borderRadius = "2px"
	}
	
}

// Interactor methods

function doClick(node, selector) {
    var didSomething = false;
    for (var i = 0; i < node.length; i++) {
        if (!node[i].dataset.cookieAwayClicked) {
            node[i].click();
            node[i].dataset.cookieAwayClicked = true;
            didSomething = true
        }
    }
    if (didSomething) {
        console.log("click", selector)
    }
}

// Helper methods

var $$ = function (s) {
    return document.querySelectorAll(s)
};
function filterForChildren(es){
	var newArr = [...es].filter(function(item) {
		for(ele of es){
			if(ele!=item && ele.contains(item)){
				return false;
			}
		}
		return true;
	});
	return newArr
}

main()
setTimeout(main, 400);
setTimeout(main, 1000);
//setTimeout(main, 2000);