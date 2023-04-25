# 베이스 이미지
FROM node:18.16.0 AS build

# 애플리케이션 빌드를 위해 작업 디렉토리를 생성합니다.
WORKDIR /app

# package.json과 yarn.lock을 복사합니다.
COPY package*.json yarn.lock ./

# 패키지 설치를 위해 yarn을 실행합니다.
RUN yarn install

# 소스코드를 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN yarn build

# Nginx 이미지를 베이스 이미지로 변경합니다.
FROM nginx:latest

# Nginx 설정 파일을 복사합니다.
COPY nginx.conf /etc/nginx/nginx.conf

# 애플리케이션 빌드 결과물을 Nginx의 HTML 디렉토리에 복사합니다.
COPY --from=build /app/build /usr/share/nginx/html

# 컨테이너 외부에서 액세스할 수 있도록 포트를 오픈합니다.
EXPOSE 80

# Nginx를 실행합니다.
CMD ["nginx", "-g", "daemon off;"]
