const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { getAll, create, getById, updateById, deleteById } = require('../../models/almacenes.model');


// Crear nuevo almacen
router.post('/nuevo', async (req, res) => {
    //console.log(JSON.stringify(req.body));

    try {
        const [result] = await create(req.body, req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});



//Recupera todos los almacenes
router.get('/', async (req, res) => {
    try {
        const result = await getAll(req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un almacen por id
router.get('/:almacenes_id', async (req, res) => {
    //res.json(usuario);
    try {
        const almacen = await getById(req.params.almacenes_id, req);
        res.json(almacen);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// Actualizar los detalles de un almacen
router.put('/:almacenes_id', async (req, res) => {
    try {
        const [result] = await updateById(req.params.almacenes_id, req.body, req);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }

});



// Borrar un almacen
router.delete('/:almacenes_id', async (req, res) => {
    try {
        const [result] = await deleteById(req.params.almacenes_id, req);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }


});


module.exports = router;