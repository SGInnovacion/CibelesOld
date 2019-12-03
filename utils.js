const AWS = require('aws-sdk');
let dynamoDB = new AWS.DynamoDB();
const http = require('http');


const recordStreet = async (street) => {
  try {
      let params = {
          TableName: 'Addresses',
          Key: {
              'address': { S: street }},
          UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :inc',
          ExpressionAttributeNames: { '#val': 'Value' },
          ExpressionAttributeValues: {
              ':inc': { N: '1' }, ':zero': { N: '0' }},
          ReturnValues: 'ALL_NEW'
      };
        console.log("Invoked counter-test");
        const data = await dynamoDB.updateItem(params).promise();
        console.log(data);
        console.log("Updated counter");
        const response = {
            statusCode: 200,
            body: JSON.stringify('Counter updated'),
        };
        return response;
    } catch (err) {
      console.log(err, err.stack);
      return { statusCode: 400 }
    }
};

const recordManyStreets = async (streets) => {
    return streets.map(async street => await recordStreet(street));
};

const recordIntent = async (intentName, count) => {
    console.log('intentName: ' + intentName);
    console.log('count: ' + count);
  try {
      let params = {
          TableName: 'CibelesIntents',
          Key: {
              'intent': { S: intentName }},
          UpdateExpression: 'SET #val = if_not_exists(#val, :zero) + :inc, #last = :time',
          ExpressionAttributeNames: { '#val': 'Value', '#last': 'last_request' },
          ExpressionAttributeValues: {
              ':inc': { N: count.toString() }, ':zero': { N: '0' }, ':time' : { N: Date.now().toString()}},
          ReturnValues: 'ALL_NEW'
      };
        console.log("Invoked counter-test");
        const data = await dynamoDB.updateItem(params).promise();
        console.log(data);
        console.log("Updated counter");
      return {
            statusCode: 200,
            body: JSON.stringify('Counter updated'),
        };
    } catch (err) {
      console.log(err, err.stack);
      return { statusCode: 400 }
    }
};

const recordManyIntents = async (intentHistoryCount) => {
    console.log('Intent history count');
    console.log(intentHistoryCount);
    return Object.keys(intentHistoryCount).map(async int => await recordIntent(int, intentHistoryCount[int]));
};

const recordPetition = async (petition) => {
    try{
         let params =  {
            RequestItems: {
                ['CibelesPetitions']: [{
                    PutRequest: {
                        Item: {
                            id: {"N": Date.now().toString()},
                            intent: {"S": petition.intent},
                            address: {"S": petition.address},
                            user: {"S": petition.user}
                        }
                    }
                }]
            }
        };

        const data = await dynamoDB.batchWriteItem(params).promise();
        console.log(data);
        console.log("Updated counter");
        return {
            statusCode: 200,
            body: JSON.stringify('Counter updated'),
        };
    } catch (err) {
        console.log(err, err.stack);
        return { statusCode: 400 }
    }
};

const recordManyPetitions = async (petitions) => {
    return petitions.map(async petition => await recordPetition(petition));
};

const dynamoRecord = (queries, correct, attendedBy, tableName) => {
    let query =  {
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
    console.log(query);

    return new Promise(resolve => {
        dynamoDB.batchWriteItem(query, function (err, data){
            return err ? resolve( console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)))
                : resolve('Success');
        })
    });
};

const recordQuery = (agent, intent) => {
    let context = agent.getContext('was-successful');
    console.log('[INFO] recordQuery: contexts');
    console.log(context);
    const firstRecord = (context && !context.parameters) || (context && context.parameters && !context.parameters.queries) ;
    if (firstRecord){
        context.parameters = {
            ...context.parameters,
            queries: [agent.query],
            attendedBy: intent,
        };
    } else{
        if(!context.parameters.queries.includes(agent.query)){
            context.parameters.queries.push(agent.query);
        }
    }
    agent.setContext(context);
};

const getUserParams = (token, param) => {
    return new Promise((resolve, reject) => {
        const options = {
            host: encodeURI('api.eu.amazonalexa.com'),
            path: encodeURI('/v2/accounts/~current/settings/Profile.'+ param),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const request = http.request(options, response => {

            console.log(response);
            response.setEncoding('binary');
            let returnData = '';

            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }
            response.on('data', chunk => {
                returnData += chunk;
            });
            response.on('end', () => resolve(returnData));
            response.on('error', error => {
                console.log(error);
                reject(error)});
        });
        request.end();
    });
};

const getHttp = (url, query, username = 'DUINNOVA', passw = 'Texeira1656') => {
    return new Promise((resolve, reject) => {
        const options = {
            host: encodeURI(url),
            path: encodeURI(query),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + passw).toString('base64')
            }
        };

        const request = http.request(options, response => {

            console.log(response);
            response.setEncoding('binary');
            let returnData = '';

            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }
            response.on('data', chunk => {
                returnData += chunk;
            });
            response.on('end', () => resolve(returnData));
            response.on('error', error => {
                console.log(error);
                reject(error)});
        });
        request.end();
    });
};

const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


const sendMail = async (mail, info, address) => {
    const ses = new AWS.SES({region: 'us-east-1'});
    var params = {
        Destination: {
            ToAddresses: [mail]
        },
        Message: {
            Body: {
                Text: { Data: "Test"
                },
                Html: {
                    Data: info
                },
            },
            Subject: { Data: `Tu consulta sobre ${address}`
            }
        },
        Source: "ayto.saturnolabs@gmail.com"
    };
    console.log(params);
    return ses.sendEmail(params, function (err, data) {
        console.log('sending mail');
        console.log(data);
        console.log(err);
        if (err) {
            return false;
        } else {
            return true;
        }
    });

};

module.exports = {
    dynamoRecord,
    recordQuery,
    getHttp,
    toTitleCase,
    getUserParams,
    sendMail,
    recordManyStreets,
    recordManyIntents,
    recordManyPetitions
};
