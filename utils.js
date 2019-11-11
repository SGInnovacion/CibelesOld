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

const mailTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml">
<head>
<title>Test Email Sample</title>
<body>

<h1>Dani es un cutre</h1>
<h2>Pero Alfon nope</h2>
</body>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
<style>
h1{
background-color: red;
}
</style>
</head>
`;


const sendMail = async (mail, info, address ) => {
    let nodemailer = require('nodemailer');
    let smtpTransport = require('nodemailer-smtp-transport');

    console.log('Inside send mail');
    console.log(mail);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: 'ayto.saturnolabs',
            pass: 'Cibeles2019'
        }
    });


    let mailOptions = {
        from: 'ayto.saturnolabs',
        to: mail,
        bcc: '<bcc email addres>',
        subject: 'Ayuntamiento de Madrid - Tu consulta sobre ' + address,
        html: mailTemplate
    };

    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            const response = {
                statusCode: 500,
                body: JSON.stringify({
                    error: error.message,
                }),
            };
            console.log(response);
            return false;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: `Email processed succesfully!`
            }),
        };
        console.log(response);
        return true;
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
