const router = require('express').Router();

const {getAll,create} = require('../../models/usuarios.models') 

//Recupera todos los usuarios
router.get('/', async (req, res) =>{
	const [result] = await getAll(); 
    res.json(result);
});


module.exports = router;
