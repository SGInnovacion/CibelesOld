const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (agent) => {

// Normativa:
// - Registro: zona urbanistica
// - Derivar al ambito
// - Metros cuadrados, xómo los puedes contruir (max altura etc)


    console.log('[INFO] regulations request handler');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
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
                speechText += `${street} pertenece a la zona urbanística ${zonaUrbanistica}.`
            }
            speechText += ` El ámbito de ${street} es ${ambitoEtiqueta}`
            speechText += ` y su denominación es ${ambitoDenominacion}.`
            speechText += ` Además, se puede construir ${area} metros cuadrados`
            
        	agent.add(speechText);


        }).catch( e => {
        	console.log(e.message)
        })
    })
};
