const Url = require('url');
const cheerio = require('cheerio');
const request = require('request');
const EventEmitter = require('events');
const fs = require('fs');
const log = require('../log');
const config = require('config');

// Its a good idea to cover everything with logs

module.exports = class Crawler extends EventEmitter {
    constructor({
        url = 'http://www.example.com',
        level = 1,
        element = 'h1',
    } = {}) {
        super();
        this._startUrl = url;
        this._level = level;
        this._element = element;
        this._q = [];
        this._protocol = Url.parse(this._startUrl).protocol;
        this._host = Url.parse(this._startUrl).host;
        this._finished = [];
        this._q.push({
            url: this._startUrl,
            level: 0
        });
        this.start();
    }

    start() {
        this.queryRun();
    }

    finish(){
        this.storeHistory();
        this.emit('finished', this._finished);
    }

    storeHistory(){
        this.appendObject({
            startUrl : this._startUrl,
            level : this._level,
            element : this._element,
        });
        log.info('History stored '+ this._finished.length+' links');
    }

    appendObject(obj){
        let historyFile = fs.readFileSync(config.history.filePath);
        let history = JSON.parse(historyFile);
        history.push(obj);
        let historyJSON = JSON.stringify(history);
        fs.writeFileSync(config.history.filePath, historyJSON);
    }

    queryRun(){
        let item = this._q.pop();
        if (item){
            request(item.url, (error, response, html) => {
                this.requestHandler(error, response, html, item);
            })
        } else{
            this.finish()
        }
    }

    requestHandler(error, response, html, item) {
        if (error) {
            this.emit('error', error);
            return false;
        }
        let $ = cheerio.load(html);
        item.content =   this.contentCollect($);
        this._finished.push(item);
        log.debug('Link collected on level '+ item.level+' :', item.url);
        if(item.level<this._level){
            this.linkCollect($, item);
        }
        this.queryRun()
    }

    contentCollect($){
        let html = [];
        $(this._element).each(function (index, item) {
            html.push($(this).text());
        });
        return html;
    }

    linkCollect($, parent) {
        let self = this;

        $('a[href]').filter(function () {
            let href = $(this).attr('href');
            let url = Url.parse(href);
            if (href.includes('mailto') || (url.host && self._host!==url.host)) {
                return false;
            }
            if (url.host == null) {
                url = Url.parse(self._protocol + '//' + self._host+ href);
            }
            url.hash = null;

            let isDownloaded = self._finished.some(e => e.url === Url.format(url));
            let isinQ = self._q.some(e => e.url === Url.format(url));

            if(!isinQ && !isDownloaded ){
                self._q.push({
                    url: Url.format(url),
                    level: parent.level+1
                });
            }


        })
    }
}
