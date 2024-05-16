FROM node:18-alpine
# ARG NODE_ENV=production 
# ENV NODE_ENV $NODE_ENV

COPY ./build /build 
COPY ./package.json /package.json 
COPY ./package-lock.json /package-lock.json
RUN npm install 
# RUN NODE_ENV=$NODE_ENV npm install 
CMD ["node", "build/app.js"]