const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  let response = address.planeamiento
  let speechText = ''
  const usos = address.planeamiento.parcela.usos
  console.log(usos)
  if (usos && usos.length !== 0) {
    speechText += `El uso asociado a ${address.parsedStreet} es ${usos[0].usoDenominacion.toLowerCase()}. `
  };

  let area = address.planeamiento.parcela.usos[0].usoEdificabilidad
  speechText += (area === '---') ? ''
    : `Se puede construir ${area.replace('.', ',')} metros cuadrados del uso cualificado residencial vivienda colectiva. `

  zonaUrbanistica = response.parcela.zonaUrbanistica
  ambitoEtiqueta = response.parcela.ambitoEtiqueta
  ambitoDenominacion = response.parcela.ambitoDenominacion
  area = response.parcela.usos[0].usoEdificabilidad
  console.log('[INFO] zonaUrbanistica')
  console.log(zonaUrbanistica)
  console.log('[INFO] ambitoDenominacion')
  console.log(ambitoDenominacion)
  console.log('[INFO] ambitoEtiqueta')
  console.log(ambitoEtiqueta)
  console.log('[INFO] Area')
  console.log(area)

  if (zonaUrbanistica != '---') {
    speechText += `Pertenece a la zona urbanística ${zonaUrbanistica}. `
  }
  speechText += `El ámbito es ${ambitoEtiqueta} `
  speechText += `y su denominación es ${ambitoDenominacion}. `

  const current = response.parcela.exptePlaneamientoVigente && response.parcela.exptePlaneamientoVigente.length > 0 ? response.parcela.exptePlaneamientoVigente : false

  const lastRecord = response.historicoExpedientes && response.historicoExpedientes.expedsHcosPlan && response.historicoExpedientes.expedsHcosPlan.length > 0
    ? response.historicoExpedientes.expedsHcosPlan[0] : false

  console.log('[INFO] Current record')
  console.log(current)
  console.log('[INFO] Last record:')
  console.log(lastRecord)

  speechText += current ? `El expediente vigente es el ${current[0].numero} con denominación ${current[0].denominacion}. `
    : lastRecord ? `El último expediente del histórico es el ${lastRecord.numero} con denominación ${lastRecord.denominacion}. `
      : ''

  return speechText
}

// (i) Usos,
// (ii) Edificabilidad,
// (iii) Ambito y denominación,
// (vi) expediente y preguntar por el informe completo por correo.
