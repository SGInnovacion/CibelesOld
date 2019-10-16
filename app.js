'use strict';

const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var express = require('express');
const app = express();
const router = express.Router();

const AWS = require('aws-sdk');
let dynamoDB = new AWS.DynamoDB();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
    const agent = new WebhookClient({ request, response });

    function welcome(agent) {
      agent.add(`Bienvenido al Webhook de AWS`);
    }

    function fallback(agent) {
      agent.add(`No he entendido tu pregunta. (Respuesta desde aws)`);
    }

    function correctRequest(agent){
        agent.add('De acuerdo, me acordaré de eso');
        console.log('correct request');
        console.log(agent.contexts);
        let context = agent.getContext('was-successful');
        return dynamoRecord(context.parameters.queries, agent.query, context.parameters.attendedBy, "AytoFailedRequests", agent);

    }

    function generalRequest(agent){
        recordQuery(agent, "General request");
    }

    function edificability(agent){
        recordQuery(agent, "Edificability");
    }

    function generalInfo(agent){
        recordQuery(agent, "General Info");
    }

    function isProtected(agent){
        recordQuery(agent, "Is protected");
    }

    function regulations(agent){
        recordQuery(agent, "Regulations");
    }

    function use(agent){
        recordQuery(agent, "Use");
    }

    function urbanRecord(agent){
        recordQuery(agent, "Urban record");
    }

    function recordQuery(agent, intent) {
        let context = agent.getContext('was-successful');
        if (context.parameters.queries && !context.parameters.queries.includes(agent.query)) {
            context.parameters.queries.push(agent.query);
        }
        else {
            context.parameters.queries = [agent.query];
            context.parameters.attendedBy = intent;
        }
        agent.setContext(context);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Welcome', welcome);
    intentMap.set('Default Fallback', fallback);
    intentMap.set('Correct request', correctRequest);
    intentMap.set('General request', generalRequest);
    intentMap.set('Edificability', edificability);
    intentMap.set('General Info', generalInfo);
    intentMap.set('Is protected', isProtected);
    intentMap.set('Regulations', regulations);
    intentMap.set('Urban record', urbanRecord);
    intentMap.set('Use', use);
    agent.handleRequest(intentMap);
});

app.use('/', router);

let dynamoRecord = (queries, correct, attendedBy, tableName, agent) => {
    let myparams =  {
        RequestItems: {
            [tableName]: [{
                PutRequest: {
                    Item: {
                        id: {"N": Date.now().toString()},
                        correct: {"S": correct},
                        attendedBy: {"S": attendedBy},
                        queries: {
                            "L": queries.map(q => {
                                return {"S": q}
                            })
                        }
                    }
                }
            }]
        }

    };
    console.log(myparams);

    return new Promise(resolve => {
        dynamoDB.batchWriteItem(myparams, function (err, data){
            if (err) {
                let context = agent.getContext('was-successful');

                context.parameters.queries = null;
                context.parameters.attendedBy = null;
                context.parameters.correctRequest = agent.query;
                agent.setContext(context);
                return(resolve( console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2))));
            } else {
                let context = agent.getContext('was-successful');

                context.parameters.queries = null;
                context.parameters.attendedBy = null;
                context.parameters.correctRequest = agent.query;
                agent.setContext(context);
                return(resolve('Success'));
            }

        })
    });

};

module.exports = app;
