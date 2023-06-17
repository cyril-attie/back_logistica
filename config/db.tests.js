const mysql2 = require('mysql2');
require('dotenv').config();


config = {
	host: process.env.DB_TEST_HOST,
	port: process.env.DB_TEST_PORT,
	user: process.env.DB_TEST_USER,
	password: process.env.DB_TEST_PASS,
	database: process.env.DB_TEST_NAME
};

const connection = mysql2.createPool(config);

const query = (...args) => {
	return new Promise((resolve, reject) => {
		connection.query(...args, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}

const closeConnection = () => {
	return new Promise((resolve, reject) => {
		if (connection) {
			connection.end((err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
};

module.exports = {
	connection: connection,
	closeConnection: closeConnection,
	query: query
};