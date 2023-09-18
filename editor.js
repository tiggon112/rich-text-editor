var handle = false;

document.addEventListener('selectionchange', () => {
    console.log("selectionchange");

    let doc = document;
    let tag = 'div';
    let node = doc.getSelection().anchorNode;

    let selection = doc.getSelection();

    // if (selection.anchorNode.nodeName === 'BODY' 
    //         && selection.anchorOffset === 0 
    //         && selection.isCollapsed === true) {
    //     let div = doc.createElement('div');
    //     div.className = 'unusual-div';
    //     div.appendChild(doc.createElement('br'));

    //     node = selection.anchorNode;
    //     node.innerHTML = "";
    //     node.appendChild(div);

    //     selection.setPosition(div);
    //     return;
    // }

    // if (selection.anchorNode.nodeType === Node.TEXT_NODE && selection.anchorNode.parentNode.nodeName === 'BODY') {
    //     let div = doc.createElement('div');
    //     div.className = 'unusual-div';
    //     node = selection.anchorNode;        
    //     node.parentNode.insertBefore(div, node);
        
    //     if (node.textContent.trim() === "") {
    //         div.appendChild(doc.createElement('br'));
    //         node.parentNode.removeChild(node);
    //         selection.setPosition(div);
    //     }
    //     else {
    //         let offset = selection.anchorOffset;
    //         div.appendChild(node, offset);
    //     }
    // }

    while (node) {
        if (node.nodeName === 'BODY') break;
        if (node.className === 'unusual-code') {
            tag = 'code';
            break;
        }
        if (node.nodeName === 'H1' || node.nodeName === 'H2' || node.nodeName === 'H3') {
            tag = node.nodeName.toLowerCase();
            break;
        }
        node = node.parentNode;
    }
    window.parent.document.getElementById(tag).checked = true;

    window.parent.document.getElementById('bold').checked = doc.queryCommandState('bold');
    window.parent.document.getElementById('italic').checked = doc.queryCommandState('italic');
    window.parent.document.getElementById('underline').checked = doc.queryCommandState('underline');
    window.parent.document.getElementById('strikeThrough').checked = doc.queryCommandState('strikeThrough');


});
document.body.addEventListener('keydown', (e) => {
    let doc = document;
    console.log("keydown!");
    let selection = doc.getSelection();
    let node = selection.anchorNode;

    switch (node.nodeName) {
        case 'BODY':
        case 'LI':
            let div;
            div = doc.createElement('div');
            div.className = 'unusual-div';
            div.appendChild(doc.createElement('br'));
            node.innerHTML = "";
            node.appendChild(div);
            selection.setPosition(div);
            node = div;
            break;
        case 'DIV':
            if (node.className === 'unusual-code') {
                let div;
                div = doc.createElement('div');
                div.className = 'unusual-div';
                div.appendChild(doc.createElement('br'));
                node.innerHTML = "";
                node.appendChild(div);
                selection.setPosition(div);
                node = div;
            }
            break;

        default:
            break;
    }
    while (node) {
        if (node.nodeName === 'DIV') break;
        if (node.nodeName === 'H1') return;
        if (node.nodeName === 'H2') return;
        if (node.nodeName === 'H3') return;
        if (node.nodeName === 'H4') return;
        if (node.nodeName === 'H5') return;
        if (node.nodeName === 'H6') return;
        if (node.parentNode.nodeName === 'BODY') {
            let div = doc.createElement('div');
            div.className = 'unusual-div';
            let range = doc.createRange();
            range.selectNode(node);
            range.surroundContents(div);
            node = div;
            break;
        }
        if (node.parentNode.nodeName === 'DIV' && node.parentNode.className === 'unusual-code') {
            let div = doc.createElement('div');
            div.className = 'unusual-div';
            let range = doc.createRange();
            range.selectNode(node);
            range.surroundContents(div);
            node = div;
            break;
        }
        if (node.parentNode.nodeName === 'LI') {
            let div = doc.createElement('div');
            div.className = 'unusual-div';
            let range = doc.createRange();
            range.selectNode(node);
            range.surroundContents(div);
            node = div;
            break;
        }
        node = node.parentNode;
    }

    if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (node.parentNode.nodeName !== 'LI') {
            let range = doc.createRange();
            range.setStart(node, 0);
            range.setEnd(selection.anchorNode, selection.anchorOffset);
            if (range.toString().trim() === '-' && selection.isCollapsed) {
                let ul = doc.createElement('ul');
                ul.className = 'unusual-ul';
                let li = doc.createElement('li');
                li.className = 'unusual-li';
                let div = doc.createElement('div');
                div.className = 'unusual-div';
                div.appendChild(doc.createElement('br'));
                li.appendChild(div);
                ul.appendChild(li);
                node.parentNode.insertBefore(ul, node);
                node.parentNode.removeChild(node);
                selection.setPosition(div);
                return;
            }

        }
        else if (node.parentNode.nodeName === 'LI'
            && node.parentNode.previousElementSibling?.nodeName === 'LI') {
            let li = node.parentNode;
            let preli = li.previousElementSibling;
            let ul = doc.createElement('UL');
            if (preli.lastChild?.nodeName === 'UL') {
                ul = preli.lastChild;
            }
            else {
                preli.appendChild(ul);
            }
            ul.appendChild(li);
            selection.setPosition(node);
        }
    }
    else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (node.parentNode.nodeName === 'LI') {
            let li = node.parentNode;
            let ul = li.parentNode;
            let outli = ul.parentNode;
            if (li.nextElementSibling) {
                let innerul = doc.createElement('ul');
                if (li.lastChild.nodeName === 'UL')
                    innerul = li.lastChild;
                else
                    li.appendChild(innerul);
                while (li.nextSibling) {
                    innerul.appendChild(li.nextSibling);
                }
            }
            if (outli.nodeName === 'LI') {
                let outul = outli.parentNode;
                outul.insertBefore(li, outli.nextSibling);
                if (!ul.firstChild) {
                    outli.removeChild(ul);
                }
                selection.setPosition(node);
            }
            else {
                while (li.lastChild) {
                    outli.insertBefore(li.lastChild, ul.nextSibling);
                }
                if (!li.firstChild) {
                    ul.removeChild(li);
                }
                if (!ul.firstChild) {
                    outli.removeChild(ul);
                }
                selection.setPosition(node);
            }
        }
    }
    else if (e.key === ' ') {
        if (node.parentNode.nodeName !== 'LI') {
            let range = doc.createRange();
            range.setStart(node, 0);
            range.setEnd(selection.anchorNode, selection.anchorOffset);

            //Create unordered list(UL/LI)
            if (range.toString().trim() === '-' && selection.isCollapsed) {
                e.preventDefault();
                e.stopPropagation();
                let ul = doc.createElement('ul');
                ul.className = 'unusual-ul';
                let li = doc.createElement('li');
                li.className = 'unusual-li';
                let anchorNode = selection.anchorNode;
                range.deleteContents();
                ul.appendChild(li);
                node.parentNode.insertBefore(ul, node);
                li.appendChild(node);
                if (node.textContent === "") {
                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }
                    node.appendChild(doc.createElement('br'));
                    selection.setPosition(node);
                }
                else
                    selection.setPosition(anchorNode);
                return;
            }


            //Create Ordered List (OL/LI)
            if (range.toString().trim() === parseInt(range.toString().trim())?.toString() + '.') {
                e.preventDefault();
                e.stopPropagation();
                let ol = doc.createElement('ol');
                ol.className = 'unusual-ol';
                let li = doc.createElement('li');
                li.className = 'unusual-li';
                let anchorNode = selection.anchorNode;

                if (node.previousSibling?.nodeName === 'OL' && range.toString().trim() !== '1.')
                    ol = node.previousSibling;
                else
                    node.parentNode.insertBefore(ol, node);

                range.deleteContents();
                ol.appendChild(li);
                li.appendChild(node);
                if (node.textContent === "") {
                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }
                    node.appendChild(doc.createElement('br'));
                    selection.setPosition(node);
                }
                else
                    selection.setPosition(anchorNode);
                return;
            }
        }
    }
    else if (e.key === 'Backspace') {

    }
    else if (e.key === 'Delete') {

    }
    else if (e.key === 'Enter') {

    }
    else if (e.key === 'ArrowLeft') {

    }
    else if (e.key === 'ArrowRight') {

    }
    else if (e.key === 'ArrowUp') {

    }
    else if (e.key === 'ArrowDown') {

    }


});

