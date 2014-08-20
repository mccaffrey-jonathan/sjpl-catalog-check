function checkAmzBookPage() {
    var metas = document.getElementsByTagName('meta');

    for (i=0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') == 'title') {
            var titleBits = metas[i].getAttribute('content').split(':');
            if (titleBits.length > 1 && titleBits[0].indexOf("Amazon.com") > -1) {
                return titleBits[1];
            }
            return titleBits[0];
        }
        // if (metas[i].getAttribute('name') == 'keywords') {
        //     return metas[i].getAttribute('content');
        // }
    }

    return undefined;
}

// Result
titleResults = {
    'bookTitle': checkAmzBookPage(),
};

titleResults;
