import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/Forecast';
import { Request, Response } from 'express';
import { BaseController } from '.';
import rateLimit from 'express-rate-limit';
import ApiError from '@src/utils/errors/api-error';

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 100,
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_: Request, res: Response): void {
    res
      .status(429)
      .send(
        ApiError.format({
          code: 429,
          message: 'Too many requests to the /forecast endpoint',
        })
      );
  },
});
@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
