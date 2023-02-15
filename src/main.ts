import { config } from 'aws-sdk';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIAVM6PLOCFTG73FRM3',
    secretAccessKey: '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',
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
