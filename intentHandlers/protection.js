const { planeamientoNdp, bdcSearch } = require('../APIs');

const general = agent => {
    console.log('[INFO] is protected request handler: ?');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
            console.log(response);
            const catalogo = response.catalogo;
            const patrimonioHistorico = response.patrimonioHistorico;
            const perteneceArrabalFelipeII = response.parcela.perteneceArrabalFelipeII === 'true';
            const perteneceAPE0001 = response.parcela.perteneceAPE0001 === 'true';
            console.log('[INFO] Catalogo');
            console.log(catalogo);
            console.log('[INFO] Patrimonio historico');
            console.log(patrimonioHistorico);
            console.log('[INFO] Pertenece felipe o ape:');
            console.log(perteneceArrabalFelipeII, perteneceAPE0001);
            let speechText = '';
            const anyCatalogue = Object.keys(catalogo).find( key => catalogo[key].proteccionActual !== undefined);
            const affectedPatrimonio = patrimonioHistorico && patrimonioHistorico.length !== 0;

            speechText += anyCatalogue ? `La protección del edificio como ${anyCatalogue} es ${catalogo[anyCatalogue].proteccionActual} ` : 'El edificio no está protegido ';
            speechText += affectedPatrimonio ? 'y está afectado por patrimonio de la Comunidad de Madrid. '
                : 'y no está afectado por patrimonio de la Comunidad de Madrid. ';

            if(perteneceArrabalFelipeII && perteneceAPE0001){
                speechText += 'Además, pertenece al Arrabal de Felipe II y al APE0001.';
            } else if(perteneceAPE0001) {
                speechText += 'Además, pertenece al APE0001.';
            } else if(perteneceArrabalFelipeII) {
                speechText += 'Además, pertenece al Arrabal de Felipe II.';
            }
            agent.add(speechText);
        }).catch( e => {
            console.log(e.message)
        })
    })
};

const felipe = agent => {
    console.log('[INFO] Protection.felipe request handler: ');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
            console.log(response);
            const perteneceArrabalFelipeII = response.parcela.perteneceArrabalFelipeII === 'true';
            console.log('[INFO] Pertenece felipe o ape:');
            console.log(perteneceArrabalFelipeII);
            const speechText = perteneceArrabalFelipeII ? `Sí, ${street} pertenece al Arrabal de Felipe II.` : `No, ${street} no pertenece al Arrabal de Felipe II.`;
            console.log(speechText);
            agent.add(speechText);
        }).catch( e => {
            console.log(e.message)
        })
    })
};

const ape = agent => {
    console.log('[INFO] Protection.ape request handler: ');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
            console.log(response);
            const perteneceAPE0001 = response.parcela.perteneceAPE0001 === 'true';
            console.log('[INFO] Pertenece ape:');
            console.log(perteneceAPE0001);
            const speechText = perteneceAPE0001 ? `Sí, ${street} pertenece al APE0001.` : `No, ${street} no pertenece al APE0001.`;
            console.log(speechText);
            agent.add(speechText);
        }).catch( e => {
            console.log(e.message)
        })
    })
};

const catalogue = agent => {
    console.log('[INFO] is protected.catalogue request handler: ?');
    console.log(agent.parameters);
    let street = agent.parameters.address || 'alcala 23';

    return bdcSearch(street).then(a => {
        console.log(a);
        let NDP = a.codigoNdps;
        return planeamientoNdp(NDP).then(response => {
            console.log(response);
            const catalogo = response.catalogo;
            console.log('[INFO] Catalogo');
            console.log(catalogo);
            let speechText = `La protección de ${street} `;
            const protectedCat = Object.keys(catalogo).filter( key => {
                try{
                    console.log(catalogo[key][0].proteccionActual)
                } catch (e) {
                    console.log(e);
                }
                return catalogo[key] !== [] && catalogo[key][0] && catalogo[key][0].proteccionActual !== undefined;
            });
            console.log('[INFO] Protected cat:');
            console.log(protectedCat);
            if (protectedCat !== undefined && protectedCat.length > 0) {
                protectedCat.map( (category, i) => speechText += `${i === protectedCat.length - 1 && protectedCat.length > 1 ? 'y ' : ', '} como ${category} es ${catalogo[category][0].proteccionActual}`);
            } else {
                speechText = 'El edificio no está protegido.'
            }
            console.log('[INFO] Speechtext')
            console.log(speechText);
            agent.add(speechText);
        }).catch( e => {
            console.log(e.message)
        })
    })
};

module.exports = {
    general,
    felipe,
    ape,
    catalogue,
};