// function setTag(tag) {
//     let doc = document;
//     console.log(tag, "is set!");


//     let isCode = false;
//     let node = doc.getSelection().anchorNode;

//     if (node.nodeName === 'BODY') {
//         let newNode;
//         if (tag === 'code') {
//             newNode = doc.createElement('div');
//             newNode.className = 'unusual-div';
//             node.appendChild(newNode);
//             node = newNode;
//         }
//         newNode = doc.createElement(tag);
//         newNode.className = 'unusual-' + tag;
//         newNode.appendChild(doc.createElement('br'));
//         node.appendChild(newNode);
//         doc.getSelection().setPosition(newNode);
//         return;
//     }
//     else if (node.nodeType === Node.TEXT_NODE && node.parentNode.nodeName === 'BODY') {
//         let range = doc.createRange();
//         range.selectNodeContents(node);

//         if (tag === 'code') {
//             let codeRange = doc.getSelection().getRangeAt(0);
//             let code = doc.createElement('code');
//             code.className = 'unusual-code';
//             codeRange.surroundContents(code);
//             if (code.textContent.trim() === "") {
//                 code.appendChild(doc.createTextNode('\uFEFF'));
//             }
//             let div = doc.createElement('div');
//             div.className = 'unusual-div';
//             range.surroundContents(div);
//             doc.getSelection().selectAllChildren(code);
//             return;
//         }
//         else {
//             let newNode = doc.createElement(tag);
//             newNode.className = 'unusual-' + tag;
//             range.surroundContents(newNode);
//             doc.getSelection().selectAllChildren(newNode);
//             return;
//         }
        
