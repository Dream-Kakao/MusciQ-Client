#FROM node:18.16.0 AS build
FROM node:16-alpine AS build

# 경로 설정하기
WORKDIR /app

# package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
COPY package.json .

# image layer 에 의존성을 설치
RUN yarn install

# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사
COPY . .

# 3000번 포트 노출
EXPOSE 3000

# build 폴더를 serve합니다.
CMD ["yarn", "start"]