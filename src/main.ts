import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
  SwaggerModule.setup('api', app, document as any);

  await app.listen(3000);
}
bootstrap();
