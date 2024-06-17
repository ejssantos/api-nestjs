// src/mysql.service.ts

import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLService {
  private readonly pool;

  constructor() {
    this.pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'eduardo',      // substitua por seu usuário MySQL
      password: '124306',    // substitua pela sua senha MySQL
      database: 'api', //'mysql://eduardo:124306@127.0.0.1:3306/api',  // substitua pelo nome do seu banco de dados
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    console.log(query);
    const [results] = await this.pool.execute(query, params);
    console.log(results);
    return results;
  }
}
