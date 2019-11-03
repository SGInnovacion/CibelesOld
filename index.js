'use strict';
const awsServerlessExpress = require('aws-serverless-express');
const dialogflow = require('./dialogflow');
const server = awsServerlessExpress.createServer(dialogflow);

exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context); };
