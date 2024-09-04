/* eslint-disable @typescript-eslint/no-explicit-any */
// oracle.controller.ts
import { Controller, Get, Param } from "@nestjs/common";
import { OracleService } from "./oracle.service";
import { BindParameters } from "oracledb";

@Controller("oracle")
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}


  /** Status: Testado 
   *  Exemplo: http://localhost:3010/oracle/setores
   */
  @Get("setores")
  async executeQuery(): Promise<unknown> {
    const query = `
      select
        setor.cd_setor
        , setor.nm_setor
      from
        dbamv.setor
      where
        setor.sn_ativo = 'S'
      order by
        setor.nm_setor asc`;
    return this.oracleService.executeQuery(query);
  }

  @Get("setores/:codigo")
  async executeQuery2(@Param('binds') binds = []): Promise<unknown> {
    const query = `
      select
        setor.cd_setor
        , setor.nm_setor
      from
        dbamv.setor
      where
        setor.sn_ativo = 'S'
        and setor.cd_setor = :binds[0]
      order by
        setor.nm_setor asc`;
    return this.oracleService.executeQuery(query, binds);
  }

  /** Status: Testado
   *  Exemplos:
   *    http://localhost:3010/oracle/query-dynamic/{"cd_setor":385}
   *    http://localhost:3010/oracle/query-dynamic/{"cd_setor":385, "sn_ativo":"S"}
   *    http://localhost:3010/oracle/query-dynamic/{"setor.cd_setor":733, "setor.sn_ativo":"S"}
   * 
   *    http://localhost:3000/oracle/query-dynamic/{"sexo":"M", "id":2}
   *    http://localhost:3000/oracle/query-dynamic/%7B%22sexo%22:%22M%22,%20%22id%22:%202%7D
   */
  @Get('query-dynamic/:params')
  async queryDynamic(@Param('params') params: string): Promise<any> {
    // Exemplo de rota: /oracle/query-dynamic/{ "id": 1, "name": "John" }
    const bindParams = JSON.parse(params); // converte o parâmetro de string JSON para objeto
    let sql = `
      select
        setor.cd_setor
        , setor.nm_setor
      from
        dbamv.setor
      where
        1 = 1`;

      // Valida se o parâmetro passado é um objeto
      if (typeof bindParams !== 'object' || Array.isArray(bindParams)) {
        throw new Error('Parâmetros inválidos. Deve ser um objeto JSON.');
      }

      const binds: BindParameters = {};

    // Monta a consulta SQL dinamicamente com base nos binds passados
    Object.keys(bindParams).forEach(key => {
      sql += ` and ${key} = :${key.replace('.', '_')}`;
      binds[key.replace('.', '_')] = bindParams[key];
    });

    return this.oracleService.executeSQL2(sql, binds);
  }

  @Get('sql/:id')
  async execApi(@Param('id') id: number): Promise<unknown> {
    const sql = `
      select
        scmm_repositorio_webservices.ds_instrucao_sql_crud stmt_sql
      from
        dbamv.scmm_repositorio_webservices
      where
        scmm_repositorio_webservices.cd_repositorio = `+ id;
    return this.oracleService.getSQL(sql);
  }

  //  Exemplo: http://localhost:3000/oracle/sql2/uf-all
  @Get('sql2/:nome')
  async execApi2(@Param('nome') nome: string): Promise<unknown> {
    const sql = `
      select
        scmm_repositorio_webservices.ds_instrucao_sql_crud stmt_sql
      from
        dbamv.scmm_repositorio_webservices
      where
        scmm_repositorio_webservices.sn_ativo = 'S'
        and scmm_repositorio_webservices.ds_flag = `+ "'" + nome + "'";

    console.log(sql);
    return this.oracleService.getSQL(sql);
  }

  //Versão final
  //@Get('repository2/:api/:params')
  //http://localhost:3010/oracle/repository2/ListagemSetoresPorCodigo/{":cd_setor":364}
  @Get('repository/:api/:params')
  async repository2(@Param('api') api: string, @Param('params') params: string): Promise<any> {

    if (!api) {
      throw new Error('O parâmetro :api é obrigatório.');
    }

    // Exemplo de rota: /oracle/repository/{ "id": 1, "name": "John" }
    const bindParams = JSON.parse(params);
    const binds: BindParameters = {};
    //const binds: { [key: string]: any } = {};

    // Valida se o parâmetro passado é um objeto
    if (typeof bindParams !== 'object' || Array.isArray(bindParams)) {
      throw new Error('Parâmetros inválidos. Deve ser um objeto JSON.');
    }

    //Exemplo: http://localhost:3000/oracle/repository2/{":api":"'usuarios-all'"}
    let sql: any = `
      select
        scmm_repositorio_webservices.ds_instrucao_sql_crud stmt_sql
      from
        dbamv.scmm_repositorio_webservices
      where
        scmm_repositorio_webservices.sn_ativo = 'S'
        and scmm_repositorio_webservices.ds_flag = ':api'`;

    sql = sql.replace(':api', api);

    let query: string = '';

    sql = await this.oracleService.getSQL2(sql);

    // Monta a consulta SQL dinamicamente com base nos binds passados
    Object.keys(bindParams).forEach(key => {
      //sql += ` and ${key} = :${key.replace('.', '_')}`;
      //binds[key.replace('.', '_')] = bindParams[key];
      
      console.log(key + ' : ' + bindParams[key]);
      binds[key] = bindParams[key];
      sql = sql.toString().replace(key, bindParams[key]);
    });
   
    console.log(sql);
    // Exemplo: http://localhost:3000/oracle/repository2/produto-where/{":psn_ativo":"'S'",":pqt_estoque":"80",":pvl_unit":"50",":pperc_desc":"0"}
    return this.oracleService.executeQuery(sql);
  }

}
