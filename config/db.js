const mysql2 = require('mysql2');

const DB_ENV= {
	host: process.env.DB_HOST,
	user:process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port:process.env.DB_PORT,
	database:process.env.DB_NAME,
}

const pool = mysql2.createPool(DB_ENV);

// =================================A colocar en tests=====================
const checkDB = async ()=>{
	const [result] = await pool.promise().query('SHOW columns from usuarios');
	const verificaciones = result.map(({Field})=>  ['nombre',	'apellido', 'email'].includes(Field));
	const DBbool = verificaciones.reduce((acc, curr, i, a)=> acc|curr, false);	
	console.log(`La base de datos funciona: ${Boolean(DBbool)}`);
};


module.exports = { checkDB };
// =====================================

global.db = pool.promise ;

