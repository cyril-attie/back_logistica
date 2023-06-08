const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const createToken = (usuario) => {

    console.log('Entra en createToken. Usuario es\n' + JSON.stringify(usuario));
    const obj = {
        usuario_id: usuario.usuario_id,
        roles_id: usuario.roles_id,
        exp: dayjs().add(5, 'days').unix()
    }

    console.log(JSON.stringify(obj));

    try {
        return jwt.sign(obj, process.env.SECRET_KEY);
    } catch (e) {
        console.error(e.message + '\nNo hay variable de entorno SECRET_KEY.')
        throw new Error('Añadir una variable de entorno SECRET_KEY en ./.env');
    }

}

/*
function log(target, name, descriptor) {
    var oldValue = descriptor.value;

    descriptor.value = function () {
        console.log(`Calling "${name}" with`, arguments);

        return oldValue.apply(null, arguments);
    };

    return descriptor;
};
*/

module.exports = {
    createToken
}