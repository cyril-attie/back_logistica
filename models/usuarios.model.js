


const getAll = () => {
    return db.query('   SELECT *\
                        FROM usuarios as u'
                    );
}

const getById = (usuario_id) => {
    return db.query('select * from usuarios where usuarios_id = ?', [usuario_id])
}
const create = (usuario) => {
    let {nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider} = usuario;
    let values = [nombre, apellido, email, contrasena, activo?activo:1 , edad, ciudad, codigo_postal, pais, roles_id,usuarios_id_lider];
    return db.query('   INSERT INTO usuarios (nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id,usuarios_id_lider) \
                        VALUES \
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',  
                        values
                    );
};

const getByEmail = (email) => {
    console.log(email)
    return db.query('select * from usuarios where email = ?', [email])
}


module.exports = {
    getAll, create, getById, getByEmail
}