'use strict';

const ConsumerHelper = require('search-worker/lib/helpers/consumer');
const config = require('search-worker/lib/config');

const request = require('request');
const redis = require("redis"),
      client = redis.createClient(config.get('redis.url'));

const microserviceKit = require('search-worker/lib/microservicekit');
const SearchQueue = microserviceKit.amqpKit.getQueue('search');


/**
 * @param {string} keyword
 * @param {Function(err, data)} done
 */
SearchQueue.consumeEvent('SEARCH_KEYWORD', (data, done) => {
    if (!data)
        return ConsumerHelper.handleError(done);

    client.get(data.keyword, function(err, data) {
        if (err) return ConsumerHelper.handleError(done);

        if (data)
            return done(null, JSON.parse(data));

        request('http://test.sonsuzdongu.com/query.php?keyword=' + data.keyword, function (error, response, body) {
            if (error)
                return ConsumerHelper.handleError(done);

            if (response.statusCode == 200 && body) {
                client.set(data.keyword, JSON.stringify(body));
                client.expire(data.keyword, 15);

                return done(null, body);
            }

            done(null, []);
        });
    });
});
