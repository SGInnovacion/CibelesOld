const { planeamientoNdp, bdcSearch } = require('../APIs');

module.exports = (street) => {
    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
            console.log(response);

            const current = response.parcela.exptePlaneamientoVigente && response.parcela.exptePlaneamientoVigente.length > 0 ? response.parcela.exptePlaneamientoVigente : false;

            const lastRecord = response.historicoExpedientes && response.historicoExpedientes.expedsHcosPlan && response.historicoExpedientes.expedsHcosPlan.length > 0 ?
                response.historicoExpedientes.expedsHcosPlan[0] : false;

            console.log('[INFO] Current record');
            console.log(current);
            console.log('[INFO] Last record:');
            console.log(lastRecord);

            let speechText = current ? `El expediente vigente en ${street} es el ${current[0].numero} con denominación ${current[0].denominacion}` :
                lastRecord ? `El último expediente del histórico en ${street} es el ${lastRecord.numero} con denominación ${lastRecord.denominacion}` :
                    `No dispongo de información sobre expedientes para ${street}`;

            return speechText;
        }).catch( e => {
            console.log(e.message)
        })
    })
};
