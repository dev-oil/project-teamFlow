# Node.js 이미지 사용
FROM node:22.14.0

# 앱 디렉토리 생성
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 개발용 의존성 포함 설치
RUN npm ci

# 앱 소스 코드 복사
COPY . .

# TypeScript 코드 빌드
RUN npm run build

# Prisma Client 생성
RUN npx prisma db pull
RUN npx prisma generate

# 빌드 후 devDependencies 제거
RUN npm prune --production

# 컨테이너 포트 설정
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]

# Dockerfile, .dockerignore 작성 후
# docker build -t teamflow-backend .
