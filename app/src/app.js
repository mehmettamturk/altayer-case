'use strict';

var microserviceKit = require('altayer/lib/microservicekit');

microserviceKit
    .init()
    .then(() => {
        console.info('Microservicekit is initalized.');

        const app = require('altayer/app/index');
        app.listenBound();
    })
    .catch((err) => {
        console.error("Cannot initalize microservicekit!", err);
    });
