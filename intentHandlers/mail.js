const { getPlaneamiento } = require('../APIs');
const {sendMail} = require('../utils');
const fillMail = require('../mail').fillMail;
const axios = require('axios');

module.exports = async (street) => {
    const { apiAccessToken, apiEndpoint, user } = street;

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
        console.log('FILL')
        console.log(fillMail(street.planeamiento, street.parsedStreet))
        let success = await sendMail(email, fillMail(street.planeamiento, street.parsedStreet), street.parsedStreet);
        console.log('success');
        console.log(success);
        let out = 'Ya te lo he enviado. ';
        return out
    } catch (error) {
        console.log(error);
        return 'Vaya, he tenido problemas para enviártelo. Comprueba que has habilitado los permisos de correo en la skill. '
    }
}
