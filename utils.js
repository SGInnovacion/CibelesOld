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

const getHttp = (url, query) => {
    return new Promise((resolve, reject) => {
        const request = http.get(`${url}/${query}`, response => {

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
            response.on('error', error => reject(error));
        });
        request.end();
    });
};

const getHttpAuth = (url, query, username = 'DUINNOVA', passw = 'Texeira1656') => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + passw).toString('base64')
            }
        };

        const request = http.get(`${url}/${query}`, options, response => {

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

const getHttpAuth2 = (url, query, username = 'DUINNOVA', passw = 'Texeira1656') => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + passw).toString('base64')
            }
        };

        const request = require('request'),
            username = username,
            password = passw,
            url = url,
            auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

        request(
            {
                url : url,
                headers : {
                    "Authorization" : auth
                }
            },
            function (error, response, body) {
                console.log(response);
                console.log(body);
                response.setEncoding('binary');
                let returnData = '';

                if (response.statusCode < 200 || response.statusCode >= 300) {
                    return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
                }
                response.on('data', chunk => {
                    returnData += chunk;
                });
                // response.on('end', () => resolve(returnData));
                // response.on('error', error => {
                //     console.log(error);
                //     reject(error)});
            }
        );
    });
};




module.exports = {
    dynamoRecord,
    recordQuery,
    getHttp,
    getHttpAuth
};
