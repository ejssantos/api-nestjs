/* eslint-disable @typescript-eslint/no-explicit-any */
// oracle.controller.ts
import { Controller, Get, Param } from "@nestjs/common";
import { OracleService } from "./oracle.service";
import { BindParameters } from "oracledb";

@Controller("oracle")
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Get("dados")
  async executeQuery(): Promise<unknown> {
    const query = `
      select
        usuarios.id
        , usuarios.nome
        , usuarios.sexo
      from
        dev.usuarios`;
    return this.oracleService.executeQuery(query);
  }

  @Get("usuario-por-sexo/:sexo")
  async executeQuery2(@Param('binds') binds = []): Promise<unknown> {
    const query = `
      select
        usuarios.id
        , usuarios.nome
        , usuarios.sexo
      from
        dev.usuarios
      where
        usuarios.tp_sexo = :binds[0]`;
    return this.oracleService.executeQuery(query, binds);
  }

  /*
    Exemplos:
      http://localhost:3000/oracle/query-dynamic/{"sexo":"M"}
      http://localhost:3000/oracle/query-dynamic/%7B%22sexo%22:%22M%22%7D
      
      http://localhost:3000/oracle/query-dynamic/{"sexo":"M", "id":2}
      http://localhost:3000/oracle/query-dynamic/%7B%22sexo%22:%22M%22,%20%22id%22:%202%7D
  */
  @Get('query-dynamic/:params')
  async queryDynamic(@Param('params') params: string): Promise<any> {
    // Exemplo de rota: /oracle/query-dynamic/{ "id": 1, "name": "John" }
    const bindParams = JSON.parse(params); // converte o parâmetro de string JSON para objeto
    let sql = `
      select
        usuarios.id
        , usuarios.nome
        , usuarios.sexo
      from
        dev.usuarios
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
        repositorio_webservice.stmt_sql
      from
        dev.repositorio_webservice
      where
        repositorio_webservice.id = `+ id;
    return this.oracleService.getSQL(sql);
  }

  //  Exemplo: http://localhost:3000/oracle/sql2/uf-all
  @Get('sql2/:nome')
  async execApi2(@Param('nome') nome: string): Promise<unknown> {
    const sql = `
      select
        repositorio_webservice.stmt_sql
      from
        dev.repositorio_webservice
      where
        repositorio_webservice.api = `+ "'" + nome + "'";
    return this.oracleService.getSQL(sql);
  }

  //@Get('repository/:api/:params')
  //http://localhost:3000/oracle/repository/{"sexo":"M"}
  @Get('repository/:params')
  async repository(/*@Param('api') api: string,*/ @Param('params') params: string): Promise<any> {
    let sql = '';

    let query = `
      select
        produtos.cd_produto
        , produtos.ds_produto
        , produtos.vl_unit
        , produtos.perc_desc
        , produtos.qt_estoque
        , produtos.sn_ativo
      from
        dev.produtos
      where
        produtos.sn_ativo = :psn_ativo
        and produtos.qt_estoque < :pqt_estoque
    `;

    // Exemplo de rota: /oracle/repository/{ "id": 1, "name": "John" }
    const bindParams = JSON.parse(params); // converte o parâmetro de string JSON para objeto

    // Valida se o parâmetro passado é um objeto
    if (typeof bindParams !== 'object' || Array.isArray(bindParams)) {
      throw new Error('Parâmetros inválidos. Deve ser um objeto JSON.');
    }

    const binds: BindParameters = {};

    // Monta a consulta SQL dinamicamente com base nos binds passados
    Object.keys(bindParams).forEach(key => {
      sql += ` and ${key} = :${key.replace('.', '_')}`;
      binds[key.replace('.', '_')] = bindParams[key];

      console.log(key + ' : ' + bindParams[key]);
      query = query.replace(key, bindParams[key]);
    });

    console.log(query);
/*
    Object.keys(bindParams).forEach(key => {
      query = query.replace(${key});
    });*/

    //console.log(query);

    return query;

    /*
    const sql = `
      select
        repositorio_webservice.stmt_sql
      from
        dev.repositorio_webservice
      where
        repositorio_webservice.api = `+ "'" + api + "'";
    sql = this.oracleService.getSQL2(sql);*/
    
    /*




    return this.oracleService.executeSQL2(sql, binds);*/

  }


  //Versão final
  //@Get('repository/:api/:params')
  //http://localhost:3000/oracle/repository/{"sexo":"M"}
  @Get('repository2/:api/:params')
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
        repositorio_webservice.stmt_sql
      from
        dev.repositorio_webservice
      where
        repositorio_webservice.api = ':api'`;
    sql = sql.replace(':api', api);

    let query: string = '';
    /*
    if (typeof sql === 'string') {
      query = sql;
      console.log('Passo 1: ' + query);
    } else if (sql && typeof sql.stmt_sql === 'string') {
      query = sql.stmt_sql;
      console.log('Passo 2: ' + query);
    } else {
      console.log('O resultado de getSQL2 não é uma string válida');
    }
    */

    sql = await this.oracleService.getSQL2(sql);

    //const resp = sql.result.rows;
    //console.log('Resp: ' + resp);

    //return sql;

    //let varString: string = sql;
    //varString = varString.replace(':psn_ativo', 'S');

/*
    if (typeof sql === 'string') {
      query = sql;
      console.log('Passo 1: ' + query);
    } else if (sql && typeof sql.stmt_sql === 'string') {
      query = sql.stmt_sql;
      console.log('Passo 2: ' + query);
    } else {
      console.log('Resultado: ' + query.substring(1, query.length));
      console.log('O resultado de getSQL2 não é uma string válida');
    }
*/

    // Substituir parâmetros na consulta
    /*
    Object.keys(bindParams).forEach(key => {
      const value = bindParams[key];
      sql = sql.replace(new RegExp(`:${key}`, 'g'), value);
    });
    */

    //sql = sql.replace(':psn_ativo', 'S');
    //console.log(query);
    //return resp;

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


    // Log para verificar a consulta final
    //console.log(`Consulta final: ${sql.toString()}`);
    //console.log(`Parâmetros: ${JSON.stringify(binds)}`);
    
    //return this.oracleService.executeSQL2(sql, binds);
    //return this.oracleService.executeQuery(sql);


/*



    

    // Monta a consulta SQL dinamicamente com base nos binds passados
    Object.keys(bindParams).forEach(key => {
      sql += ` and ${key} = :${key.replace('.', '_')}`;
      binds[key.replace('.', '_')] = bindParams[key];

      console.log(key + ' : ' + bindParams[key]);
      query = query.replace(key, bindParams[key]);
    });

    console.log(query);
    */
/*
    Object.keys(bindParams).forEach(key => {
      query = query.replace(${key});
    });*/

    /*
    const sql = `
      select
        repositorio_webservice.stmt_sql
      from
        dev.repositorio_webservice
      where
        repositorio_webservice.api = `+ "'" + api + "'";
    sql = this.oracleService.getSQL2(sql);*/
    
    /*

    return this.oracleService.executeSQL2(sql, binds);*/

  }


}
