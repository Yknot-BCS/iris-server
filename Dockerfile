FROM node:8
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
EXPOSE 8800
#RUN nohup node iris/IrisServer.js >> iris-server.log 2>&1 &
CMD ["node", "iris/IrisServer.js"]
#docker run --rm -t -d -p 3000:3000 -p 8800:8800 --name iris-server iris-server:v1