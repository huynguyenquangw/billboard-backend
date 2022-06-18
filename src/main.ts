import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const whitelist = ['http://localhost:9000', 'http://localhost:3000'];
  app.enableCors({
    // origin: function (origin, callback) {
    //   if (!origin || whitelist.indexOf(origin) !== -1) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // app.setGlobalPrefix('api');
  const docUrl: string =
    config.get<string>('BASE_URL') + port + '/documentation';

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger(app);

  await app.listen(port, () => {
    // console.log(`[*API] ${apiUrl}`);
    console.info(`[* APIs-Doc]  ${docUrl}`);
  });
}

bootstrap();
