import './utils/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import apiSchema from './api.schema.json'
import { OpenApiValidator } from 'express-openapi-validator'
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'
import { BeachesController } from './controllers/beaches';
import { ForecastController } from './controllers/forecast';
import { UserController } from './controllers/users';
import { Application } from 'express';
import * as database from '@src/database';
import logger from './logger';
import { apiErrorValidator } from './middlewares/api-error-validator';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.docsSetup()
    this.setupControllers();
    await this.databaseSetup();
    this.setupErrorHandlers()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino(logger));
    this.app.use(cors())
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator)
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const userController = new UserController();
    this.addControllers([
      forecastController,
      beachesController,
      userController,
    ]);
  }

  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema))
    await new OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true
    }).install(this.app)
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server is running on port: ' + this.port);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
