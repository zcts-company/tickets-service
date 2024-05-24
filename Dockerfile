FROM node:18-alpine
ENV TZ="Europe/Moscow"

COPY ./build /build 
COPY ./package.json /package.json 
COPY ./package-lock.json /package-lock.json
RUN npm install  

CMD ["node", "build/app.js | npx pino-pretty"]