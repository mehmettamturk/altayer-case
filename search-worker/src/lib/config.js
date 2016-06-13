'use strict';

const _ = require('lodash');
const debug = require('debug')('search-worker:lib:config');
const nconf = require('nconf');
const winston = require('winston');
const CONFIG = process.env.CONFIG;


winston.info('Reading config file ' + (CONFIG || '`config/default.json` by default'));

nconf.env('__');

if (CONFIG)
    nconf.file('custom-config', CONFIG);

nconf.file('config/default.json');


function transformArrayProperty(key) {
    var value = nconf.get(key);

    try {
        if (_.isString(value)) {
            debug(`Transforming: ${key}. Initial value is ${value}(${typeof value} -> JSON)`);
            value = JSON.parse(value);
        }
    } catch(e) {
        debug(`${key} cannot be a string! Discarding ${key}...`, e);
        value = [];
    }

    nconf.set(key, value);
}

['legacyOwners'].forEach(transformArrayProperty);

module.exports = nconf;
