const getAll = () => {
    return db.query('SELECT * FROM users');
}



module.exports = {
    getAll
}