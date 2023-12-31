var iframe = document.getElementById('editor-iframe');
var codeview = document.getElementById('code-view');
// document.getElementById(name)?.contentDocument
// Use MutationObserver to detect changes to the DOM within the iframe
iframe.onload = (e) => {
    codeview.value = iframe.contentDocument.body.innerHTML;
    observer.observe(iframe.contentDocument.body, { attributes: true, childList: true, subtree: true, characterData: true});
}
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // Access the content of the iframe
    console.log("MutaitionObserver!");
    let iframeDoc = document.getElementById('editor-iframe').contentDocument;
    let codeview = document.getElementById('code-view');
    codeview.value = iframeDoc.body.innerHTML.replace('\uFEFF', '&#xFEFF');
  });
});

codeview.onchange = () => {
    console.log("codeview is changed");
    iframe.contentDocument.body.innerHTML = codeview.value;
}

function tagclicked(e) {
    iframe.focus();
    iframe.contentDocument.body.focus();
    iframe.contentWindow.setTag(e.target.id);
}

function styleSelected(e) {
    iframe.focus();
    iframe.contentDocument.body.focus();
    iframe.contentDocument.execCommand(e.target.id, false, null);

}
