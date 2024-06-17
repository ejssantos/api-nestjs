import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OracleController } from "./database/oracle/oracle.controller";
import { OracleService } from "./database/oracle/oracle.service";
import { MySQLService } from "./database/mysql/mysql.service";
import { MySQLController } from "./database/mysql/mysql.controller";

@Module({
  imports: [],
  controllers: [AppController, OracleController, MySQLController],
  providers: [AppService, OracleService, MySQLService],
})
export class AppModule {
  constructor(private readonly oracleService: OracleService) {
    this.oracleService.connect();
  }
}
