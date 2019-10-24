const {planeamientoNdp, bdcSearch} = require('../APIs');

var direcciones = require('../src/direcciones');

module.exports = (agent) => {

    console.log('[INFO] is protected request handler: ?');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        // let item = direcciones.find(item => item.COD_NDP == a.codigoNdps);
        // console.log(item);
        // let x = item.UTMX_ETRS.replace(',','.');
        // let y = item.UTMY_ETRS.replace(',','.');
        // console.log(item);
        // console.log(x);
        // console.log(y);
        return planeamientoNdp(NDP).then(response => {
        	console.log(response);
        	protection = response.patrimonioHistorico && response.patrimonioHistorico[0] ? response.patrimonioHistorico[0].clase : 'nula'

        	agent.add(`La protección de ${street} es ${protection}`)
        }).catch( e => {
        	console.log(e.message)
        })
    })
};
