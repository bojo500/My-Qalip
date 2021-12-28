import * as dotenv from "dotenv";
import * as fs from "fs";
import * as Joi from "joi";
import { Injectable, Logger } from "@nestjs/common";

export interface EnvConfig {
  [key: string]: any;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig = {};
  private readonly logger: Logger = new Logger(ConfigService.name);

  constructor() {
    let config;
    try {
      config = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
    } catch (error) {
      this.logger.error(`No ${process.env.NODE_ENV}.env file was found.`);
    }
    if (config) {
      this.envConfig = ConfigService.validateInput(config);
    }
  }

  /**
   * Validate ${NODE_ENV}.dev.env file
   * @param envConfig environment variables specified in ${NODE_ENV}.dev.env file
   */
  static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      DB_TYPE: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      CHARSET: Joi.string().required(),
      ENTITIES: Joi.string().required(),
      FACTORIES: Joi.string().required(),
      SEEDS: Joi.string().required(),
      SUBSCRIBERS: Joi.string().required(),
      APP_PORT: Joi.number().required(),
      SYNCHRONIZE: Joi.boolean(),
      JWT_SECRET: Joi.string().required(),
      MAIL_HOST: Joi.string(),
      MAIL_USER: Joi.string(),
      MAIL_PASSWORD: Joi.string(),
      SENDGRID_API_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  get mailHost():string {
    return this.envConfig.MAIL_HOST;
  }

  get mailUser():string {
    return this.envConfig.MAIL_USER;
  }

  get mailPassword():string {
    return this.envConfig.MAIL_PASSWORD;
  }

  get mailForm():string {
    return this.envConfig.SENDGRID_API_KEY;
  }

  get databaseSynchronize(): boolean {
    return this.envConfig.SYNCHRONIZE || false;
  }

  get charset(): string {
    return this.envConfig.CHARSET;
  }

  get appDatabaseType(): "mysql" | "mariadb" {
    return this.envConfig.DB_TYPE;
  }

  get appPort(): string {
    return this.envConfig.APP_PORT;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get jwtExpiresIn(): number {
    return Number(this.envConfig.JWT_EXPIRES_IN) || 30 * 24 * 60 * 60;
  }

  get databaseHost(): string {
    return this.envConfig.DB_HOST;
  }

  get databaseName(): string {
    return this.envConfig.DB_NAME;
  }

  get entities(): string[] {
    return [this.envConfig.ENTITIES];
  }

  get seeds(): string[] {
    return [this.envConfig.SEEDS];
  }

  get factories(): string[] {
    return [this.envConfig.FACTORIES];
  }

  get subscribers(): string[] {
    return [this.envConfig.SUBSCRIBERS];
  }

  get databaseUsername(): string {
    return this.envConfig.DB_USERNAME;
  }

  get databasePassword(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get databasePort(): number {
    return Number(this.envConfig.DB_PORT);
  }


}
