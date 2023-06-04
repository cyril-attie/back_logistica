const { checkToken, checkJefeDeEquipo } = require('../utils/middlewares');

const router = require('express').Router();

router.use('/usuarios', 
/*checkToken,
checkJefeDeEquipo,*/
require('./api/usuarios'));


module.exports = router;