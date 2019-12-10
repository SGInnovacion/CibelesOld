'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');

const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var express = require('express');
const app = express();
const router = express.Router();

const { recordQuery, recordStreet, recordPetition, recordIntent, toTitleCase } = require('./utils');
const { getPlaneamiento } = require('./APIs');
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
    console.log('request');
    console.log(request);
    const agent = new WebhookClient({ request, response });
    const fallback = agent => recordQuery(agent, "Default fallback");

    async function parseDialog(agent, intentHandler, newConsultName=[]){
        let address = agent.parameters.address
        let number = agent.parameters.number.toString()
        let street = address + ' ' + number
        let consulted = [];
        let planeamiento = false;
        console.log('street: ' + street);
        if (street.length > 0 && number.length > 0) {
            console.log('A new street was received');
            
            consulted = newConsultName;
            planeamiento = await getPlaneamiento(street);

        } else {
            try {
                street = agent.getContext('session-variables').parameters.street;
                planeamiento = agent.getContext('session-variables').parameters.planeamiento;
                console.log('We will be using the street stored in the session-variables');
                consulted = [...new Set(agent.getContext('session-variables').parameters.consulted.concat(newConsultName))];
            } catch (e) {
                if (address.length === 0) {
                    console.log('There is no street stored, we will ask the user for one');
                    console.log(e);
                    agent.add('¿Puedes decirme la calle?');
                }
                if (number.length === 0) {
                    console.log('There is no number stored, we will ask the user for one');
                    console.log(e);
                    agent.add('¿Puedes decirme el número?')
                }
                return
            }
        }

        agent.setContext({ name: 'session-variables',
            lifespan: 99999,
            parameters: {
                street: street,
                consulted: consulted,
                planeamiento: planeamiento,
            }
        });

        let out = await intentHandler(planeamiento || street, true);
        console.log('Output: ' + out);


        agent.add(out + getSuggestions(consulted));
        //         try {
        //     await recordIntent(newConsultName.length > 1 ? 'general' : newConsultName[0], 1);
        //     await recordStreet(planeamiento.parsedStreet);
        //     await recordPetition({
        //         user: agent.session,
        //         source: agent.requestSource,
        //         intent: newConsultName.length > 0 ? 'general' : newConsultName[0],
        //         address: planeamiento.parsedStreet,
        //         time: Date.now().toString() });
        // } catch (e) {
        //     console.log('Analytics records crashed:');
        //     console.log(e);
        // }
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Fallback', fallback);
    intentMap.set('Edificability', agent => parseDialog(agent, getEdificability, ['edificabilidad']));
    intentMap.set('General Info', agent => parseDialog(agent, getGeneralInfo));
    intentMap.set('Protection.catalogue', agent => parseDialog(agent, getProtection.catalogue));
    intentMap.set('Protection.general', agent => parseDialog(agent, getProtection.general, ['protección']));
    intentMap.set('Protection.felipe', agent => parseDialog(agent, getProtection.felipe));
    intentMap.set('Protection.ape', agent => parseDialog(agent, getProtection.ape));
    intentMap.set('Protection.bic', agent => parseDialog(agent, getProtection.bic));
    intentMap.set('Protection.bip', agent => parseDialog(agent, getProtection.bip));
    intentMap.set('Regulations', agent => parseDialog(agent, getRegulations, ['normativa']));
    intentMap.set('Record', agent => parseDialog(agent, getRecord, ['expediente']));
    intentMap.set('Use', agent => parseDialog(agent, getUse, ['usos']));
    agent.handleRequest(intentMap);
});

const getSuggestions = (consulted=[]) => {
    // let available = ['mail', 'edificabilidad', 'protección', 'expediente', 'normativa', 'usos']; // In case mails can be sent
    let available = ['edificabilidad', 'protección', 'expediente', 'normativa', 'usos'];
    if (consulted.length < available.length) {
        let toConsult = available.filter( el => !consulted.includes(el) );
        if (toConsult.includes("mail") && (!out.includes("No hay información") && !out.includes("no está protegido."))){
            return '¿Quieres que te envíe un correo con la información que he encontrado?'
        } else {
            toConsult = toConsult.filter( el => el != 'mail').slice(0, 2);
            const asserter = ["Puedes preguntar por ", "También te puedo informar sobre ", "Puedes consultar sobre ", "Puedo informarte sobre "].random();
            const there = [' en la misma ubicación', ' en esa dirección', ' en el mismo lugar', ' en esa ubicación'].random();
            return asserter + toConsult.join(' o ') + there;
        }
    }
    return ''
};

Array.prototype.random = function(){
    return this[Math.floor(Math.random()*this.length)];
};

app.use('/', router);
module.exports = app;
