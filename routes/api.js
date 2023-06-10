const { checkToken, checkJefeDeEquipo } = require('../utils/middlewares');

const router = require('express').Router();

router.use('/usuarios',require('./api/usuarios'));
router.use('/roles', require('./api/roles'));
router.use('/camiones', require('./api/camiones'));
router.use('/almacenes', require('./api/almacenes'));
<<<<<<<
router.use('/materiales', require('./api/materiales'));
=======
router.use('/categorias', require('./api/categorias_de_materiales'))
>>>>>>>
/*
router.use('/pedidos', require('./api/pedidos'));
router.use('/categorias_materiales', require('./api/categorias_materiales'));
router.use('/stocks', require('./api/stocks'));
*/
module.exports = router;