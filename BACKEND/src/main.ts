import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// PERBAIKAN: Menggunakan Default Import (tanpa * as)
import session from 'express-session';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // ==========================================================
  // KONFIGURASI CORS
  // ==========================================================
  app.enableCors({
    origin: true, // Membolehkan semua origin (aman untuk dev)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(
    session({
      secret: 'rahasia-super-aman',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: false, // False untuk HTTP (Localhost)
        httpOnly: true,
        maxAge: 3600000 
      }, 
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();