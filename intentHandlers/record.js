const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)

  const current = response.parcela.exptePlaneamientoVigente && response.parcela.exptePlaneamientoVigente.length > 0 ? response.parcela.exptePlaneamientoVigente : false

  const lastRecord = response.historicoExpedientes && response.historicoExpedientes.expedsHcosPlan && response.historicoExpedientes.expedsHcosPlan.length > 0
    ? response.historicoExpedientes.expedsHcosPlan[0] : false

  console.log('[INFO] Current record')
  console.log(current)
  console.log('[INFO] Last record:')
  console.log(lastRecord)

  const speechText = current ? `El expediente vigente en ${address.parsedStreet} es el ${current[0].numero} con denominación ${current[0].denominacion}. `
    : lastRecord ? `El último expediente del histórico en ${address.parsedStreet} es el ${lastRecord.numero} con denominación ${lastRecord.denominacion}. `
      : `No dispongo de información sobre expedientes para ${address.parsedStreet}. `

  return speechText
}
