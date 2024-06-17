begin
  --dev.usuarios_tapi.ins(1, 'Gabriela Nunes Alves', 'F');
  dev.usuarios_tapi.ins(2, 'Eduardo J S dos Santos', 'M');
  dev.usuarios_tapi.ins(3, 'Adriana Medeiros Verçosa', 'F');
  dev.usuarios_tapi.ins(4, 'Ivan Artur', 'M');
  dev.usuarios_tapi.ins(5, 'Maria Eduarda Medeiros dos Santos', 'F');
  dev.usuarios_tapi.ins(6, 'Luiz Inácio Lula da Silva', 'M');
  dev.usuarios_tapi.ins(7, 'Dilma Roussef', 'F');
  commit;
end;


select
  usuarios.id
  , usuarios.nome
  , usuarios.sexo
from
  dev.usuarios;

select
  repositorio_webservice.stmt_sql
from
  dev.repositorio_webservice
where
  repositorio_webservice.api = 'usuarios-all';
  
select
  repositorio_webservice.id
  , repositorio_webservice.api
  , repositorio_webservice.tp_dml
  , repositorio_webservice.stmt_sql
from
  dev.repositorio_webservice
where
  repositorio_webservice.id = 1;


grant select, insert, update, delete on table usuarios to dev;