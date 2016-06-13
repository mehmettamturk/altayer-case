'use strict';

const _ = require('lodash');
const winston = require('search-worker/lib/logger');
const ErrorType = require('microservice-kit').ErrorType;


/**
 * Handles the error of promise chain. If opt_done provided, handled
 * error will be passed into opt_done callback.
 * @param {Function} opt_done
 * @return {Function}
 */
module.exports.handleError = function(opt_done) {
    return function(err) {
        if (!_.isObject(err)) {
            const message = _.isString(err) ? err : 'Internal server error';
            err = new ErrorType.InternalError(message);
        } else if (err.name != 'InternalError' && err.name != 'ClientError') {
            if (err instanceof Error)
                winston.error('Native error occured!', err);

            let message = _.isString(err.message) ? err.message : 'Internal server error';
            err = new ErrorType.InternalError(err && err.message)
        }

        if (_.isFunction(opt_done))
            opt_done(err);
    }
};
