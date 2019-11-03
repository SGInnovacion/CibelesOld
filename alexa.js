// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const getProtection = require('./intentHandlers/protection');
const getRecord = require('./intentHandlers/record');
const getUse = require('./intentHandlers/use');
const getRegulations = require('./intentHandlers/regulations');
const getEdificability = require('./intentHandlers/edificability');
const getGeneralInfo = require('./intentHandlers/generalInfo');

const alexaCanHandle = (handlerInput, intentName) => Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === intentName;

const alexaSpeak = (handlerInput, speech, reprompt = speech) => handlerInput.responseBuilder.speak(speech).reprompt(reprompt).getResponse();

async function parseAlexa(handlerInput, intentHandler){
    const { Street, Number, Calificator } = handlerInput.requestEnvelope.request.intent.slots;
    const address = `${Street.value} ${Number.value}${Calificator.value !== undefined? Calificator.value : ''}`;
    const out = await intentHandler(address);
    return alexaSpeak(handlerInput, out);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `Hola, Soy Cibeles, el servicio de búsqueda urbanística del Ayuntamiento de Madrid. Puedo responder a tus consultas sobre edificabilidad, protección, normativa, usos o expedientes. Dime la categoría sobre la que quieres preguntar para que té de una explicación más detallada, o pregúntame directamente. Por ejemplo: ¿Qué puedo construir en la parcela RC1 del APE 02 27?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'HelloWorldIntent'),
    handle(handlerInput) {
        const speakOutput = `Hola, Soy Cibeles, el servicio de búsqueda urbanística del Ayuntamiento de Madrid. Puedo responder a tus consultas sobreedificabilidad, protección, normativa, usos o expedientes. Dime la categoría sobre la que quieres preguntar para que té de una explicación más detallada, o pregúntame directamente. Por ejemplo: ¿Qué puedo construir en la parcela RC1 del APE 02 27?`;
        return alexaSpeak(handlerInput, speakOutput);
    }
};

const EdificabilityIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Edificability'),
    handle: (handlerInput) => parseAlexa(handlerInput, getEdificability)
};
const ProtectionIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Protection'),
    handle: (handlerInput) => parseAlexa(handlerInput, getProtection.general)
};
const UseIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Use'),
    handle: (handlerInput) => parseAlexa(handlerInput, getUse)
};
const RegulationsIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Regulations'),
    handle: (handlerInput) => parseAlexa(handlerInput, getRegulations)
};
const RecordIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'Record'),
    handle: (handlerInput) => parseAlexa(handlerInput, getRecord)
};

const HelpIntentHandler = {
    canHandle: (handlerInput) => alexaCanHandle(handlerInput, 'AMAZON.HelpIntent'),
    handle: (handlerInput) => alexaSpeak(handlerInput,'You can say hello to me! How can I help?')
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
    handle(handlerInput) {
        // Any cleanup logic goes here.
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
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;
        return alexaSpeak(handlerInput, speakOutput);
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        EdificabilityIntentHandler,
        ProtectionIntentHandler,
        UseIntentHandler,
        RegulationsIntentHandler,
        RecordIntentHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
