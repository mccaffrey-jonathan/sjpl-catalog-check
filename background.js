// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {

    // TODO extend to Google books, at least.
    var prefixes = [
        "http://www.amazon.com",
        "https://www.amazon.com",
    ];

    console.log('On page: ' + tab.url);
    for (i = 0; i < prefixes.length; i++) {
        if (tab.url.indexOf(prefixes[i]) == 0) {
            console.log("Show page action");
            chrome.pageAction.show(tabId);
            return;
        }
    }

    console.log("Hide page action");
    chrome.pageAction.hide(tabId);
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// TODO!  Do a search on page load and update the icon to indicate the catalog

