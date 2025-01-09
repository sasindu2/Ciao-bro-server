FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
COPY .env /app
CMD ["npm","run","server"]