//     }
    

//     while (node.nodeName !== 'BODY') {
//         if (node.className === 'unusual-code') {
//             isCode = true;
//             break;
//         }
//         node = node.parentNode;
//     }

//     if (tag === 'code') {
//         if (doc.getSelection().toString().includes("\n")) {
//             let node = doc.createElement('div');
//             node.className = 'unusual-code';
//             let range = doc.createRange();
//             let startNode = doc.getSelection().getRangeAt(0).startContainer;
//             let endNode = doc.getSelection().getRangeAt(0).endContainer;
//             if (startNode?.nodeName !== 'BODY' && endNode?.nodeName !== 'BODY') {
//                 while (startNode.parentNode.nodeName !== 'BODY') {
//                     startNode = startNode.parentNode;
//                 }
//                 range.setStart(startNode, 0);
//                 while (endNode.parentNode.nodeName !== 'BODY') {
//                     endNode = endNode.parentNode;
//                 }
//                 range.setEnd(endNode, 0);
//                 let child = startNode;
//                 while (child) {
//                     let nextChild = child.nextSibling;
//                     node.appendChild(child);
//                     child = nextChild;
//                     if (child == endNode) {
//                         node.appendChild(child);
//                         break;
//                     }
//                 }
//                 range.deleteContents();
//                 range.insertNode(node);
//                 let selectRange = doc.createRange();
//                 selectRange.selectNodeContents(node);
//                 doc.getSelection().removeAllRanges();
//                 doc.getSelection().addRange(selectRange);
//             }
//         }
//         else if (!isCode) {
//             let node = doc.createElement(tag);
//             let range = doc.getSelection().getRangeAt(0);

