# 1. Base 이미지
FROM node:18-alpine

WORKDIR /usr/src/app

# 2. 의존성 파일 복사 (캐싱 레이어 1)
COPY package*.json ./

# 3. 의존성 설치
RUN npm install

# 4. Prisma 스키마 복사 및 Client 생성 (캐싱 레이어 2)
# 소스코드가 바뀌어도 스키마가 안 바뀌면 이 레이어까지 캐시됨
COPY prisma ./prisma/
RUN npx prisma generate

# 5. 전체 소스코드 복사 및 Nest.js 빌드
COPY . .
RUN npm run build

# 6. 포트 노출 및 앱 실행
EXPOSE 3000
CMD ["npm", "run", "start:prod"]