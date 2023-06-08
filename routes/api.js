const { checkToken, checkJefeDeEquipo } = require('../utils/middlewares');

const router = require('express').Router();

router.use('/usuarios', 
//checkToken,
//checkJefeDeEquipo,
require('./api/usuarios'));


router.use('/roles', // checkToken, checkJefeDeEquipo,
require('./api/roles'));


router.use('/camiones', // checkToken, // checkJefeDeEquipo,
require('./api/camiones'));
/*

router.use('/almacenes', // checkToken,// checkJefeDeEquipo,
require('./api/almacenes'));


router.use('/pedidos', // checkToken,// checkJefeDeEquipo,
require('./api/pedidos'));


router.use('/materiales', // checkToken,// checkJefeDeEquipo,
require('./api/materiales'));


router.use('/categorias_materiales', // checkToken,// checkJefeDeEquipo,
require('./api/categorias_materiales'));


router.use('/stocks', // checkToken,// checkJefeDeEquipo,
require('./api/stocks'));
*/

module.exports = router;