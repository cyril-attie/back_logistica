const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createToken } = require('../../utils/helpers');
const {getAll,create, getById, getByEmail } = require('../../models/usuarios.model') 


//Recupera todos los usuarios
router.get('/', async (req, res) =>{
	const [result] = await getAll(); 
    res.json(result);
});


// obtener el perfil del usuario 
router.get('/perfil', (req, res) => {
    delete req.usuario.password;
    res.json(req.usuario);
});


//Recupera un usuario por id
router.get('/:usuario_id', async (req, res) =>{
	const [result] = await getById(id); 
    res.json(result);
});



// Crear nuevo usuario
router.post('/nuevo', async (req, res) =>{
	console.log(JSON.stringify(req.body));
    // Antes de insertar encriptamos la password
    req.body.contrasena = bcrypt.hashSync(req.body.contrasena, 8);

    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
 
});


// login
router.post('/login', async (req, res) => {
    // ¿Existe el email en la base de datos?
    
    const [usuarios] = await getByEmail(req.body.email);
   
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
        token: createToken(usuario)
    });

});

module.exports = router;