create table dev.uf(
  cd_uf      char(2 byte) not null enable,
  ds_uf      varchar2(50 byte) not null enable,
  ds_capital varchar2(50 byte),
  constraint uf_pk primary key (cd_uf)
    using index pctfree 10 initrans 2 maxtrans 255
      storage (
        initial 65536 next 1048576 minextents 1 maxextents 2147483645
        pctincrease 0 freelists 1 freelist groups 1 buffer_pool
        default flash_cache default cell_flash_cache default
      )
    tablespace users
  enable
)
segment creation immediate
pctfree 10 pctused 40 initrans 1 maxtrans 255 nocompress logging
  storage (
    initial 65536 next 1048576 minextents 1 maxextents 2147483645 pctincrease 0
    freelists 1 freelist groups 1 buffer_pool default
    flash_cache default cell_flash_cache default
  )
tablespace users;

comment on column dev.uf.cd_uf is 'Sigla da unidade federativa.';
comment on column dev.uf.ds_uf is 'Descrição da unidade federativa.';
comment on column dev.uf.ds_capital is 'Capital da unidade federativa.';