import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('QSR Waiter Order Management API')
      .setDescription('REST API for restaurant waiter order management system with multi-floor tables, menu management, and real-time order tracking')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000, '127.0.0.1');
    const port = process.env.PORT ?? 3000;
    console.log(`✓ Application listening on 127.0.0.1:${port}`);
    console.log(`✓ Swagger UI available at http://127.0.0.1:${port}/api`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