//             let fragment = range.extractContents();
//             if (!fragment.firstChild?.toString().startsWith("\uFEFF"))
//                 node.innerText = "\uFEFF";
//             node.appendChild(fragment);
//             node.setAttribute('class', 'unusual-' + tag);
//             range.deleteContents();
//             range.insertNode(node);
//             // doc.getSelection().setPosition(node);
//         }

//         return;
//     }

//     if (isCode && tag === 'div') {
//         if (node.nodeName !== 'CODE') {
//             while (node.firstChild) {
//                 node.parentNode.insertBefore(node.firstChild, node);
//             }
//             node.parentNode.removeChild(node);
//             return;
//         }
//         else {
//             let node1 = doc.createElement('code');
//             node1.classname = 'unusual-code';
//             let range = doc.getSelection().getRangeAt(0);
//             let range1 = doc.createRange();
//             range1.setStart(node.firstChild, 0);
//             range1.setEnd(range.startContainer, range.startOffset);
//             let fragment1 = range1.extractContents();
//             node1.appendChild(fragment1);
//             node.parentNode.insertBefore(node1, node);
//             if (node1.textContent.trim() === "")
//                 node1.parentNode.removeChild(node1);

//             let fragment = range.extractContents();
//             let node2 = doc.createTextNode("\uFEFF");
//             node.parentNode.insertBefore(node2, node);
//             if (fragment.firstChild) {
//                 node.parentNode.insertBefore(fragment, node);
//                 range.setStartAfter(node2);
//                 range.setEndBefore(node);
//             }
//             else {
//                 range.setStart(node2, 1);
//                 range.collapse(true);
//             }
//             node.insertBefore(doc.createTextNode("\uFEFF"), node.firstChild);
//             if (node.textContent.trim() === "")
//                 node.parentNode.removeChild(node);

//             return;
//         }
//     }

//     if (isCode) return;

//     let curnode = doc.getSelection().anchorNode;

//     while (curnode) {

//         if (curnode.nodeName === 'LI') return;
//         if (curnode.parentNode.nodeName === 'LI') return;
//         if (curnode.parentNode.nodeName === 'UL') return;
//         if (curnode.parentNode.nodeName === 'DIV'
//             && curnode.parentNode.classname === 'unusual-code') return;
//         if (curnode.nodeName === 'BODY') break;
//         if (curnode.nodeName === 'DIV') break;
//         if (curnode.nodeName === 'H1') break;
//         if (curnode.nodeName === 'H2') break;
//         if (curnode.nodeName === 'H3') break;
//         if (curnode.nodeName === 'H4') break;
//         if (curnode.nodeName === 'H5') break;
//         if (curnode.nodeName === 'H6') break;
//         if (curnode.parentNode.nodeName === 'BODY') break;
//         curnode = curnode.parentNode;
//     }

//     if (curnode.nodeName.toLowerCase() === tag)
//         return;

//     // h1 - h6 would replace any hosting DIV
//     if (tag == 'h1' || tag == 'h2' || tag == 'h3' || tag == 'h4' || tag == 'h5' || tag == 'h6' || tag == 'div') {
//         let node = doc.createElement(tag);
//         let anchorNode = doc.getSelection().anchorNode;
//         let anchorOffset = doc.getSelection().anchorOffset;
//         if (curnode.nodeName === 'BODY') {
//             curnode.insertBefore(node, curnode.firstChild);
//             doc.getSelection().setPosition(node);
//         }
//         else if (curnode.nodeType === Node.ELEMENT_NODE) {
//             while (curnode.firstChild) {
//                 node.appendChild(curnode.firstChild);
//             }
//             curnode.parentNode.replaceChild(node, curnode);
//             if (curnode === anchorNode)
//                 doc.getSelection().setPosition(node);
//             else
//                 doc.getSelection().setPosition(anchorNode, anchorOffset);
//         }
//         else {
//             curnode.parentNode.insertBefore(curnode);
//             curnode.parentNode.removeChild(curnode);
//             doc.getSelection().setPosition(anchorNode, anchorOffset);
//         }
//     }
// }

