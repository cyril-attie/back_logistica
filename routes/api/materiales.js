const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { getAll, create, getById, updateById, deleteById } = require('../../models/materiales.model');
const { checkJefeDeEquipo } = require('../../utils/middlewares');







// Crear nuevo material
router.post('/nuevo', async (req, res) => {
    console.log(JSON.stringify(req.body));

    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});



//Recupera todos los materiales
router.get('/', async (req, res) => {
    try {
        const [result] = await getAll();
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un material por id
router.get('/:materiales_id', async (req, res) => {
    try {
        const [usuario] = await getById(req.params.materiales_id);
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



// Actualizar los detalles de un material
router.put('/:materiales_id', async (req, res) => {
    try {
        const [result] = await updateById(req.params.materiales_id, req.body);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }

});



// Borrar un material
router.delete('/:materiales_id', checkJefeDeEquipo, async (req, res) => {

    try {
        const [result] = await deleteById(req.params.materiales_id);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }


});


module.exports = router;