import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as path from "path"
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {bodyParser: false});
  const configService = app.get(ConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'swagger.json'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.enableCors({
    origin: [configService.get('ALLOWED_ORIGIN1'), configService.get('ALLOWED_ORIGIN2')], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(configService.get('PORT'), () => {
    console.log("Api gateway server is listening..");
  });
}
bootstrap();
