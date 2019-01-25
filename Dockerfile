FROM node
WORKDIR /src
ENTRYPOINT ["npm", "run", "start:prod"]
COPY . /src
RUN npm install
RUN npm run babel
