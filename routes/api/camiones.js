const router = require('express').Router();
const bcrypt = require('bcryptjs');

const {getAll,create, getById, updateById, deleteById } = require('../../models/camiones.model'); 


// Crear nuevo camion
router.post('/nuevo', async (req, res) =>{
	console.log(JSON.stringify(req.body));
    
    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
 
});



//Recupera todos los camiones
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un camion por id
router.get('/:camiones_id', async (req, res) =>{
    try {
        const [usuario] = await getById(req.params.camiones_id); 
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un camion
router.put('/:camiones_id', async (req, res) =>{
    try {
        const [result] = await updateById( req.params.camiones_id, req.body); 
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
	
});



// Borrar un camion
router.delete('/:camiones_id', async (req, res) =>{

    try {
        const [result] = await deleteById(req.params.camiones_id); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

	
});


module.exports = router;