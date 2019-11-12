const AWS = require('aws-sdk');
let dynamoDB = new AWS.DynamoDB();
const http = require('http');

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
};
