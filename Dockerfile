FROM node:16.14.2

ENV WDIR /process

RUN mkdir -p ${WDIR}

WORKDIR ${WDIR}

COPY . .

RUN  npm install --production --silent

RUN npm run build

CMD [ "npm","run", "start" ]
