const Alexa = require('ask-sdk');

const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter'); // included in ask-sdk
const ddbTableName = 'CibelesConcept';
const axios = require('axios');

const { planeamientoNdp, bdcSearch, getPlaneamiento } = require('./APIs');
const { recordManyStreets, recordManyIntents, recordManyPetitions } = require('./utils');
const fillMail = require('./mail').fillMail;

const getProtection = require('./intentHandlers/protection');
const getRecord = require('./intentHandlers/record');
const getUse = require('./intentHandlers/use');
const getRegulations = require('./intentHandlers/regulations');
const getEdificability = require('./intentHandlers/edificability');
const getGeneralInfo = require('./intentHandlers/generalInfo');
const getMail = require('./intentHandlers/mail');

const alexaCanHandle = (handlerInput, intentName) => Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === intentName;

const alexaSpeak = (handlerInput, speech, reprompt = speech) => handlerInput.responseBuilder.speak(speech).reprompt(reprompt).getResponse();

const addIntentsCount = (sessionAttrs, newConsultName) => {
    const historyCounter = sessionAttrs.hasOwnProperty('intentsHistoryCounter') ? sessionAttrs.intentsHistoryCounter : [];
    let newIntentHistoryCounter = Object.assign({}, historyCounter);
    console.log('newIntentHistoryCOunter:')
    console.log(newIntentHistoryCounter)
    newConsultName.forEach(intent => {
        newIntentHistoryCounter[intent] = newIntentHistoryCounter.hasOwnProperty(intent.name) ? newIntentHistoryCounter[intent.name] + 1 : 1;
    });
    console.log(newIntentHistoryCounter)
    return newIntentHistoryCounter;
};

const addPetition = (sessionAttrs, handlerInput, intent) => {
    const petitionsHistory = sessionAttrs.hasOwnProperty('petitionsHistory') ? sessionAttrs.petitionsHistory : [];
    return [...petitionsHistory, {
        time: Date.now().toString(),
        user: handlerInput.requestEnvelope.context.System.user.userId,
        address: sessionAttrs.street,
        intent: intent.length > 1 ? 'general' : intent[0]
    }];
};

async function parseAlexa(handlerInput, intentHandler, newConsultName = []){
    const { Street, Number } = handlerInput.requestEnvelope.request.intent.slots;
    let sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
    console.log('sessionAttrs', sessionAttrs);
    let address = 'Alcalá 23';
    let planeamiento = '';

    if(Street.value !== undefined){
        console.log('New street requested');
        address = Number.value !== undefined ? `${Street.value} ${Number.value}` : Street.value + '1';
        planeamiento = await getPlaneamiento(address);

        setSessionParams(handlerInput, {
            ...sessionAttrs,
            street: planeamiento.parsedStreet,
            planeamiento: planeamiento.planeamiento,
            history: sessionAttrs.hasOwnProperty('history') ? [...sessionAttrs.history, planeamiento.parsedStreet] : [planeamiento.parsedStreet],
            intentsHistoryCounter: addIntentsCount(sessionAttrs, newConsultName),
            petitionsHistory: addPetition({...sessionAttrs, street: planeamiento.parsedStreet}, handlerInput, newConsultName),
            consulted: newConsultName !== [] ? newConsultName : [],
        });
    } else {
        console.log('newConsultName: ', newConsultName);
        setSessionParams(handlerInput, {
            ...sessionAttrs,
            consulted: sessionAttrs.consulted != undefined ? [...new Set(sessionAttrs.consulted.concat(newConsultName))] : newConsultName,
            intentsHistoryCounter: addIntentsCount(sessionAttrs, newConsultName),
            petitionsHistory: addPetition(sessionAttrs, handlerInput, newConsultName)
        });
        planeamiento = {
            planeamiento: sessionAttrs.planeamiento,
            parsedStreet: sessionAttrs.street,
        };

        console.log('consulted: ', sessionAttrs.consulted);
    }

    let out = await intentHandler(planeamiento, sessionAttrs.email);
    out += ' ';
    out += getSuggestions(handlerInput,out);
    return alexaSpeak(handlerInput, out, getSuggestions(handlerInput,out));
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


const getSuggestions = (handlerInput, out='') => {
    let sessionAttrs = handlerInput.attributesManager.getSessionAttributes()
    let consulted = sessionAttrs.consulted;
    let available = ['mail', 'edificabilidad', 'protección', 'expediente', 'normativa', 'usos'];
    console.log('getSuggestions//consulted: ', consulted);
    if (consulted.length < available.length) {
        let toConsult = available.filter( el => !consulted.includes(el) );
        if (toConsult.includes("mail") && (!out.includes("No hay información") && !out.includes("no está protegido."))){
            return '¿Quieres que te envíe un correo con la información que he encontrado?'
        } else {
            toConsult = toConsult.filter( el => el != 'mail').slice(0, 2)
            return 'Puedes preguntar por ' + toConsult.join(' o ') + ' en la misma ubicación'
        }
    }
    return ''
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
            attributesManager.setSessionAttributes({...attributes, email: email});
            console.log('Attributes');
            speakOutput = `Hola ${name}, puedo seguir informándote sobre ${attributes.street} o puedes consultarme sobre una dirección nueva`;
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GeneralInfoIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'GeneralInfo'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getGeneralInfo, ['edificabilidad', 'protección', 'expediente', 'normativa', 'usos'])
};

const EdificabilityIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Edificability'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getEdificability, ['edificabilidad'])
};
const ProtectionGeneralIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionGeneral'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.general, ['protección'])
};

const ProtectionCatalogueIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionCatalogue'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.catalogue, ['protección'])
};

const ProtectionApeIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionApe'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.ape, ['protección'])
};

const ProtectionFelipeIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionFelipe'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.felipe, ['protección'])
};

const ProtectionBipIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionBip'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.bip, ['protección'])
};

const ProtectionBicIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'ProtectionBic'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getProtection.bic, ['protección'])
};

const UseIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Use'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getUse, ['usos'])
};
const RegulationsIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Regulations'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getRegulations, ['normativa'])
};
const RecordIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Record'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getRecord, ['expediente'])
};

const NoIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.NoIntent'),
    handle: async (handlerInput) => {
        let sessionAttrs = handlerInput.attributesManager.getSessionAttributes();
        setSessionParams(handlerInput, {...sessionAttrs, consulted: [...sessionAttrs.consulted, 'mail']});
        let asserter = ["Vale", "Genial", "Maravilloso", "Estupendo", "De acuerdo", "Fabuloso", "De lujo"].random() + '. ';
        return alexaSpeak(handlerInput, asserter + getSuggestions(handlerInput));
    }
};

const MailIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Mail'),
    handle: async (handlerInput) => parseAlexa(handlerInput, getMail, ['mail', 'edificabilidad', 'protección', 'expediente', 'normativa', 'usos'])
};

const HelpIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.HelpIntent'),
    handle: (handlerInput) => alexaSpeak(handlerInput,'Me puedes pregutar ¿qué puedes hacer?')
};
const ThanksIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Thanks'),
    handle: (handlerInput) => {
        let speechOutput = ["No hay de qué!", "Es un placer ayudarte", "Para eso estamos", "No hay nada como la amabilidad madrileña!", "Un placer", "Encantada de ayudar"].random();
        return handlerInput.responseBuilder.speak(speechOutput).getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.CancelIntent') || alexaCanHandle(handlerInput, 'AMAZON.StopIntent'),
    async handle(handlerInput) {
        let history = handlerInput.attributesManager.getSessionAttributes().history || {};
        let intentHistoryCount = handlerInput.attributesManager.getSessionAttributes().intentsHistoryCounter || {};
        let petitionsHistory = handlerInput.attributesManager.getSessionAttributes().petitionsHistory || {};
        let street = handlerInput.attributesManager.getSessionAttributes().street;
        let planeamiento = handlerInput.attributesManager.getSessionAttributes().planeamiento;
        await recordManyStreets(history);
        await recordManyIntents(intentHistoryCount);
        await recordManyPetitions(petitionsHistory);
        handlerInput.attributesManager.setPersistentAttributes({street: street, planeamiento: planeamiento});
        await handlerInput.attributesManager.savePersistentAttributes();
        let speechOutput = ["Hasta pronto!", "Hasta luego!", "Hasta la vista!", "Nos vemos por Madrid!", "Que tengas un buen día", "Nos vemos", "Nos vemos, espero haber sido de ayuda"].random()
        return handlerInput.responseBuilder.speak(speechOutput).getResponse();
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
        let history = handlerInput.attributesManager.getSessionAttributes().history;
        let intentHistoryCount = handlerInput.attributesManager.getSessionAttributes().intentsHistoryCounter || {};
        let petitionsHistory = handlerInput.attributesManager.getSessionAttributes().petitionsHistory || {};
        await recordManyStreets(history);
        await recordManyIntents(intentHistoryCount);
        await recordManyPetitions(petitionsHistory);
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
        const speakOutput = `Estoy encantada de ayudar. Puedes hacerme una consulta sobre urbanismo`;

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
        const speakOutput = `La que has liado! Por favor comunica a mis creadores qué me has dicho para que me puedan arreglar. `;
        return alexaSpeak(handlerInput, speakOutput);
    }
};

Array.prototype.random = function(){
  return this[Math.floor(Math.random()*this.length)];
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
        NoIntentHandler,
        ThanksIntentHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
