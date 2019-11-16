const { sendMail } = require('../utils');
const { fillMail } = require('../mail');

module.exports = async (street, email) => {
    try {
        console.log('fillMail', fillMail(street.planeamiento, street.parsedStreet))
        let success = await sendMail(email, fillMail(street.planeamiento, street.parsedStreet), street.parsedStreet);
        let out = 'Ya te lo he enviado. ';
        return out
    } catch (error) {
        console.log(error);
        return 'Vaya, he tenido problemas para enviártelo. Comprueba que has habilitado los permisos de correo en la skill. '
    }
}
