create or replace package dev.usuarios_tapi is
  type usuarios_tapi_rec is record (
      id   usuarios.id%type,
      nome usuarios.nome%type,
      sexo usuarios.sexo%type
  );
  type usuarios_tapi_tab is
    table of usuarios_tapi_rec;

-- insert
  procedure ins (
    p_id   in usuarios.id%type,
    p_nome in usuarios.nome%type,
    p_sexo in usuarios.sexo%type default null
  );
-- update
  procedure upd (
    p_id   in usuarios.id%type,
    p_nome in usuarios.nome%type,
    p_sexo in usuarios.sexo%type default null
  );
-- delete
  procedure del (
    p_id in usuarios.id%type
  );

end usuarios_tapi;
/


create or replace package body dev.usuarios_tapi is
-- insert
  procedure ins (
    p_id   in usuarios.id%type,
    p_nome in usuarios.nome%type,
    p_sexo in usuarios.sexo%type default null
  ) is
  begin
    insert into usuarios (
      id,
      nome,
      sexo
    ) values (
      p_id,
      p_nome,
      p_sexo
    );

  end;
-- update
  procedure upd (
    p_id   in usuarios.id%type,
    p_nome in usuarios.nome%type,
    p_sexo in usuarios.sexo%type default null
  ) is
  begin
    update usuarios
    set
      nome = p_nome,
      sexo = p_sexo
    where
      id = p_id;

  end;
-- del
  procedure del (
    p_id in usuarios.id%type
  ) is
  begin
    delete from usuarios
    where
      id = p_id;

  end;

end usuarios_tapi;
/
