FROM node:16.14.0-alpine
# RUN npm config set fetch-retry-maxtimeout 600000 -g
# RUN npm cache clean --force
# RUN npm config rm proxy
# RUN npm config rm https-proxy
# RUN npm cache verify
# RUN npm install -g npm@8.5.5
COPY . /src
WORKDIR /src
RUN npm install
CMD npm start