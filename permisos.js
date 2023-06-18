select p.*, u.usuarios_id_lider as usuarios_id_lider_de_creador 
from pedidos as p 
join usuarios as u on u.usuarios_id=p.usuarios_id_creador 
where u.usuarios_id_lider=26