import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Aktifkan CORS untuk frontend (Vite/Vue)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // asal frontend kamu
    credentials: true,               // jika pakai cookie/session
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // 🧩 (Opsional) middleware session jika kamu butuh session login
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
