const router = require('express').Router();

//Recupera todos los usuarios
router.get('/', (req, res) =>{
    res.json('Recupera todos los usuarios del almacén');
});


module.exports = router;