function checkAmzBookPage() {
    var metas = document.getElementsByTagName('meta');

    for (i=0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') == 'title') {
            return metas[i].getAttribute('content').split(':')[0];
        }
    }

    return null;
}

var amz = checkAmzBookPage();
if (amz != null) {
    // window.alert('checked amz found: ' + amz);
    chrome.runtime.sendMessage({
        bookTitle: amz,
    });
} else {
    chrome.runtime.sendMessage({
        err: "Sorry, we could not identify what item's page you are on!"
    });
}
