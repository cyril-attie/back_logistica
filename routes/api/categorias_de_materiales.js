const { create, getAll, getById, deleteById, updateById } = require('../../models/categorias_materiales.model');

const router = require('express').Router();


// Crear nueva categoria
router.post('/nuevo', async (req, res) =>{
    try {
        const [result] = await create(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});


//Recupera todas las categorías
router.get('/', async (req, res) =>{
    try {
        const [result] = await getAll(); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});




//Recupera un rol por id
router.get('/:categoria_id', async (req, res) =>{
    const { categoria_id } = req.params;
    try {
        const [result] = await getById(categoria_id); 
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


// Actualizar una categoría
router.put('/:categoria_id', async (req, res) =>{
    const { categoria_id } = req.params;
    try {
        const [result] = await updateById( categoria_id, req.body); 
        res.json(result);
    } catch (error) {
        console.debug(error);
        res.json({ fatal: error.message });
    }
	
});



// // Borrar una categoría
router.delete('/:categoria_id', async (req, res) =>{
    const { categoria_id } = req.params;
    try {
        const [result] = await deleteById(categoria_id); 
        res.json(result);
        // console.debug("estoy borrando una categoria", result)
    } catch (error) {
        res.json({ fatal: error.message });
    }
});



module.exports = router;