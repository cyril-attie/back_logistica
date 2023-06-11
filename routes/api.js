const { checkToken, checkJefeDeEquipo } = require('../utils/middlewares');
const router = require('express').Router();

// rutas públicas
router.use('/auth', require('./api/authentication'));

// rutas comunes a todos los usuarios
router.use(checkToken);
router.use('/perfil', require('./api/perfil'));

// rutas de jefe de Equipo
router.use('/usuarios', checkJefeDeEquipo, require('./api/usuarios'));
router.use('/roles', checkJefeDeEquipo, require('./api/roles'));
router.use('/camiones', checkJefeDeEquipo, require('./api/camiones'));
router.use('/almacenes', checkJefeDeEquipo, require('./api/almacenes'));





// rutas comunes a varios roles 
router.use('/materiales', require('./api/materiales'));
router.use('/pedidos', require('./api/pedidos'));
router.use('/categorias', require('./api/categorias_de_materiales'))
router.use('/stocks', require('./api/stocks'));



module.exports = router;
