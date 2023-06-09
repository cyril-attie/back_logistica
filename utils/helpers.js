const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const createToken = (usuario) => {

    console.log('Entra en createToken. Usuario es\n' + JSON.stringify(usuario));
    const obj = {
        usuarios_id: usuario.usuarios_id,
        roles_id: usuario.roles_id,
        exp: dayjs().add(30, 'days').unix()
    }

    console.log(JSON.stringify(obj));

    try {
        return jwt.sign(obj, process.env.SECRET_KEY);
    } catch (e) {
        console.error(e.message + '\nNo hay variable de entorno SECRET_KEY.')
        throw new Error('Añadir una variable de entorno SECRET_KEY en ./.env');
    }

}



module.exports = {
    createToken
}
