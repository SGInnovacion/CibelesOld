// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

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
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Hola, Soy Cibeles, el servicio de búsqueda urbanística del Ayuntamiento de Madrid. Puedo responder a tus consultas sobreedificabilidad, protección, normativa, usos o expedientes. Dime la categoría sobre la que quieres preguntar para que té de una explicación más detallada, o pregúntame directamente. Por ejemplo: ¿Qué puedo construir en la parcela RC1 del APE 02 27?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const EdificabilityIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Edificability';
    },
    handle(handlerInput) {

        const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
        const { Street, Number, Calificator } = requestEnvelope.request.intent.slots;

        const speakOutput = `En la calle Prim 1 se pueden construir 31.913,1 metros cuadrados. Quieres añadir más información a tu consulta? Puedo darte más datos sobre protección, normativa, usos o expedientes. Di el nombre de la categoría para que lo haga. Si has terminado di salir.`;
        return responseBuilder
            .speak(speakOutput)
            .reprompt('Quieres añadir algo más a tu consulta?')
            .getResponse();
    }
};
const ProtectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Protection';
    },
    handle(handlerInput) {
        const speakOutput = `La protección de Prim 1 como edificio es Integral y está afectado por patrimonio de la Comunidad de Madrid. Además, pertenece al APE0001. Quieres añadir más información a tu consulta? Si no, di salir.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Quieres añadir algo más a tu consulta?')
            .getResponse();
    }
};
const UseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Use';
    },
    handle(handlerInput) {
        const speakOutput = `El uso asociado a calle prim 1 es residencial vivienda colectiva. Quieres añadir más información a tu consulta? Si no, di salir.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Quieres añadir algo más a tu consulta?')
            .getResponse();
    }
};
const RegulationsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Regulations';
    },
    handle(handlerInput) {
        const speakOutput = `El ámbito de calle prim 1 es 1.1 y su denominación es ZONA 1 GRADO 1º. Además, se puede construir 2874.92 metros cuadrados. Quieres añadir más información a tu consulta? Si no, di salir.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Quieres añadir algo más a tu consulta?')
            .getResponse();
    }
};
const RecordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Record';
    },
    handle(handlerInput) {
        const speakOutput = `El último expediente del histórico en calle prim 1 es el 135/2018/00678 con denominación Regulación Servicios Terciarios Hospedaje. Quieres añadir más información a tu consulta? Si no, di salir.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Quieres añadir algo más a tu consulta?')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
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

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
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

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
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
