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
const getProtection = require('./intentHandlers/protection');
const getRecord = require('./intentHandlers/record');
const getUse = require('./intentHandlers/use');
const getRegulations = require('./intentHandlers/regulations');
const getEdificability = require('./intentHandlers/edificability');
const getGeneralInfo = require('./intentHandlers/generalInfo')
const { planeamientoCoordinates } = require('./APIs');

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
    console.log(request);
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

    async function edificability(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getEdificability(street);
        console.log(out);
        agent.add(out);
    };

    async function regulations(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getRegulations(street);
        console.log(out);
        agent.add(out);
    };

    async function record(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getRecord(street);
        console.log(out);
        agent.add(out);
    };

    async function use(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getUse(street);
        console.log(out);
        agent.add(out);
    };

    async function generalInfo(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getGeneralInfo(street);
        console.log(out);
        agent.add(out);
    };

    async function protectionCatalogue(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getProtection.catalogue(street);
        console.log(out);
        agent.add(out);
    }

    async function protectionGeneral(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getProtection.general(street);
        console.log(out);
        agent.add(out);
    }

    async function protectionFelipe(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getProtection.felipe(street);
        console.log(out);
        agent.add(out);
    }

    async function protectionApe(agent){
        const street = agent.parameters.address || 'alcalá 23';
        console.log(street);
        let out = await getProtection.ape(street);
        console.log(out);
        agent.add(out);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Welcome', welcome);
    intentMap.set('Default Fallback', fallback);
    intentMap.set('General request', generalRequest);
    intentMap.set('Edificability', edificability);
    intentMap.set('General Info', generalInfo);
    intentMap.set('Protection.catalogue', protectionCatalogue);
    intentMap.set('Protection.general', protectionGeneral);
    intentMap.set('Protection.felipe', protectionFelipe);
    intentMap.set('Protection.ape', protectionApe);
    intentMap.set('Regulations', regulations);
    intentMap.set('Record', record);
    intentMap.set('Use', use);
    agent.handleRequest(intentMap);
});

app.use('/', router);
module.exports = app;
