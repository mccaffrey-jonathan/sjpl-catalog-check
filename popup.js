// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// TODO change icon to appear only when you go onto an Amazon or Google books page?
// Icon should indicate positive search results?

function catalogInfoFromElement(index, el) {
    res = {
        'desc': $(el).find('.itemMediaDescription').first().text(),
        'year': $(el).find('.itemMediaYear').first().text(),
	'thumbnailSrc': $(el).find('img.browseThumbnail').attr('src'),
    };

    authorEl = $(el).find('div.dpBibTitle a#recordDisplayLink2Component').first();
    res['author'] = $(el).find('div.dpBibAuthor a#authorDisplayLinkComponent').first().text().trim();
    res['title'] = authorEl.text().trim();
    res['url'] = 'http://discover.sjlibrary.org' + authorEl.attr('href');
    for (i = 0; i < 15; i++) {
        if (res['title'] != "") {
            break;
        }
        authorEl = $(el).find('div.dpBibTitle a#recordDisplayLink2Component_' + i.toString()).first();
        res['author'] = $(el).find('div.dpBibAuthor a#authorDisplayLinkComponent_' + i.toString()).first().text().trim();
        res['title'] = authorEl.text().trim();
        res['url'] = 'http://discover.sjlibrary.org' + authorEl.attr('href');
    }

    return res;
}

function querySJPLCatalogPageForList(dom)
{
    console.log('Checking catalog page for item list');
    return $(dom).find('table.browseResult').map(catalogInfoFromElement).get();
}

function querySJPLCatalog(query_string, success_cb, error_cb)
{
    var url = 'http://discover.sjlibrary.org/iii/encore_sjpl/search/C__S' +
        encodeURIComponent(query_string) +
        '__Orightresult__U1?lang=eng&suite=sjpl';

    console.log('making request to ' + url);
    $.get( url, {}, function(data, textStatus, jqXHR) {
        results = {
	    'results': querySJPLCatalogPageForList(data),
            'url': url,
	};
        success_cb(results);
    })
    .fail(error_cb);
}

function setCurrentTabUrl(url) {
    chrome.tabs.getSelected(null, function(tab){
        //Your code below...
        var tabUrl = encodeURIComponent(tab.url);
        var tabTitle = encodeURIComponent(tab.title);
        chrome.tabs.update(tab.id, {'url':  url});
    });
}

function catalogSuccess(data) {
    console.log('Presenting successful results!');
    data.results = data.results.slice(0, 5);
    var template = $('#popup-results-template').html()
    var html = Mustache.render(template, data);
    $('.root').html(html);
    $('.changeTabHref').click(function() {
        setCurrentTabUrl($(this).attr('href'));
    });
}

function catalogError() {
    $('.root').html('Could not reach SJPL catalog!');
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.bookTitle!= undefined) {
            $('.root').html('Checking catalog for ' + request.bookTitle);
            querySJPLCatalog(request.bookTitle, catalogSuccess, catalogError);
        } else {
            $('.root').html(request.err);
        }
    });

chrome.tabs.executeScript(null, {file: "tab-book-query.js"});
