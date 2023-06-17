const router = require('express').Router();
const bcrypt = require('bcryptjs');

const {getAll,create, getById, updateById, deleteById } = require('../../models/stocks.model'); 



// Crear nuevo stock
router.post('/nuevo', async (req, res) =>{
	console.log(JSON.stringify(req.body));
    
    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
 
});



//Recupera todos los stocks
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(req); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un stock por id
router.get('/:stocks_id', async (req, res) =>{
    try {
        const [result] = await getById(req.params.stocks_id,req); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un stock
router.put('/:stocks_id', async (req, res) =>{
    try {
        const [result] = await updateById( req.params.stocks_id, req.body); 
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
	
});



// Borrar un stock
router.delete('/:stocks_id', async (req, res) =>{

    try {
        const [result] = await deleteById(req.params.stocks_id); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

	
});


module.exports = router;