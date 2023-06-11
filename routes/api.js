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

// Encargado accede solo al detalle de almacen **que el es encargado**
// jefe a todas las rutas.
router.use('/almacenes', require('./api/almacenes'));

// Encargado todas salvo borrar y editar, Jefe todas, Operario lee
router.use('/materiales', require('./api/materiales'));  
router.use('/categorias', require('./api/categorias_de_materiales')) 

// Encargado todas, jefe ?, operario lee, 
router.use('/stocks', require('./api/stocks'));

// Operario crea, Encargado Edita,  
router.use('/pedidos', require('./api/pedidos'));    // crear operario, 


module.exports = router;
