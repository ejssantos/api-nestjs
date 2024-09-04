import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OracleController } from "./database/oracle/oracle.controller";
import { OracleService } from "./database/oracle/oracle.service";
import { MySQLService } from "./database/mysql/mysql.service";
import { MySQLController } from "./database/mysql/mysql.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   //Faz o ConfigModule disponível globalmente
      envFilePath: path.resolve(__dirname, '..', 'src', 'env', '.env'),
    }),
  ],
  controllers: [AppController, OracleController, MySQLController],
  providers: [AppService, OracleService, MySQLService],
})
export class AppModule {
  constructor(
    private readonly oracleService: OracleService
    , private configService: ConfigService
  ) {

    //Logger.log('DB_HOST: ' + configService.get<string>('DB_HOST'));
    //Logger.log('DB_PORT: ' + configService.get<number>('DB_PORT'));
    //Logger.log('DB_USER: ' + configService.get<string>('DB_USER'));
    //Logger.log('DB_PASSWORD: ' + configService.get<string>('DB_PASSWORD'));
    //Logger.log('DB_NAME: ' + configService.get<string>('DB_NAME'));

    this.oracleService.connect();
  }
}
