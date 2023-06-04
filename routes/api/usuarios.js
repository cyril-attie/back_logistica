const router = require('express').Router();

const {getAll,create} = require('../../models/usuarios.models') 

//Recupera todos los usuarios
router.get('/', async (req, res) =>{
	const [result] = await getAll(); 
    res.json(result);
});

// Crear nuevo usuario
router.post('/nuevo', async (req, res) =>{
	
    console.log(req.body );
    const [result] = await create( req.body ); 
    res.json(result);
   
});

module.exports = router;
