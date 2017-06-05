var casper = require('casper').create();
var fs = require('fs');
var utils = require('utils');

//empty files
var path_article_detail = 'article_detail.txt';
fs.write(path_article_detail, '', 'w');

var url = casper.cli.get("url").replace('"', '');

var terminate = function() {
    this.echo("Exiting..").exit();
};

var processPage = function() {
  var url = this.getElementInfo('meta[property="og:url"]')['attributes']['content'].replace(/(\r\n|\n|\r)/gm,"").trim();
  var title = this.getElementInfo('meta[property="og:title"]')['attributes']['content'].replace(/(\r\n|\n|\r)/gm,"").trim();
  var description = this.getElementInfo('meta[property="og:description"]')['attributes']['content'].replace(/(\r\n|\n|\r)/gm,"").trim();
  var image_url = this.getElementInfo('meta[property="og:image:url"]')['attributes']['content'].replace(/(\r\n|\n|\r)/gm,"").trim();
  var published_date = this.getElementInfo('meta[property="article:published_time"]')['attributes']['content'].replace(/(\r\n|\n|\r)/gm,"").trim();
  published_date = published_date.substr(0,10);
  var detail = url+'\n'+title+'\n'+description+'\n'+image_url+'\n'+published_date;
  fs.write(path_article_detail, detail, 'a');
};

casper.start(url);
casper.waitForSelector('.the-article-header', processPage, terminate);
casper.run();