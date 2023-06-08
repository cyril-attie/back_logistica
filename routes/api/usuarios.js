const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createToken } = require('../../utils/helpers');
const {getAll,create, getById, getByEmail, updateById, deleteById } = require('../../models/usuarios.model') 



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
    
    const [usuarios]= await getByEmail(req.body.email);
   
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

//Recupera todos los usuarios
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un usuario por id
router.get('/:usuarios_id', async (req, res) =>{
    try {
        const [usuario] = await getById(req.params.usuarios_id); 
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un usuario
router.put('/:usuarios_id', async (req, res) =>{
    try {
        const [result] = await updateById( req.params.usuarios_id, req.body); 
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
	
});




router.delete('/:usuarios_id', async (req, res) =>{

    try {
        const [result] = await deleteById(req.params.usuarios_id); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

	
});


module.exports = router;