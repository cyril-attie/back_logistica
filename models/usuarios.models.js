


const getAll = () => {
    return db.query('   SELECT u.nombre, u.apellido, u.email, u.activo, r.descripcion_rol \
                        FROM usuarios as u \
                        JOIN roles as r ON r.roles_id=u.roles_id;'
                    );
}

const create = (usuario) => {
    let {nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id} = usuario;
    let values = [nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id];
    return db.query('   INSERT INTO usuarios (nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id) \
                        VALUES \
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  
                        values
                    );
};




module.exports = {
    getAll, create
}