function setTag(tag) {
    let doc = document;
	if (doc == null || doc.getSelection().rangeCount == 0)
		return;
        if (doc == null || doc.getSelection().rangeCount == 0)
		return;

	let node = doc.getSelection().anchorNode;

		
	let isCode	= false;
    let selection = doc.getSelection();
	let codeNode	= doc.getSelection().anchorNode;
	while (codeNode.nodeName !== 'BODY') {
		if (codeNode.className === 'unusual-code') {
			isCode = true;
			break;
		}
		codeNode = codeNode.parentNode;
	}

	if (tag === 'code') {
		if (selection.anchorNode.nodeName === 'BODY' && selection.focusNode.nodeName === 'BODY'  && selection.isCollapsed === false) {
            let range       = doc.getSelection().getRangeAt(0);
            let fragment    = range.cloneContents();
            let code		= doc.createElement('div');
			code.className	= 'unusual-code';
            code.appendChild(fragment);
            range.deleteContents();
            range.selectNodeContents(code);
        }
		if (doc.getSelection().toString().includes("\n")) {
			node		= doc.createElement('div');
			node.className	= 'unusual-code';
			let range 		= doc.createRange();
			let startNode	= doc.getSelection().getRangeAt(0).startContainer;
			let endNode		= doc.getSelection().getRangeAt(0).endContainer;
			if (startNode?.nodeName !== 'BODY' && endNode?.nodeName !== 'BODY') {
				while (startNode.parentNode.nodeName !== 'BODY') {
					startNode = startNode.parentNode;
				}
				range.setStart(startNode, 0);
				while (endNode.parentNode.nodeName !== 'BODY') {
					endNode = endNode.parentNode; 
				}
				range.setEnd(endNode, 0);
				let child = startNode;
				while (child) {
					let nextChild = child.nextSibling;
					node.appendChild(child);
					child = nextChild;
					if (child == endNode) {
						node.appendChild(child);
						break;
					}
				}
				range.deleteContents();
				range.insertNode(node);
				if (!node.nextElementSibling) {
					let div = doc.createElement('div');
					div.className = 'unusual-div';
					div.appendChild(doc.createElement('br'));
					node.parentNode.insertBefore(div, node.nextSibling);
				}
				let selectRange = doc.createRange();
				selectRange.selectNodeContents(node);
				doc.getSelection().removeAllRanges();
				doc.getSelection().addRange(selectRange);

			}	
		}
		else if(!isCode) {
			node		= doc.createElement(tag);
			let range		= doc.getSelection().getRangeAt(0);
			let fragment	= range.extractContents();
			if (!fragment.firstChild?.toString().startsWith("\uFEFF"))
				node.innerText	= "\uFEFF";
			node.appendChild(fragment);
			node.setAttribute('class', 'unusual-' + tag);
			range.deleteContents();
			range.insertNode(node);
			doc.getSelection().selectAllChildren(node);
		}

		return;	
	}
	
	if (isCode && tag === 'div') {
		console.log("release code");
		if (codeNode.nodeName !== 'CODE') {
			while (codeNode.firstChild) {
				codeNode.parentNode.insertBefore(codeNode.firstChild, codeNode);
			}
			codeNode.parentNode.removeChild(codeNode);
			return;
		}
		else {
			let node1		= doc.createElement('code');
			let range		= doc.getSelection().getRangeAt(0);
			let range1		= doc.createRange();
			range1.setStart(codeNode.firstChild, 0);
			range1.setEnd(range.startContainer, range.startOffset);
			let fragment1	= range1.extractContents();
			node1.appendChild(fragment1);
			codeNode.parentNode.insertBefore(node1, codeNode);
			if (node1.textContent.trim() === "")
				node1.parentNode.removeChild(node1);

			let fragment	= range.extractContents();
			let node2 = doc.createTextNode("\uFEFF");
			codeNode.parentNode.insertBefore(node2, codeNode);
			if (fragment.firstChild) {
				codeNode.parentNode.insertBefore(fragment, codeNode);
				range.setStartAfter(node2);
				range.setEndBefore(codeNode);
			}
			else {
				range.setStart(node2, 1);
				range.collapse(true);
			}
			codeNode.insertBefore(doc.createTextNode("\uFEFF"), codeNode.firstChild);
			if (codeNode.textContent.trim() === "")
				codeNode.parentNode.removeChild(codeNode);

			return;
		}
	}
	
	if(isCode) return;

	let curnode = doc.getSelection().anchorNode;

	while (curnode) {
		
		if (curnode.nodeName === 'LI') return;
		if (curnode.parentNode.nodeName === 'LI') return;
		if (curnode.parentNode.nodeName === 'UL') return;
		if (curnode.parentNode.nodeName === 'DIV'
			&& curnode.parentNode.classname === 'unusual-code') return;
		if (curnode.nodeName === 'BODY') break;
		if (curnode.nodeName === 'DIV') break;
        if (curnode.nodeName === 'H1') break;
        if (curnode.nodeName === 'H2') break;
        if (curnode.nodeName === 'H3') break;
        if (curnode.nodeName === 'H4') break;
        if (curnode.nodeName === 'H5') break;
        if (curnode.nodeName === 'H6') break;
		if (curnode.parentNode.nodeName === 'BODY') break;
		curnode = curnode.parentNode;
	}

	if (curnode.nodeName.toLowerCase() === tag)
		return;

	// h1 - h6 would replace any hosting DIV
	if (tag == 'h1' || tag == 'h2' || tag == 'h3' || tag == 'h4' || tag == 'h5' || tag == 'h6' || tag == 'div') {
		node			= doc.createElement(tag);
		node.className  = 'unusual-' + tag;
		let anchorNode		= doc.getSelection().anchorNode;
		let anchorOffset	= doc.getSelection().anchorOffset;
		if (curnode.nodeName === 'BODY') {
			curnode.insertBefore(node, curnode.firstChild);
			doc.getSelection().setPosition(node);
		}
		else if (curnode.nodeType === Node.ELEMENT_NODE) {
			while (curnode.firstChild) {
				node.appendChild(curnode.firstChild);
			}
			curnode.parentNode.replaceChild(node, curnode);
			if (curnode === anchorNode)
				doc.getSelection().setPosition(node);
			else
				doc.getSelection().setPosition(anchorNode, anchorOffset);
		}		
		else
		{
			curnode.parentNode.insertBefore(anchorNode, curnode);
			curnode.parentNode.removeChild(curnode);
			doc.getSelection().setPosition(anchorNode, anchorOffset);
		}
	}
}



