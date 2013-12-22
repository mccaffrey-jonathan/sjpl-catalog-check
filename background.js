function catalogResultsSatisfyQuery(request, results) {
    // TODO add a measure between request title and best match
    return true; 
}

function handleTitleToQuery(tabId, request) {
    if (request.bookTitle == undefined) {
        console.log(request.err);
        return;
    }

    console.log('Found title: ' + request.bookTitle);

    // ignore errors quietly?
    querySJPLCatalog(request.bookTitle, function(results) {
        if (catalogResultsSatisfyQuery(request, results)) {
            window.latestCatalogSearch = {
                'request': request,
    'results': results,
            };
            chrome.pageAction.show(tabId);
        }
    });
}

function startCheckPageForTitle(tabId, tab, result_cb) {
    // Very weirdly, this worked with null but not tabId,
    // tabId is more correct, since null just targets the active tab
    // not the one that changed.  Have to figure out why.
    // chrome.tabs.executeScript(tabId, {file: "tab-book-query.js"}, function(results) {
    chrome.tabs.executeScript(null, {file: "tab-book-query.js"}, function(results) {
        if (!results || results.length < 1) {
            return;
        }

        result_cb(results[0]);
    });
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // TODO should we restructure this to be prettier?
    chrome.pageAction.hide(tabId);

    // TODO extend to Google books, at least.
    var prefixes = [
        "http://www.amazon.com",
        "https://www.amazon.com",
    ];

    console.log('On page: ' + tab.url);
    for (i = 0; i < prefixes.length; i++) {
        if (tab.url.indexOf(prefixes[i]) == 0) {
            console.log('Checking page for title');
            startCheckPageForTitle(tabId, tab, _.partial(handleTitleToQuery, tabId));
            return;
        }
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

