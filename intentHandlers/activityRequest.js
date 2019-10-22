module.exports = (agent) => {

    console.log('[INFO] Activity request handler: ?');
    console.log(agent.parameters);
    agent.add('De acuerdo, me acordaré de eso');
    let context = agent.getContext('was-successful');
    
};
