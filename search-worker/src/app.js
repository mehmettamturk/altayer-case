const config = require('config');
const request = require('request');
const microserviceKit = require('search-worker/lib/microservicekit');
const ConsumerHelper = require('search-worker/lib/helpers/consumer');

const redis = require("redis"),
      client = redis.createClient(config.get('redis.url'));

microserviceKit
  .init()
  .then(() => {
      console.log('Search-Worker initialized.');
      const searchQueue = microserviceKit.amqpKit.getQueue('search');
      searchQueue.consumeEvent('SEARCH_KEYWORD', (data, done) => {
          console.log('SEARCH: ', data);
          if (!data || (data && !data.keyword))
              return ConsumerHelper.handleError(done);

          client.get(data.keyword, function(err, response) {
              if (err) return ConsumerHelper.handleError(done);

              if (response)
                  return done(null, JSON.parse(response));

              request('http://test.sonsuzdongu.com/query.php?keyword=' + data.keyword, function (error, response, body) {
                  if (error)
                      return ConsumerHelper.handleError(done);

                  if (response.statusCode == 200 && body) {
                      client.set(data.keyword, JSON.stringify(body));
                      client.expire(data.keyword, config.get('searchTTL'));

                      return done(null, body);
                  }

                  done(null, []);
              });
          });
      });
  })
  .catch((err) => {
      console.log('Cannot boot', err.stack);
      process.exit(1)
  });
