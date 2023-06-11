const jwt = require('jsonwebtoken');
const { getById } = require('../models/usuarios.model');

const checkToken = async (req, res, next) => {
    // ¿Viene incluida la cabecera de Authorization?
    if (!req.headers['authorization']) {
        return res.json({ fatal: 'Debes incluir la cabecera de Autorización' });
    }

    // Recuperar el token
    const token = req.headers['authorization'];

    // ¿Es correcto el token?
    let obj;
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return res.json({ fatal: error.message });
    }

    // Recupero los datos del usuario logado
    // obj dispone de las siguientes claves: user_id, user_role, exp
    const [usuarios] = await getById(obj.usuarios_id);
    req.usuario = usuarios[0];
    // console.log(`req.usuario \n\n ${JSON.stringify(req.usuario)}`)
    // Object.keys(req).forEach(k => { try { console.log(`${k} : ${req[k]}`) } catch (e) { 1 } })
    next();
}

const checkJefeDeEquipo = (req, res, next) => {

    console.log(req.ususario);
    if (req.usuario.roles_id > 2) {
        return res.json({
            fatal: `Debes ser jefe de equipo para ${req.method} '${req.originalUrl}'.
        Haz login como jefe de equipo o habla con tu jefe de equipo.`  });
    }

    next();
}


const checkOperario = (req, res, next) => {

    console.log(req.ususario);
    if (req.usuario.roles_id > 4) {
        return res.json({
            fatal: `Debes ser operario para ${req.method} '${req.originalUrl}'.
        Haz login como operario o habla con tu jefe de equipo.` });
    }

    next();
}

const checkEncargado = (req, res, next) => {

    console.log(req.ususario);
    if (req.usuario.roles_id === 3) {
        return res.json({
            fatal: `Debes ser encargado para ${req.method} '${req.originalUrl}'.
        Haz login como encargado o habla con tu jefe de equipo.` });
    }

    next();
}

const checkSuperusuario = (req, res, next) => {
    console.log(`req.ususario.roles_id = ${req.ususario.roles_id}`);
    if (req.usuario.roles_id === 1) {
        return res.json({
            fatal: `Debes ser superusuario para ${req.method} '${req.originalUrl}'. 
            Haz login como superusuario o habla con tu jefe de equipo.`});
    }

    next();
}

module.exports = { checkToken, checkEncargado, checkOperario, checkSuperusuario, checkJefeDeEquipo };