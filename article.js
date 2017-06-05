var casper = require('casper').create();
var fs = require('fs');
var utils = require('utils');

//empty files
var path_article_url = 'article_url.txt';
fs.write(path_article_url, '', 'w');

var url = casper.cli.get("url").replace('"', '');
var page_limit = casper.cli.get("page_limit");
console.log(url);
console.log(page_limit);
var page_count = 0;

var terminate = function() {
    this.echo("Exiting..").exit();
};

function getLinks() {	
	var selector = '.cate_content .cate_content article .title a';
		
    var links = document.querySelectorAll(selector);
    return Array.prototype.map.call(links, function(e) {		
        return e.getAttribute('href');
    });
}
var processPage = function() {
	if(page_limit > 0 && page_count == page_limit)
	{
		return terminate.call(casper);
	}		
	
    // step 1: Scrape the link
    links = this.evaluate(getLinks);
    fs.write(path_article_url, links, 'a');
	
	// step 2: terminate if reach the condition
	// if more button dont see will terminate 
	var more_btn_selector = '.cate_content .more a';
    if (!this.exists(more_btn_selector)) {
        return terminate.call(casper);
    }
	    
    // Part 3: Click the Next link and wait for the next page 
    var more_btn_selector = '.cate_content .more a';	
    this.thenClick(more_btn_selector).then(function() {
        casper.waitForSelector('.cate_content', processPage, terminate);
    });
    
    page_count = page_count + 1;
   
};

casper.start(url);
casper.waitForSelector('.cate_content', processPage, terminate);
casper.run();