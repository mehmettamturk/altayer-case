'use strict';

const microserviceKit = require('search-worker/lib/microservicekit');

class App {

    init() {
        return microserviceKit
            .init()
            .then(() => {
                return microserviceKit.amqpKit.prefetch(1);
            })
            .then(() => {
                this.run();
            });
    }

    run() {
        this.consumers = require('search-worker/app/consumer');
    }
}

module.exports = new App();
