#!/usr/bin/env node

var program = require('commander');
var agent = require('superagent');
const log = require('./log');
const config = require('config');
const chalk = require('chalk');

program
    .version('0.0.1')
    .option('-u, --url <url>' )
    .option('-l, --level <level>')
    .option('-e, --element <element>')
    .parse(process.argv)

let url = generateURL(program.url,program.level, program.element );
log.info('Url generated from cli and start dowload '+ url);
agent
    .get(url)
    .set('Accept', 'application/json')
    .end(function(err, res){
        if (err || !res.ok) {
            log.info('Oh no! error');
            exitWithError(err);
        } else {
            log.info('Url downloaded from cli '+ JSON.stringify(res.body)+' links');
        }
    });


function generateURL(url, level, element){
    return config.application.srapperUrl + '?url=' + encodeURI(url) + '&level='+level+ '&element='+element;
}
function exitWithError(err) {
    console.error(chalk.red(err.message));
    process.exit(1);
}

