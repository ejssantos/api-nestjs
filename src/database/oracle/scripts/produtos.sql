create table produtos (
  cd_produto number not null
  , ds_produto varchar2(100) not null
  , vl_unit    number(8, 2) default 0
  , perc_desc  number(5, 2) default 0
  , qt_estoque number(5, 2) default 0
  , sn_ativo   char(1) default 'S' not null
  , constraint produtos_pk primary key ( cd_produto ) enable
);

alter table produtos add constraint chk_produto_ativo
  check (sn_ativo in ('N', 'S')) enable;

comment on table produtos is
  'Tabela de produtos.';

comment on column produtos.cd_produto is
  'Código do produto.';

comment on column produtos.ds_produto is
  'Descrição do produto.';

comment on column produtos.vl_unit is
  'Valor unitário do produto.';

comment on column produtos.perc_desc is
  'Percentual de desconto.';

comment on column produtos.qt_estoque is
  'Quantidade em estoque.';

comment on column produtos.sn_ativo is
  'Produto ativo.';