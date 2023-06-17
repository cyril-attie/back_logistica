const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createToken } = require('../../utils/helpers');
const { _getByEmail, create } = require('../../models/usuarios.model');
const { checkToken } = require('../../utils/middlewares');

// register
router.post('/register', async (req, res) => {
    // Registrar nuevos jefes de equipo. 


    // ¿Existe el email en la base de datos?
    const [usuarios] = await _getByEmail(req.body.email);

    if (usuarios.length > 0) {
        return res.json({ fatal: 'Error en email ya está en uso en la base de datos.' });
    } else if (req.body.roles_id != 2) {
        return res.json({ fatal: 'Error, solo jefes de equipo pueden registrarse. Añadir roles_id 2.' });
    }

    let [[response]] = await db.query(`   select AUTO_INCREMENT 
                                                    from information_schema.tables \
                                                    where table_schema="almacen" and table_name="usuarios"`);
    req.body.usuarios_id_lider = response.AUTO_INCREMENT

    
    // Antes de insertar encriptamos la password
    req.body.contrasena = bcrypt.hashSync(req.body.contrasena, 8);

    // console.log(JSON.stringify(req.body));
    try {
        const [result] = await create(req.body,req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});




// login
router.post('/login', async (req, res) => {
    // ¿Existe el email en la base de datos?
    const [usuarios]= await _getByEmail(req.body.email);
   
    if (usuarios.length === 0) {
        return res.json({ fatal: 'Error en email y/o contraseña' });
    }

    // Recuperamos el usuario
    const usuario = usuarios[0];

    // ¿Coinciden las password?
    const iguales = bcrypt.compareSync(req.body.contrasena, usuario.contrasena);
    if (!iguales) {
        return res.json({ fatal: 'Error en email y/o contraseña' });
    }

    res.json({
        success: "Login correcto",
        usuarios_id: usuario.usuarios_id,
        token: createToken(usuario)
    });

});


module.exports = router;