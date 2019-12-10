const { getPlaneamiento } = require('../APIs')

module.exports = async (street) => {
  const address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
  const area = address.planeamiento.parcela.usos[0].usoEdificabilidad
  return (area === '---') ? `No hay información de edificabilidad en ${address.parsedStreet}. `
    : `En ${address.parsedStreet} se pueden construir ${area.replace('.', ',')} metros cuadrados del uso cualificado residencial vivienda colectiva. `
};
