import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // 👈 1. cookie-parser 임포트

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👈 2. 쿠키 파서 미들웨어 등록 (req.cookies 사용 가능하게 설정)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  // 3. Swagger 문서 및 OAuth2 설정 정의
  const config = new DocumentBuilder()
    .setTitle('Post')
    .setDescription('The posts API description')
    .setVersion('1.0')
    .addTag('posts')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: process.env.SWAGGER_AUTH_URL || '',
            tokenUrl: process.env.SWAGGER_TOKEN_URL || '',
            scopes: {
              openid: 'OpenID Connect',
              email: 'User Email',
              profile: 'User Profile (Name, Picture)', // 👈 'name'대신 'profile'이 구글 표준 Scope입니다.
            },
          },
        },
      },
      'oauth2', // Security Scheme Name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 4. Swagger UI 옵션 설정
  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${apiUrl}/api/oauth2-redirect.html`,
      // 👈 Swagger에서 인증 요청 시 브라우저 쿠키를 함께 전송하도록 설정
      withCredentials: true,
      initOAuth: {
        usePkceWithAuthorizationCodeGrant: true,
        clientId: process.env.CLIENT_ID || '',
        scopes: ['openid', 'email', 'name'],
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
