# Node.js 이미지 사용
FROM node:22.14.0

# DATABASE_URL을 build-time에 주입
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

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
EXPOSE 1004

# 앱 실행
CMD ["npm", "start"]

# 1. Dockerfile, .dockerignore 작성 후
# 2. docker build \
#   --build-arg DATABASE_URL="DB URL" \
#   -t teamflow-backend .
# 3. 도커 hub 로그인
#    docker login
# 4. 태그 지정
#    docker tag teamflow-backend yourdockerhubusername/teamflow-backend:latest
# 5. 푸시
#    docker push yourdockerhubusername/teamflow-backend:latest