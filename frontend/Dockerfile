FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i --legacy-peer-deps

COPY . ./
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]