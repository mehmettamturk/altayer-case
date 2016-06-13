'use strict';

const winston = require('winston');
const Papertrail = require('winston-papertrail').Papertrail;
const config = require('./config');
const microserviceKit = require('./microservicekit');
const Elasticsearch = require('winston-elasticsearch');



// Add `.toJSON()` method to Error prototype. This is useful while
// sending errors as payload
if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });

// Add papertrail transport if configured
if (config.get('papertrail:host') && config.get('papertrail:port')) {
    winston.add(winston.transports.Papertrail, {
        host: config.get('papertrail:host'),
        port: config.get('papertrail:port'),
        program: microserviceKit.getName()
    });
}

// Add elaticsearch transport
if (config.get('elasticsearch_log:uri')) {
    const mappingTemplate = require('elastic-log-mappings').microservice;

    // Override `index name` template
    mappingTemplate.template = config.get('elasticsearch_log:microservice_index_prefix') + '-*';

    const esTransportOpts = {
        level: 'info',
        indexPrefix: config.get('elasticsearch_log:microservice_index_prefix'),
        transformer: function(logData) {
            const transformed = {};
            transformed['@timestamp'] = new Date().toISOString();
            transformed.message = logData.message;
            transformed.level = logData.level;
            transformed.microservice = microserviceKit.getName();
            transformed.payload = logData.meta;
            return transformed;
        },
        ensureMappingTemplate: true,
        mappingTemplate: mappingTemplate,
        clientOpts: {
            host: config.get('elasticsearch_log:uri')
        }
    };

    winston.add(winston.transports.Elasticsearch, esTransportOpts);
}


module.exports = winston;
