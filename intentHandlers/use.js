const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (street) => {

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
        	let speechText = '';

            const usos = response.parcela.usos;
            console.log(usos)
            if (usos && usos.length !== 0){
                speechText += `El uso asociado a ${street} es ${usos[0].usoDenominacion.toLowerCase()}`;
            };

        	return speechText;

        }).catch( e => {
        	console.log(e.message)
        })
    })
};
