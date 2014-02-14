function catalogResultsSatisfyQuery(request, results) {
    // TODO add a measure between request title and best match?
    // Spurious matches may not be a major problem...

    // Could we cross-check with something like ISBN #?
    // For now, check at least 1 item returned.
    return results.items.length >= 1;
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

function startCheckPageForTitle(tabId, tab, scriptToRun, result_cb) {
    chrome.tabs.executeScript(tabId, {file: scriptToRun}, function(results) {

        if (chrome.runtime.lastError) {
            console.error(scriptToRun + ' failed to run: ' + chrome.runtime.lastError.message);
        }

    // chrome.tabs.executeScript(null, {file: scriptToRun}, function(results) {
        if (!results || results.length < 1) {
            return;
        }

        result_cb(results[0]);
    });
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    chrome.pageAction.hide(tabId);

    // TODO extend to Google books, at least.
    var prefixes = {
        'http://www.amazon.com': 'amz-tab-book-query.js',
        'https://www.amazon.com': 'amz-tab-book-query.js',
        'http://books.google.com/books': 'google-books-tab-book-query.js',
    };

    console.log('On page: ' + tab.url);
    for (var prefix in prefixes) {
        if (!prefixes.hasOwnProperty(prefix)) {
            continue;
        }

        if (tab.url.indexOf(prefix) != 0) {
            continue;
        }

        var scriptToRun = prefixes[prefix];

        console.log('Checking page for title with ' + scriptToRun);
        startCheckPageForTitle(tabId, tab, scriptToRun, _.partial(handleTitleToQuery, tabId));
    }
}

// Listen for any changes to the URL of any tab.
//
// There is a significant delay between page load and when the query is
// executed but it doesn't seem solvable.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

