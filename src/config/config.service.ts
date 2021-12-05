import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as dotenv from "dotenv";
import Joi from "joi";

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
      this.envConfig = this.validateInput(config);
    }
  }

  /**
   * Validate ${NODE_ENV}.env file
   * @param envConfig environment variables specified in ${NODE_ENV}.env file
   */
  public validateInput(envConfig: EnvConfig): EnvConfig {
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
      // GOOGLE_CLIENT_ID: Joi.string().required(),
      // GOOGLE_SECRET: Joi.string().required()
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
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

  // get googleClientId(): string {
  //   return this.envConfig.GOOGLE_CLIENT_ID;
  // }

  // get googleClientSecret(): string {
  //   return this.envConfig.GOOGLE_SECRET;
  // }

}
