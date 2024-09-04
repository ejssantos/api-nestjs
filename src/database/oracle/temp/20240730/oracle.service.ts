/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// oracle.service.ts

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BindParameters } from "oracledb";

//import * as oracledb from "oracledb";
const oracledb = require('oracledb');

@Injectable()
export class OracleService {
  dbConfig;
  private dbName;
  private dbHost;
  private dbPort;
  private dbUser;
  private dbPassword;

  constructor(private configService: ConfigService) {
    this.dbName = this.configService.get<string>('DB_NAME');
    this.dbHost = this.configService.get<string>('DB_HOST');
    this.dbPort = this.configService.get<number>('DB_PORT');
    this.dbUser = this.configService.get<string>('DB_USER');
    this.dbPassword = this.configService.get<string>('DB_PASSWORD');

    this.dbConfig = {
      user: this.dbUser,
      password: this.dbPassword,
      connectString: this.dbHost +':'+ this.dbPort +'/'+ this.dbName,
      poolMin: 10,
      poolMax: 10,
      externalAuth: false,
      //poolAlias: process.env.POOL_ALIAS,
    };

    // O initOracleClient não deve ser chamado em cada conexão, mas apenas uma vez.
    oracledb.initOracleClient({ libDir: 'C:\\Oracle\\instantclient_21_13' });
    oracledb.autoCommit = true; // Commit automático após cada transação
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchAsString = [oracledb.CLOB, oracledb.NCLOB]; // Tratar CLOBs como strings
  }

  async connect() {
    try {
      // Criando o pool de conexão
      oracledb.createPool(this.dbConfig);
      //console.log('Connected to Oracle database');
      console.log(`Connecting to database on ${this.dbHost}:${this.dbPort} with user ${this.dbUser}`);
    } catch (error) {
      console.error('Error connecting to Oracle database:', error);
    }
  }
  
  async executeQuery(sql: string, binds = []) {
    let connection;
    try {
      connection = await oracledb.getConnection(this.dbConfig);
      const result = await connection.execute(sql, binds);
      return result.rows;
    } catch (error) {
      console.error('Erro ao executar a consulta SQL: ' + sql, error);
      throw error; // Lança o erro para quem chamou o método executeQuery()
    }
  }

  async getSQL(sql: string, binds = []) {
    let query: string;
    let dataSql;
    let dataReturn = null;

    try {
      dataSql = await this.executeQuery(sql);
      dataReturn = JSON.parse(JSON.stringify(dataSql).replace(/\\n/g, ''));
      query = dataReturn[0].STMT_SQL;
      dataReturn = await this.executeQuery(query, binds);
      return dataReturn;
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async getSQL2(sql: string): Promise<any> {
    let query: string;
    let dataSql;
    let dataReturn = null;

    try {
      dataSql = await this.executeQuery(sql);
      dataReturn = JSON.parse(JSON.stringify(dataSql).replace(/\\n/g, ''));
      query = dataReturn[0].STMT_SQL;
      
      return query;
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async getSQL3(sql: string): Promise<string> {
    try {
      const dataSql = await this.executeQuery(sql);
      
      if (dataSql && Array.isArray(dataSql) && dataSql.length > 0 && typeof dataSql[0].STMT_SQL === 'string') {
        let stmtSql = dataSql[0].STMT_SQL;
        stmtSql = stmtSql.replace(/\n/g, ''); // Limpar caracteres de nova linha se necessário
        return stmtSql;
      } else {
        throw new Error('Consulta não retornou um STMT_SQL válido.');
      }
    } catch (error) {
      console.error('Erro ao obter SQL:', error);
      throw new Error('Erro ao obter SQL.');
    }
  }

  async executeSQL2(sql: string, binds: BindParameters = {}): Promise<any> {
    let connection;
    try {
      connection = await oracledb.getConnection(this.dbConfig);
      const options = { autoCommit: true, bindDefs: binds };
      const result = await connection.execute(sql, binds, options);
      return result.rowsAffected || result.rows || [];
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Erro ao fechar conexão Oracle:', error);
        }
      }
    }
  }

}
