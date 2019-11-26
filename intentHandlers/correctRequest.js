const { dynamoRecord } = require('../utils')

module.exports = (agent) => {
  console.log('[INFO] Correct request handler: contexts')
  console.log(agent.contexts)
  agent.add('De acuerdo, me acordaré de eso')
  const context = agent.getContext('was-successful')
  return dynamoRecord(context.parameters.queries, agent.query, context.parameters.attendedBy, 'AytoFailedRequests')
}
