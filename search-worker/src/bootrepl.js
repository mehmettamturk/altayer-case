'use strict';

const app = require('./app');
const winston = require('winston');
const repl = require("repl");
const promisify = require("repl-promised").promisify;
const microserviceKit = require('./lib/microservicekit');

winston.info('Booting REPL console...');

app
    .init(true)
    .then(() => {
        winston.info('Booted successfuly.');
        console.log('Type `app` to reach singleton app instance.');

        const replServer = repl.start({prompt: "> "});
        promisify(replServer);
        replServer.context.app = app;

        replServer.on('exit', () => {
            microserviceKit.shutdownKit.gracefulShutdown();
        });
    })
    .catch((err) => {
        winston.error('Cannot boot.', err);
        microserviceKit.shutdownKit.gracefulShutdown();
    });

