const router = require('express').Router();
const bcrypt = require('bcryptjs');


const {getAll,create, getById, updateById, deleteById } = require('../../models/usuarios.model') 



// Crear nuevo usuario
router.post('/nuevo', async (req, res) =>{

    // Antes de insertar encriptamos la password
    req.body.contrasena = bcrypt.hashSync(req.body.contrasena, 8);

    try {
        const [result] = await create(req.body,req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
 
});




//Recupera todos los usuarios
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(req); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un usuario por id
router.get('/:usuarios_id', async (req, res) =>{
    try {
        const usuario = await getById(req.params.usuarios_id,req); 
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un usuario
router.put('/:usuarios_id', async (req, res) =>{
    try {
        const [result] = await updateById( req.params.usuarios_id, req.body, req); 
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
	
});


router.delete('/:usuarios_id', async (req, res) =>{

    try {
        const [result] = await deleteById(req.params.usuarios_id,req); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

	
});


module.exports = router;