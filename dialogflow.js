'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');

const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var express = require('express');
const app = express();
const router = express.Router();

const { recordQuery } = require('./utils');
const getProtection = require('./intentHandlers/protection');
const getRecord = require('./intentHandlers/record');
const getUse = require('./intentHandlers/use');
const getRegulations = require('./intentHandlers/regulations');
const getEdificability = require('./intentHandlers/edificability');
const getGeneralInfo = require('./intentHandlers/generalInfo');

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
    console.log(request);
    const agent = new WebhookClient({ request, response });

    // As handler logic grows please move to intentHandlers/ folder as done with correctRequest.js

    const fallback = agent => recordQuery(agent, "Default fallback");

    async function parseDialog(agent, intentHandler){
        const street = agent.parameters.address || 'alcalá 23';
        let out = await intentHandler(street);
        console.log(out);
        agent.add(out);
        // agent.add(out);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Fallback', fallback);
    intentMap.set('Edificability', agent => parseDialog(agent, getEdificability));
    intentMap.set('General Info', agent => parseDialog(agent, getGeneralInfo));
    intentMap.set('Protection.catalogue', agent => parseDialog(agent, getProtection.catalogue));
    intentMap.set('Protection.general', agent => parseDialog(agent, getProtection.general));
    intentMap.set('Protection.felipe', agent => parseDialog(agent, getProtection.felipe));
    intentMap.set('Protection.ape', agent => parseDialog(agent, getProtection.ape));
    intentMap.set('Protection.bic', agent => parseDialog(agent, getProtection.bic));
    intentMap.set('Protection.bip', agent => parseDialog(agent, getProtection.bip));
    intentMap.set('Regulations', agent => parseDialog(agent, getRegulations));
    intentMap.set('Record', agent => parseDialog(agent, getRecord));
    intentMap.set('Use', agent => parseDialog(agent, getUse));
    agent.handleRequest(intentMap);
});

app.use('/', router);
module.exports = app;
