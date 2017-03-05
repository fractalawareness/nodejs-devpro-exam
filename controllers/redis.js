const log = require('../log');
const config = require('config');
const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

class RedisManager{
    constructor() {
        this.client = redis.createClient(config.redis.options);
        this.client.on('error', function (err) {
            log.error(`redis error – ${client.host}:${client.port} – ${err}`);
        });
        this.client.on('connect', function(){
            log.info('Redis connection is up');
        });
    }
    historyKey (item) {
        return `${config.redis.cache.prefix}:${encodeURIComponent(item.url)}:${item.level}:${item.element}`;
    }
    getItem (item, deleteIfFound){
        // It would be better to have 2 separate functions instead of using deleteIfFound
        // workaround. Actually there would be different redis commands for each of them.
        // Read The Little Redis Book to improve your knowladge of Redis.
        let key = this.historyKey(item);
        // Please avoid nesting callbacks, promises and functions
        // by separating them to different parts
        // and/or use generators to write flat async code.
        return new Promise((resolve, reject) => {
            return this.client.getAsync(key).then((data)=>{
                data = JSON.parse(data);
                if (data && data.length){
                    resolve(data);
                    log.info(`Get from cached ${data.length} links`);
                    if(deleteIfFound){
                        this.client.del(key);
                    }
                } else {
                    reject();
                }
            })
        });

    }
    storeItem (item, value){
        let rkey = this.historyKey(item);
        let rvalue = JSON.stringify(value);
        log.info('Cached '+ value.length+' links');
        this.client.set(rkey, rvalue, 'NX', 'EX',  config.redis.cache.expires);
    }
}

exports.createClient = function () {
    return new RedisManager();
};
