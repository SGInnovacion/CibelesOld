const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (agent) => {

    console.log('[INFO] edificability request handler: ?');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
        	console.log(response);

            area = response.parcela.usos.usoEdificabilidad
            console.log('[INFO] Area');
            console.log(area);
            
        	agent.add(`En ${street} se puede construir ${area} metros cuadrados`);


        }).catch( e => {
        	console.log(e.message)
        })
    })
};
