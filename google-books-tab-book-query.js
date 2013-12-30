function checkGoogleBooksPage() {
    var metas = document.getElementsByTagName('meta');

    for (i=0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') == 'title') {
            return metas[i].getAttribute('content');
        }
    }

    return undefined;
}

document.body.style.backgroundColor = 'red';

// Result
titleResults = {
    'bookTitle': checkGoogleBooksPage(),
};

titleResults;
