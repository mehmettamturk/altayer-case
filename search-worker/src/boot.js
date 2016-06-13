'use strict';

const app = require('./app');
const winston = require('./lib/logger.js');
const microserviceKit = require('./lib/microservicekit');

winston.info('Booting...');

app
    .init()
    .then(() => {
        winston.info('Booted successfuly.');
    })
    .catch((err) => {
        winston.error('Cannot boot.', err);
        microserviceKit.shutdownKit.gracefulShutdown();
    });
