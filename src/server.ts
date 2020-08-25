import './utils/module-alias'
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { BeachesController } from './controllers/beaches'
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database'

export class SetupServer extends Server {
    constructor(private port = 3000) {
        super()
    }

    public async init(): Promise<void> {
        this.setupExpress()
        this.setupController()
        await this.databaseSetup()
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json())
    }

    private setupController(): void {
        const forecastController = new ForecastController()
        const beachesController = new BeachesController()
        this.addControllers([forecastController, beachesController])
    }

    private async databaseSetup(): Promise<void> {
      await database.connect()
    }

    public start(): void {
      this.app.listen(this.port, () => {
        console.info('Server is running on port:', this.port)
      })
    }

    public async close(): Promise<void> {
      await database.close()
    }

    public getApp(): Application {
        return this.app
    }
}
