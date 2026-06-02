import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { DrizzleModule } from './db/drizzle.module';
import { FlightSyncModule } from './flight-sync/flight-sync.module';
import { FlightsModule } from './flights/flights.module';
import { HealthModule } from './health/health.module';
import { NewsModule } from './news/news.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ServicePhotosModule } from './service-photos/service-photos.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    DrizzleModule,
    HealthModule,
    NewsModule,
    FlightsModule,
    FlightSyncModule,
    SubscriptionsModule,
    VacanciesModule,
    ServicePhotosModule,
    FeedbackModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
