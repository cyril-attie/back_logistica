'select s.stocks_id, s.unidades, s.posicion, '+
's.materiales_id,m.nombre as nombre_material, m.descripcion_material,m.categorias_materiales_id as categorias_materiales_id, '+
'cm.descripcion as descripcion_categoria, cm.comentario as comentario_categoria '+
'from stocks as s '+
'join materiales as m on s.materiales_id=m.materiales_id '+
'join categorias_materiales as cm on cm.categorias_materiales_id=m.categorias_materiales_id'+
'where almacenes_id=?'+