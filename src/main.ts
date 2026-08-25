import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import { LoggingInterceptor } from './logging/logging.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Post API')
    .setDescription('게시글 및 카테고리 관리 API')
    .setVersion('1.0')

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          '로그인 API에서 발급받은 access token을 입력하세요. Bearer는 자동으로 붙으므로 토큰만 입력합니다.',
      },
      'access-token',
    )

    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: process.env.SWAGGER_AUTH_URL || '',
            tokenUrl: process.env.SWAGGER_TOKEN_URL || '',
            scopes: {
              email: 'User Email',
              name: 'User name',
            },
          },
        },
      },
      'oauth2',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${apiUrl}/api/oauth2-redirect.html`,
      withCredentials: true,
      initOAuth: {
        usePkceWithAuthorizationCodeGrant: true,
        clientId: process.env.CLIENT_ID || '',
        scopes: ['email', 'name'],
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
