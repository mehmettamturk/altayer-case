'use strict';

const config = require('config');
const winston = require('winston');
const MicroserviceKit = require('microservice-kit');

module.exports = new MicroserviceKit({
    type: 'search-service',
    amqp: {
        url: config.get('rabbitmq.url'),
        queues: [
            {
                name: 'Search',
                key: 'search',
                options: {durable: true}
            }
        ],
        logger: function() {
            const args = Array.prototype.slice.call(arguments);
            args.splice(1, 0, '[amqpkit]');

            if (global.IS_SLAVE)
                args.splice(1, 0, '[core]');

            winston.log.apply(winston, args);
        }
    },
    shutdown: {
        logger: function() {
            const args = Array.prototype.slice.call(arguments);
            args.splice(1, 0, '[shutdownkit]');
            winston.log.apply(winston, args);
        }
    }
});
