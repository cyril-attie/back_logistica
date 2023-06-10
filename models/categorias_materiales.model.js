
// CREAR UNA NUEVA CATEGORIA 
const create = (categoria) => {
    let { descripcion, comentario } = categoria; 
    let values = [descripcion, comentario];
    return db.query ('INSERT INTO categorias_materiales (descripcion, comentario) values (?, ?)', values)
};


/* sin desestructurar

const create = ({ descripcion, comentario }) => {
    return db.query ('INSERT INTO categorias_materiales (descripcion, comentario) values (?, ?)',
    [descripcion, comentario])

};
*/


// SELECCIONAR TODAS LAS CATEGORIAS 
const getAll = () => {
    return db.query('SELECT * FROM categorias_materiales'
    );
}

// SELECIONAR POR ID
const getById = (categoria_id) => {
    return db.query('select * from categorias_materiales where categorias_materiales_id = ?', [categoria_id])
}

// ACTUALIZAR

const update = (categoria_id, {descripcion, comentario}) => {
    return db.query(
        'update categorias_materiales set descripcion = ?, comentario = ? where categorias_materiales_id = ?', 
        [descripcion, comentario, categoria_id]
    )
};


// BORRAR
const deleteById = async (categoria_id) => {
    return db.query('DELETE from categorias_materiales where categorias_materiales_id = ?', [categoria_id]);
}




module.exports = {
    create, 
    getAll, 
    getById,
    update, 
    deleteById

}