// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setCurrentTabUrl(url) {
    chrome.tabs.getSelected(null, function(tab){
        //Your code below...
        var tabUrl = encodeURIComponent(tab.url);
        var tabTitle = encodeURIComponent(tab.title);
        chrome.tabs.update(tab.id, {'url':  url});
    });
}

function showCatalogSearch(search) {
    console.log('show search results from: ')
    console.log(search);
    search.results.items = search.results.items.slice(0, 5);
    var template = $('#popup-results-template').html()
    var html = Mustache.render(template, search);
    root = $('.root').html(html);
    $('.changeTabHref').click(function() {
        setCurrentTabUrl($(this).attr('href'));
    });
}

$(document).ready(function() {
    showCatalogSearch(chrome.extension.getBackgroundPage().latestCatalogSearch);
});

// function catalogError() {
//     $('.root').html('Could not reach SJPL catalog!');
// }

