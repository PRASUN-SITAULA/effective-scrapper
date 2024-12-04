# Dockerfile for frontend

FROM node:18-alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

# copy local files to app folder
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