var observer = new MutationObserver(function (mutationList) {
    // Access the content of the iframe
    console.log("MutaitionObserver in editor.js!");
    let doc = document;
    
    
    if (doc === null) {
        return;
    }

    mutationList.forEach(function (mutation) {
        console.log(mutation);
        if (mutation.type == 'childList')
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeName == 'CODE'
                    || (node.nodeName == 'DIV' && node.className !== 'unusual-code')
                    || node.nodeName == 'H1'
                    || node.nodeName == 'H2'
                    || node.nodeName == 'H3'
                    || node.nodeName == 'H4'
                    || node.nodeName == 'H5'
                    || node.nodeName == 'H6'
                    || node.nodeName == 'LI'
                    || node.nodeName == 'OL'
                    || node.nodeName == 'P'
                    || node.nodeName == 'UL')
                    node.setAttribute('class', 'unusual-' + node.nodeName.toLowerCase());
            });
    });

    let selection = doc.getSelection();
    let node = selection.anchorNode;

    if (node.nodeName === 'BODY' || node.nodeName === 'LI' || node.nodeName === 'CODE') {
        let text = node.textContent;
        if (!text.includes('\uFEFF') && text.trim() === '') {
            let div = doc.createElement('div');
            div.className = 'unusual-div';
            div.appendChild(doc.createElement('br'));
            node.innerHTML = '';
            node.appendChild(div);
            doc.getSelection().setPosition(div);
        }
    }
    
});

document.body.onload = () => {
    observer.observe(document.body, { childList: true, subtree: true });
}