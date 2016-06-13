'use strict';

const winston = require('winston');
const MicroserviceKit = require('microservice-kit');
const config = require('./config');


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
            if (['info', 'error'].indexOf(args[0]) == -1)
                args.splice(0, 0, 'info');
            args.splice(1, 0, '[shutdownkit]');
            winston.log.apply(winston, args);
        }
    }
});
