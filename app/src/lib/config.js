'use strict';

const nconf = require('nconf');
const winston = require('winston');
const CONFIG = process.env.CONFIG;

if (!global.IS_SLAVE)
    winston.info('Reading config file ' + (CONFIG || '`config/default.json` by default'));

nconf.env('__');

if (CONFIG)
    nconf.file('custom-config', CONFIG);

nconf.file('config/default.json');


module.exports = nconf;
