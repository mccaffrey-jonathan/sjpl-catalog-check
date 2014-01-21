function catalogInfoFromElement(index, el) {
    res = {
        'desc': $(el).find('.itemMediaDescription').first().text(),
        'year': $(el).find('.itemMediaYear').first().text(),
	'thumbnailSrc': $(el).find('img.browseThumbnail').attr('src'),
    };

    var titleEl = $(el).find('div.dpBibTitle a#recordDisplayLink2Component').first();
    res['author'] = $(el).find('div.dpBibAuthor a#authorDisplayLinkComponent').first().text().trim();
    res['title'] = titleEl.text().trim();
    res['url'] = 'http://discover.sjlibrary.org' + titleEl.attr('href');
    for (i = 0; i < 15; i++) {
        if (res['title'] != "") {
            break;
        }
        var titleEl = $(el).find('div.dpBibTitle a#recordDisplayLink2Component_' + i.toString()).first();
        res['author'] = $(el).find('div.dpBibAuthor a#authorDisplayLinkComponent_' + i.toString()).first().text().trim();
        res['title'] = titleEl.text().trim();
        res['url'] = 'http://discover.sjlibrary.org' + titleEl.attr('href');
    }

    return res;
}

function querySJPLCatalogPageForList(dom)
{
    console.log('Checking catalog page for item list');
    return $(dom).find('span#resultsAnyComponent').map(catalogInfoFromElement).get();
}

function querySJPLCatalog(query_string, success_cb, error_cb)
{
    var url = 'http://discover.sjlibrary.org/iii/encore_sjpl/search/C__S' +
        encodeURIComponent(query_string) +
        '__Orightresult__U1?lang=eng&suite=sjpl';

    console.log('making request to ' + url);
    xhr = $.get( url, {}, function(data, textStatus, jqXHR) {
        results = {
	    'items': querySJPLCatalogPageForList(data),
            'fullResultUrl': url,
	};
        success_cb(results);
    })

    if (error_cb) {
        xhr.fail(error_cb);
    }
}

