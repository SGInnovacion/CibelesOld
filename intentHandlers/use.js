const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  let speechText = ''
  const usos = address.planeamiento.parcela.usos
  console.log(usos)
  if (usos && usos.length !== 0) {
    speechText += `El uso cualificado de ${address.parsedStreet} es ${usos[0].usoDenominacion.toLowerCase()}`
  };

  return speechText
}
