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
  app.setGlobalPrefix('api');
  // const apiUrl: string = config.get<string>('BASE_URL') + port + '/api';
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
