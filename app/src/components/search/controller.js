"use strict";

const request = require('request');
const router = require('express').Router();

var microserviceKit = require('altayer/lib/microservicekit');
var searchQueue = microserviceKit.amqpKit.getQueue('search');

/**
 * Get Search
 */
router.get('/optimized-search', function(req, res, next) {
    searchQueue
        .sendEvent('SEARCH_KEYWORD', { keyword: req.query.keyword }, { persistent: true })
        .then((searchResults) => {
            res.send(searchResults);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = router;
