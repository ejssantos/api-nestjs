// src/users.controller.ts

import { Controller, Get /*, Post, Body, Param, Delete*/ } from '@nestjs/common';
import { MySQLService } from './mysql.service';

@Controller('mysql')
export class MySQLController {
  constructor(private readonly mysqlService: MySQLService) {}

  @Get('dados')
  async findAll(): Promise<any> {
    const query = 'select users.id, users.name, users.email from api.users';
    return this.mysqlService.executeQuery(query);
  }

  /*
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    const query = 'SELECT * FROM users WHERE id = ?';
    return this.mysqlService.executeQuery(query, [id]);
  }

  @Post()
  async create(@Body() user: any): Promise<any> {
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    return this.mysqlService.executeQuery(query, [user.name, user.email]);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<any> {
    const query = 'DELETE FROM users WHERE id = ?';
    return this.mysqlService.executeQuery(query, [id]);
  }
  */
}
