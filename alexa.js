// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk');

const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter'); // included in ask-sdk
const ddbTableName = 'CibelesConcept';
const axios = require('axios');

const { planeamientoNdp, bdcSearch, getPlaneamiento } = require('./APIs');
const {sendMail} = require('./utils');
const fillMail = require('./mail').fillMail;


const getProtection = require('./intentHandlers/protection');
const getRecord = require('./intentHandlers/record');
const getUse = require('./intentHandlers/use');
const getRegulations = require('./intentHandlers/regulations');
const getEdificability = require('./intentHandlers/edificability');
const getGeneralInfo = require('./intentHandlers/generalInfo');

const alexaCanHandle = (handlerInput, intentName) => Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === intentName;

const alexaSpeak = (handlerInput, speech, reprompt = speech) => handlerInput.responseBuilder.speak(speech).reprompt(reprompt).getResponse();

async function parseAlexa(handlerInput, intentHandler, name = ''){
    const { Street, Number } = handlerInput.requestEnvelope.request.intent.slots;

    let address = 'Alcalá 23';
    let requestInfo = '';
    if(Street.value !== undefined && Number.value !== undefined){
        console.log('New street requested');
        address = `${Street.value} ${Number.value}`;
        requestInfo = await getPlaneamiento(address);
        setSessionParams(handlerInput, {
            street: requestInfo.parsedStreet,
            planeamiento: requestInfo.planeamiento,
            consulted: name !== '' ? [name] : [],
        });
    } else {
        let sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
        console.log(sessionAttrs.consulted);
        setSessionParams(handlerInput, {...sessionAttrs, consulted: [...sessionAttrs.consulted, name]});
        requestInfo = { planeamiento: sessionAttrs.planeamiento, parsedStreet: sessionAttrs.street };
    }

    let out = await intentHandler(requestInfo);
    out += getSuggestions(handlerInput);
    return alexaSpeak(handlerInput, out, getSuggestions(handlerInput));
}

function getPersistenceAdapter(tableName) {
    // Not in Alexa Hosted Environment
    return new ddbAdapter.DynamoDbPersistenceAdapter({
        tableName: tableName,
        createTable: true,
    });
}

function setSessionParams(handlerInput, params){
    handlerInput.attributesManager.setSessionAttributes(params)
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        const { apiAccessToken, apiEndpoint, user } = handlerInput.requestEnvelope.context.System;
        const getEmailUrl = apiEndpoint.concat(
            `/v2/accounts/~current/settings/Profile.email`
        );
        const getName = apiEndpoint.concat(
            `/v2/accounts/~current/settings/Profile.givenName`
        );

        let mailResult = "";
        try {
            mailResult = await axios.get(getEmailUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + apiAccessToken
                }
            });
        } catch (error) {
            console.log(error);
        }

        let nameResult = "";
        try {
            nameResult = await axios.get(getName, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + apiAccessToken
                }
            });
        } catch (error) {
            console.log(error);
        }

        const email = mailResult && mailResult.data;
        const name = nameResult && nameResult.data;

        console.log( name + ', your email is ' + email);

        let speakOutput = `Hola, soy Cibeles. Estoy preparada para responderte a preguntas urbanísticas sobre usos, edificabilidades, normativa, protección o expedientes. ¿Sobre qué quieres información?`;

        if(Object.keys(attributes).length > 0){
            attributesManager.setSessionAttributes(attributes);
            console.log('Attributes', attributes);
            speakOutput = `Hola ${name}, puedo seguir informándote sobre ${attributes.street} o puedes consultarme sobre una dirección nueva`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const EdificabilityIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Edificability'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getEdificability, 'edificabilidad')
};
const ProtectionGeneralIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionGeneral'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.general, 'protección')
};

const ProtectionCatalogueIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionCatalogue'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.catalogue)
};

const ProtectionApeIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionApe'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.ape)
};

const ProtectionFelipeIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionFelipe'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.felipe)
};

const ProtectionBipIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionBip'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.bip)
};

const ProtectionBicIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionBic'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.bic)
};

const UseIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Use'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getUse, 'usos')
};
const RegulationsIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Regulations'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getRegulations, 'normativa')
};
const RecordIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Record'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getRecord, 'expediente')
};

const NoIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.NoIntent'),
    handle: async (handlerInput) => alexaSpeak(handlerInput, 'Genial. ¿Qué más quieres saber?')
};

const MailIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Mail'),
    handle: async (handlerInput) => {
        const { apiAccessToken, apiEndpoint, user } = handlerInput.requestEnvelope.context.System;

        const getEmailUrl = apiEndpoint.concat(
            `/v2/accounts/~current/settings/Profile.email`
        );
        let mailResult = "";
        try {
            mailResult = await axios.get(getEmailUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + apiAccessToken
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            const email = mailResult && mailResult.data;
            let street = handlerInput.attributesManager.getSessionAttributes().street;
            let planeamiento = handlerInput.attributesManager.getSessionAttributes().planeamiento;
            console.log('FILL')
            console.log(fillMail(planeamiento, street))
            let success = await sendMail(email, fillMail(planeamiento, street), street);
            console.log('success');
            console.log(success);
            let out = 'Ya te lo he enviado, qué más quieres saber?';
            return alexaSpeak(handlerInput, out);
        } catch (error) {
            console.log(error);
            return alexaSpeak(handlerInput, 'Vaya, he tenido problemas para enviártelo. Comprueba que has habilitado los permisos de correo en la skill.');
        }
    }
};

const getSuggestions = (handlerInput) => {
    let consulted = handlerInput.attributesManager.getSessionAttributes().consulted;
    let available = ['mail', 'edificabilidad', 'protección', 'expediente', 'normativa', 'usos'];
    let toConsult = available.filter( ( el ) => !consulted.includes( el ) );

    if (toConsult.includes("mail")){
        return '¿Quieres que te envíe un correo con la información que he encontrado?'
    } else {
        return '¿Quieres preguntar por ' + toConsult.slice(1, 3).join(' o ') + ' en la misma ubicación?'

    }

}

const HelpIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.HelpIntent'),
    handle: (handlerInput) => alexaSpeak(handlerInput,'Me puedes pregutar ¿qué puedes hacer?')
};
const CancelAndStopIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.CancelIntent') || alexaCanHandle(handlerInput, 'AMAZON.StopIntent'),
    handle(handlerInput) {
        return alexaSpeak(handlerInput,'Goodbye')
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        // Any cleanup logic goes here.
        let street = handlerInput.attributesManager.getSessionAttributes().street;
        let planeamiento = handlerInput.attributesManager.getSessionAttributes().planeamiento;
        handlerInput.attributesManager.setPersistentAttributes({street: street, planeamiento: planeamiento});
        await handlerInput.attributesManager.savePersistentAttributes();
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return alexaSpeak(handlerInput, speakOutput)
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `La que has liado!`;
        return alexaSpeak(handlerInput, speakOutput);
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(getPersistenceAdapter(ddbTableName))
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        EdificabilityIntentHandler,
        ProtectionGeneralIntentHandler,
        ProtectionCatalogueIntentHandler,
        ProtectionApeIntentHandler,
        ProtectionFelipeIntentHandler,
        ProtectionBipIntentHandler,
        ProtectionBicIntentHandler,
        UseIntentHandler,
        RegulationsIntentHandler,
        RecordIntentHandler,
        MailIntentHandler,
        IntentReflectorHandler,
        NoIntentHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
