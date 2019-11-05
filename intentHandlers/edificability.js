const { getPlaneamiento } = require('../APIs');

module.exports = async (street) => {
    console.log('[INFO] edificability request handler: ?');
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    let area = address.planeamiento.parcela.usos[0].usoEdificabilidad;
    return (area==='---') ? `No dispongo de esa información sobre ${parsedStreet}` :
        `En ${address.parsedStreet} se puede construir ${area.replace(".", ",")} metros cuadrados del uso cualificado residencial vivienda colectiva. ¿Quieres preguntar por la normativa, protección o expediente en la misma ubicación?`;
};