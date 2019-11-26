const { getPlaneamiento } = require('../APIs');

module.exports = async (street) => {
    console.log('[INFO] edificability request handler:', street);
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    let area = address.planeamiento.parcela.usos[0].usoEdificabilidad;
    return (area==='---') ? `No hay información de edificabilidad en ${address.parsedStreet}. ` :
        `En ${address.parsedStreet} se pueden construir ${area.replace(".", ",")} metros cuadrados del uso cualificado residencial vivienda colectiva.`;
};
