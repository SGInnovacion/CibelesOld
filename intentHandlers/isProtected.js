const {planCoordinates, planFuzzy} = require('../APIs');

var direcciones = require('../src/direcciones');

module.exports = (agent) => {

    console.log('[INFO] is protected request handler: ?');
    console.log(agent.parameters);

    let street = agent.parameters.address || 'alcala 23';

    let a = planFuzzy(street).then( a => {
        let item = direcciones.find(item => item.COD_NDP == a.codigoNdps);
        let x = item.UTMX_ETRS.replace(',','.');
        let y = item.UTMY_ETRS.replace(',','.');
        console.log(item);
        console.log(x);
        console.log(y);
        let response = planCoordinates(x,y).then(response => {
        	protection = response.patrimonioHistorico[0].clase
        	agent.add(`La protección de ${street} es ${protection}`)
        }).catch( e => {
        	console.log(e.message)
        })
        

    }).catch( e => {
        	console.log(e.message)
        })


};
