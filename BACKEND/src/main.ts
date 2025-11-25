import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
// PERBAIKAN: Menggunakan sintaks 'require' untuk CommonJS
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  
  app.use(
    session({
      secret: 'rahasia-super-aman',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // true kalau HTTPS
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();