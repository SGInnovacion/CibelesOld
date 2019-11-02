const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (street) => {

    console.log('[INFO] edificability request handler: ?');

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
        	console.log(response);

            area = response.parcela.usos[0].usoEdificabilidad;
            console.log('[INFO] Area');
            console.log(area);

            return `En ${street} se puede construir ${area} metros cuadrados`


        }).catch( e => {
        	console.log(e.message)
        })
    })
};
