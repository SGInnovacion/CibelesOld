const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (agent) => {

    console.log('[INFO] General Info request handler');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
        	console.log(response);

            const zonaUrbanistica = response.parcela.zonaUrbanistica;
            const ambitoEtiqueta = response.parcela.ambitoEtiqueta;
            const ambitoDenominacion = response.parcela.ambitoDenominacion;
            const usos = response.parcela.usos;
            console.log('[INFO] ambitoDenominacion');
            console.log(ambitoDenominacion);
            console.log('[INFO] ambitoEtiqueta');
            console.log(ambitoEtiqueta);
            console.log('[INFO] usos');
            console.log(usos);
            
            let speechText = '';
            
            speechText += ` El ámbito de ${street} es ${ambitoEtiqueta}`;
            speechText += ` y su denominación es ${ambitoDenominacion}.`;
            if (usos && usos.length !== 0){
                speechText += `El uso asociado a ${street} es ${usos[0].usoDenominacion.toLowerCase()}`;
            };
        	agent.add(speechText);

        }).catch( e => {
        	console.log(e.message)
        })
    })
};
