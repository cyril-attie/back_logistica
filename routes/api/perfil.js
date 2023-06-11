const router = require('express').Router();
const bcrypt = require('bcryptjs');


const { updateById, deleteById } = require('../../models/usuarios.model')

// Obtener el perfil 
router.get('/', async (req, res) => {
    try {
        req.usuario.contrasena = '';
        res.json(usuario);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

// Actualizar los detalles de perfil
router.put('/', async (req, res) => {
    try {
        const [result] = await updateById(req.usuario.usuarios_id, req.body);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ fatal: error.message });
    }

});

// borrar perfil 
router.delete('/', async (req, res) => {
    try {
        const [result] = await deleteById(req.usuario.usuarios_id);
        res.json(result);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


module.exports = router;