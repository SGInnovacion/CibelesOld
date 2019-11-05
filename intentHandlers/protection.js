const { planeamientoNdp, bdcSearch, getPlaneamiento } = require('../APIs');

const general = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;
    const catalogo = response.planeamiento.catalogo;
    const patrimonioHistorico = response.planeamiento.patrimonioHistorico;
    const perteneceArrabalFelipeII = response.planeamiento.parcela.perteneceArrabalFelipeII === 'true';
    const perteneceAPE0001 = response.planeamiento.parcela.perteneceAPE0001 === 'true';

    let speechText = '';
    const anyCatalogue = Object.keys(catalogo).find( key => catalogo[key] !== [] && catalogo[key][0] && catalogo[key][0].proteccionActual !== undefined);
    const affectedPatrimonio = patrimonioHistorico && patrimonioHistorico.length !== 0;

    speechText += anyCatalogue ? `La protección del edificio como ${anyCatalogue} es ${catalogo[anyCatalogue][0].proteccionActual} ` : 'El edificio no está protegido ';
    speechText += affectedPatrimonio ? 'y está afectado por patrimonio de la Comunidad de Madrid. '
        : 'y no está afectado por patrimonio de la Comunidad de Madrid. ';

    if(perteneceArrabalFelipeII && perteneceAPE0001){
        speechText += 'Además, pertenece al Arrabal de Felipe II y al APE0001.';
    } else if(perteneceAPE0001) {
        speechText += 'Además, pertenece al APE0001.';
    } else if(perteneceArrabalFelipeII) {
        speechText += 'Además, pertenece al Arrabal de Felipe II.';
    }
    return speechText;
};

const felipe = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;    console.log(response);
    const perteneceArrabalFelipeII = response.parcela.perteneceArrabalFelipeII === 'true';
    console.log('[INFO] Pertenece felipe o ape:');
    console.log(perteneceArrabalFelipeII);
    const speechText = perteneceArrabalFelipeII ? `Sí, ${address.parsedStreet} pertenece al Arrabal de Felipe II.`
        : `No, ${address.parsedStreet} no pertenece al Arrabal de Felipe II.`;
    console.log(speechText);
    return speechText;
};

const ape = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;
    console.log(response);
    const perteneceAPE0001 = response.parcela.perteneceAPE0001 === 'true';
    console.log('[INFO] Pertenece ape:');
    console.log(perteneceAPE0001);
    const speechText = perteneceAPE0001 ? `Sí, ${address.parsedStreet} pertenece al APE0001.`
        : `No, ${address.parsedStreet} no pertenece al APE0001.`;
    console.log(speechText);
    return speechText;
};

const bip = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;
    console.log(response);
    const patrimonioHistorico = response.patrimonioHistorico;
    console.log('[INFO] patrimonioHistorico');
    console.log(patrimonioHistorico);
    const checkBip = (patrimonio) => patrimonio.categoria.includes("BIP");
    const speechText = patrimonioHistorico.some(checkBip) ?
        `${address.parsedStreet} es un Bien de interés patrimonial` : `${address.parsedStreet} no es un bien de interés patrimonial`
    return speechText;
};

const bic = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;

    console.log(response);
    const patrimonioHistorico = response.patrimonioHistorico;
    console.log('[INFO] patrimonioHistorico');
    console.log(patrimonioHistorico);

    const checkBic = (patrimonio) => patrimonio.categoria.includes("BIC");

    const speechText = patrimonioHistorico.some(checkBic) ?
        `${address.parsedStreet} es un Bien de interés cultural` : `${address.parsedStreet} no es un bien de interés cultural`

    return speechText;
};

const catalogue = async street => {
    let address = (typeof street === 'string') ? await getPlaneamiento(street) : street;
    const response = address.planeamiento;
    console.log(response);
    const catalogo = response.catalogo;
    console.log('[INFO] Catalogo');
    console.log(catalogo);
    let speechText = `La protección de ${address.parsedStreet} `;
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
    return speechText;
};

module.exports = {
    general,
    felipe,
    ape,
    catalogue,
    bip,
    bic,
};
