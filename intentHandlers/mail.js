const { getPlaneamiento } = require('../APIs');

module.exports = async (street) => {
        const { apiAccessToken, apiEndpoint, user } = handlerInput.requestEnvelope.context.System;

        const getEmailUrl = apiEndpoint.concat(
            `/v2/accounts/~current/settings/Profile.email`
        );
        let mailResult = "";
        try {
            mailResult = await axios.get(getEmailUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + apiAccessToken
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            const email = mailResult && mailResult.data;
            let street = handlerInput.attributesManager.getSessionAttributes().street;
            let planeamiento = handlerInput.attributesManager.getSessionAttributes().planeamiento;
            console.log('FILL')
            console.log(fillMail(planeamiento, street))
            let success = await sendMail(email, fillMail(planeamiento, street), street);
            console.log('success');
            console.log(success);
            let out = 'Ya te lo he enviado, qué más quieres saber?';
            return alexaSpeak(handlerInput, out);
        } catch (error) {
            console.log(error);
            return alexaSpeak(handlerInput, 'Vaya, he tenido problemas para enviártelo. Comprueba que has habilitado los permisos de correo en la skill.');
        }
    }