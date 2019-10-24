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
const correctRequest = require('./intentHandlers/correctRequest');
const protection = require('./intentHandlers/protection');
const { planeamientoCoordinates } = require('./APIs');

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
    const agent = new WebhookClient({ request, response });

    // As handler logic grows please move to intentHandlers/ folder as done with correctRequest.js
    const welcome = agent => {
        return planeamientoCoordinates().then(res => {
            console.log(res);
            agent.add('Hola \ud83d, ¿En qué te puedo ayudar hoy?');
        });
    };
    const fallback = agent => recordQuery(agent, "Default fallback");
    const generalRequest = agent => recordQuery(agent, "General request");
    const activity = agent => recordQuery(agent, "Activity");
    const edificability = agent => recordQuery(agent, "Edificability");
    const generalInfo = agent => recordQuery(agent, "General Info");
    // const isProtected = agent => recordQuery(agent, "Is protected");
    const regulations = agent => recordQuery(agent, "Regulations");
    const use = agent => recordQuery(agent, "Use");
    const urbanRecord = agent => recordQuery(agent, "Urban record");


    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Welcome', welcome);
    intentMap.set('Default Fallback', fallback);
    intentMap.set('Correct request', correctRequest);
    intentMap.set('General request', generalRequest);
    intentMap.set('Activity', activity);
    intentMap.set('Edificability', edificability);
    intentMap.set('General Info', generalInfo);
    intentMap.set('Protection.general', protection);
    intentMap.set('Regulations', regulations);
    intentMap.set('Urban record', urbanRecord);
    intentMap.set('Use', use);
    agent.handleRequest(intentMap);
});

app.use('/', router);
module.exports = app;
