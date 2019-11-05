const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = async (street) => {

// Normativa:
// - Registro: zona urbanistica
// - Derivar al ambito
// - Metros cuadrados, cómo los puedes contruir (max altura etc)
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;
	console.log(response);

    zonaUrbanistica = response.parcela.zonaUrbanistica
    ambitoEtiqueta = response.parcela.ambitoEtiqueta
    ambitoDenominacion = response.parcela.ambitoDenominacion
    area = response.parcela.usos[0].usoEdificabilidad
    console.log('[INFO] zonaUrbanistica');
    console.log(zonaUrbanistica);
    console.log('[INFO] ambitoDenominacion');
    console.log(ambitoDenominacion);
    console.log('[INFO] ambitoEtiqueta');
    console.log(ambitoEtiqueta);
    console.log('[INFO] Area');
    console.log(area);

    let speechText = '';

    if (zonaUrbanistica != "---") {
        speechText += `${address.parsedStreet} pertenece a la zona urbanística ${zonaUrbanistica}.`
    }
    speechText += ` El ámbito de ${address.parsedStreet} es ${ambitoEtiqueta}`
    speechText += ` y su denominación es ${ambitoDenominacion}.`
    speechText += ` Además, se puede construir ${area} metros cuadrados`

	return speechText;

}
