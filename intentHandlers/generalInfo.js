const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = async (street) => {
            let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
        	
            console.log(address.planeamiento);

            const zonaUrbanistica = address.planeamiento.parcela.zonaUrbanistica;
            const ambitoEtiqueta = address.planeamiento.parcela.ambitoEtiqueta;
            const ambitoDenominacion = address.planeamiento.parcela.ambitoDenominacion;
            const usos = address.planeamiento.parcela.usos;
            console.log('[INFO] ambitoDenominacion');
            console.log(ambitoDenominacion);
            console.log('[INFO] ambitoEtiqueta');
            console.log(ambitoEtiqueta);
            console.log('[INFO] usos');
            console.log(usos);

            let speechText = '';

            speechText += ` El ámbito de ${address.parsedStreet} es ${ambitoEtiqueta}`;
            speechText += ` y su denominación es ${ambitoDenominacion}.`;
            if (usos && usos.length !== 0){
                speechText += `El uso asociado a ${address.parsedStreet} es ${usos[0].usoDenominacion.toLowerCase()}`;
            };
            return speechText;
};
