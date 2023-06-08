const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { createToken } = require('../../utils/helpers');
const {getAll,create, getById, updateById, deleteById } = require('../../models/roles.model'); 



// Crear nuevo rol
router.post('/nuevo', async (req, res) =>{
	console.log(JSON.stringify(req.body));
    
    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
 
});



//Recupera todos los roles
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un rol por id
router.get('/:roles_id', async (req, res) =>{
    try {
        const [usuario] = await getById(req.params.roles_id); 
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un rol
router.put('/:roles_id', async (req, res) =>{
    try {
        const [result] = await updateById( req.params.roles_id, req.body); 
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
	
});



// Borrar un rol
router.delete('/:roles_id', async (req, res) =>{

    try {
        const [result] = await deleteById(req.params.roles_id); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

	
});


module.exports = router;