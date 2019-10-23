import {planCoordinates, planFuzzy} from "../APIs";

var direcciones = require('../src/direcciones');

module.exports = (agent) => {

    console.log('[INFO] is protected request handler: ?');
    console.log(agent.parameters);
    agent.add('Buenasss');

    let street = agent.parameters.address || 'alcala 23';

    let a = planFuzzy('bahia de santander 70').then( a => {
        let item = direcciones.find(item => item.COD_NDP == a.codigoNdps);
        let x = item.UTMX_ETRS.replace(',','.');
        let y = item.UTMY_ETRS.replace(',','.');
        console.log(item);
        console.log(x);
        console.log(y);
        planCoordinates(x,y);
    });


};
