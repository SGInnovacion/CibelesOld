const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
// Normativa:
  // - Registro: zona urbanistica
  // - Derivar al ambito
  // - Metros cuadrados, cómo los puedes contruir (max altura etc)
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street
  const response = address.planeamiento
  console.log(response)

  zonaUrbanistica = response.parcela.zonaUrbanistica
  ambitoEtiqueta = response.parcela.ambitoEtiqueta
  ambitoDenominacion = response.parcela.ambitoDenominacion
  area = response.parcela.usos[0].usoEdificabilidad
  console.log('zonaUrbanistica: ', zonaUrbanistica)
  console.log('ambitoDenominacion: ', ambitoDenominacion)
  console.log('ambitoEtiqueta: ', ambitoEtiqueta)
  console.log('Area: ', area)

  let speechText = ''

  if (zonaUrbanistica != '---') {
    speechText += `${address.parsedStreet} pertenece a la zona urbanística ${zonaUrbanistica}. `
  }
  speechText += `El ámbito de ${address.parsedStreet} es ${ambitoEtiqueta} `
  speechText += `y su denominación es ${ambitoDenominacion}. `
  speechText += area !== '---' ? `Además, se pueden construir ${area.replace('.', ',')} metros cuadrados. ` : '';

  return speechText
}
