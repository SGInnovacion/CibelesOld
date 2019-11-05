const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = async (street) => {
    
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;    
	let speechText = '';
    const usos = address.planeamiento.parcela.usos;
    console.log(usos)
    if (usos && usos.length !== 0){
        speechText += `El uso asociado a ${address.parsedStreet} es ${usos[0].usoDenominacion.toLowerCase()}`;
    };

	return speechText;
}
