'use strict';

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    config = require('altayer/config'),
    path = require('path'),
    session = require('express-session');

app.enable('trust proxy');
app.disable('x-powered-by');

app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function(req, res, next) {
    res.locals.SITE_URL = config.get('SITE_URL');
    res.locals.API_URL = config.get('API_URL');
    next();
});

/**
 * Routing.
 */
app.use('/vendor', express.static(__dirname + '/../vendor'));
app.use('/api', require('altayer/routes/api'));
app.use('/', express.static(__dirname + '/../../www'));

app.listenBound = function() {
    return new Promise(function(resolve, reject) {
        server.listen(process.env.PORT || config.get('http:port'), function(err) {
            if (err) return reject(err);

            resolve();
            console.log('API booted successfully');
        });
    });
};

module.exports = app;
