const jwt = require('jsonwebtoken');
const { _getById } = require('../models/usuarios.model');
const { getRolePermissionsOf } = require('../models/roles.model');
const { getIdByMetodoRuta } = require('../models/permisos.model');






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
    const usuarios = await _getById(obj.usuarios_id);
    req.usuario = usuarios[0];
    //console.log(`req.usuario \n\n ${JSON.stringify(req.usuario)}`)
    // Object.keys(req).forEach(k => { try { console.log(`${k} : ${req[k]}`) } catch (e) { 1 } })
    next();
}


const checkPermisos = async (req, res, next) => {

    let roles_id = req.usuario.roles_id;
    let ruta = req.originalUrl;
    let metodo = req.method;

    const [response] = await getRolePermissionsOf(roles_id);
    if (!response) { 
        let stringError= `No hay ningún permiso asociado al rol ${roles_id}. 
        Contacta con tu lider de equipo ${req.usuario.lider}`;
        console.log(stringError);
        res.json({fatal:stringError});
    }
    const permisos_ids = response.map(row => row.permisos_id);
    const [[permiso]] = await getIdByMetodoRuta(metodo, ruta);

    if (permisos_ids.find(e=>e==permiso.permisos_id)) {
        console.log("Yes authorized");
        next();
    } else {
        console.log(`permisos_ids ${permisos_ids}\n rol ${roles_id}\n permiso ${JSON.stringify(permiso)}`);
        res.json({fatal:`Permisos insuficientes. Hable con el jefe de equipo ${req.usuario.lider} para obtener el permiso ${metodo} ${ruta}.`})
    }

    //console.log(`permisos_ids ${JSON.stringify(permisos_ids)}\n\n permiso ${JSON.stringify(permiso)}\n\nmetodo ${metodo}\n ruta ${ruta}\npermiso ${permiso}.`);
    
}



/* console.log("we are in checkpermisos")
Object.keys(req).forEach((k) => {
    try {
        console.log(`k: ${k}\nreq[k]=${JSON.stringify(req[k])}\n\n`)
    } catch (err) { 1 }
}
); */

    



















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

module.exports = { checkToken, checkPermisos, checkEncargado, checkOperario, checkSuperusuario, checkJefeDeEquipo };