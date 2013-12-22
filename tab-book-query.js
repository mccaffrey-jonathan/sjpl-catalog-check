function checkAmzBookPage() {
    var metas = document.getElementsByTagName('meta');

    for (i=0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') == 'title') {
            return metas[i].getAttribute('content').split(':')[0];
        }
    }

    return undefined;
}

var amz = checkAmzBookPage();

// Result
titleResults = {
    'bookTitle': amz,
};

titleResults;
