"use strict";

const config = require('config');
const request = require('request');
const router = require('express').Router();

/**
 * Get Search
 */
router.get('/optimized-search', function(req, res, next) {
    var keyword = req.query.keyword;
    request('http://test.sonsuzdongu.com/query.php?keyword=' + keyword, function (error, response, body) {
        if (!error && response.statusCode == 200)
            res.send(body);
        else
            res.status(500).send(err);
    });
});

module.exports = router;
