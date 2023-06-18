const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { getAll, create, getById, updateById, deleteById } = require('../../models/pedidos.model');
const { checkOperario } = require('../../utils/middlewares');


// Crear nuevo pedido
router.post('/nuevo', checkOperario, async (req, res) => {
    //console.log(JSON.stringify(req.body));
    try {
        const [result] = await create(req.body, req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

//Recupera todos los pedidos
router.get('/', async (req, res) => {
    try {
        const result = await getAll(req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

//Recupera un pedido por id
router.get('/:pedidos_id', async (req, res) => {
    try {
        const pedido = await getById(req.params.pedidos_id, req);
        res.json(pedido);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un pedido
router.put('/:pedidos_id', async (req, res) => {
    try {
        const [result] = await updateById(req.params.pedidos_id, req.body, req);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }
});



// Borrar un pedido
router.delete('/:pedidos_id', async (req, res) => {
    try {
        const [result] = await deleteById(req.params.pedidos_id, req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    } 
});


module.exports = router;