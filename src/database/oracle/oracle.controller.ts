/* eslint-disable @typescript-eslint/no-explicit-any */
// oracle.controller.ts
import { Controller, Get, Param } from "@nestjs/common";
import { OracleService } from "./oracle.service";
import { BindParameters } from "oracledb";

@Controller("oracle")
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  /** queryDynamic
   *  Exemplos:
   *    http://localhost:3010/oracle/query-dynamic/scmmweb.campos/{}
   *    http://localhost:3010/oracle/query-dynamic/scmmweb.campos/%7B%7D
   *    http://localhost:3010/oracle/query-dynamic/dbamv.atendime/{"campo1":"cd_atendimento", "campo2":"tp_atendimento","campo3":"cd_paciente"}/{"cd_atendimento":123, "tp_atendimento":"I"}
   *    http://localhost:3010/oracle/query-dynamic/dbamv.atendime/{"campo1":"atendime.*"}/{"atendime.cd_atendimento":123, "atendime.tp_atendimento":"I"}
   * 
   * @param table 
   * @param columns 
   * @param params 
   * @returns 
   */
  @Get('query-dynamic/:table/:columns/:params')
  async queryDynamic(
    @Param('table') table: string,
    @Param('columns') columns: string,
    @Param('params') params: string
  ): Promise<any> {
    const bindParams = JSON.parse(params); // converte o parâmetro de string JSON para objeto
    const bindColumns = JSON.parse(columns);

    // Construindo a lista de colunas para a consulta
    const columnsList = Object.keys(bindColumns).map(key => bindColumns[key]).join(', ');
    let sql = `select ${columnsList} from ${table} where 1 = 1`;
    
    //let sql: any = `select t.* from :table t where 1 = 1`;
    //sql = sql.replace(':table', table);

    console.log(columnsList);

    // Valida se o parâmetro passado é um objeto
    if  (
      (typeof bindColumns !== 'object' || Array.isArray(bindColumns))
      && (typeof bindParams !== 'object' || Array.isArray(bindParams))
    ) {
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

  /** repository
   *  http://localhost:3010/oracle/repository/ListagemSetoresPorCodigo{":cd_setor":364}
   * @param api 
   * @param params 
   * @returns 
   */
  @Get('repository/:api/:params')
  async repository(
    @Param('api') api: string,
    @Param('params') params: string
  ): Promise<any> {

    if (!api) {
      throw new Error('O parâmetro :api é obrigatório.');
    }

    // Exemplo de rota: /oracle/repository/{ "id": 1, "name": "John" }
    const bindParams = JSON.parse(params);
    const binds: BindParameters = {};

    // Valida se o parâmetro passado é um objeto
    if (typeof bindParams !== 'object' || Array.isArray(bindParams)) {
      throw new Error('Parâmetros inválidos. Deve ser um objeto JSON.');
    }

    let sql: any = `
      select
        scmm_repositorio_webservices.ds_instrucao_sql_crud stmt_sql
      from
        dbamv.scmm_repositorio_webservices
      where
        scmm_repositorio_webservices.sn_ativo = 'S'
        and scmm_repositorio_webservices.ds_flag = ':api'`;

    sql = sql.replace(':api', api);
    sql = await this.oracleService.getSQL2(sql);

    // Monta a consulta SQL dinamicamente com base nos binds passados
    Object.keys(bindParams).forEach(key => {
      console.log(key + ' : ' + bindParams[key]);
      binds[key] = bindParams[key];
      sql = sql.toString().replace(key, bindParams[key]);
    });
   
    console.log(sql);
    // Exemplo: http://localhost:3000/oracle/repository2/produto-where/{":psn_ativo":"'S'",":pqt_estoque":"80",":pvl_unit":"50",":pperc_desc":"0"}
    return this.oracleService.executeQuery(sql);
  }

}
