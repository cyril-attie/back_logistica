const { checkToken, checkJefeDeEquipo, checkPermisos } = require('../utils/middlewares');
const router = require('express').Router();

// rutas públicas
router.use('/auth', require('./api/authentication'));

// rutas comunes a todos los usuarios
router.use(checkToken);
router.use('/perfil', require('./api/perfil'));

// Verificar la authorización al método y ruta llamados en función del rol.
router.use(checkPermisos);

//visible a jefe y desarrollador, editable por jefe
router.use('/usuarios', require('./api/usuarios'));

// visible a todos pero editable por jefe
router.use('/roles', require('./api/roles'));
router.use('/camiones', require('./api/camiones'));

// Encargado accede solo al detalle de almacen **que el es encargado**
// jefe a todas las rutas.
// operario y desarrollador solo ven.
router.use('/almacenes', require('./api/almacenes'));

// Encargado todas salvo borrar y editar, Jefe todas, Operario lee
router.use('/materiales', require('./api/materiales'));  
router.use('/categorias', require('./api/categorias_de_materiales')) 

// Encargado todas, jefe todas, operario lee, desarrollador lee. 
router.use('/stocks', require('./api/stocks'));

// Operario crea y ve las que ha creado, Encargado Edita los de su almacen, jefe ve y edita los de todos los almacenes  
router.use('/pedidos', require('./api/pedidos'));


module.exports = router;
