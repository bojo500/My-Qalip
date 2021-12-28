import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [ TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      return {
        type: configService.appDatabaseType,
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        synchronize: configService.databaseSynchronize,
        entities: configService.entities,
        seeds: configService.seeds,
        factories: configService.factories,
        subscribers: configService.subscribers,
        extra: {
          charset: configService.charset,
        },
      }
    },
    inject: [ConfigService],
  }),AuthModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
