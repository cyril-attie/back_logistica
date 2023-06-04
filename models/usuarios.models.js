


const getAll = () => {
    return db.query('   SELECT nombre, apellido, email, activo, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider\
                        FROM usuarios as u'
                    );
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




module.exports = {
    getAll, create
}