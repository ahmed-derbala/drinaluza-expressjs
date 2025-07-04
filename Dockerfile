FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm run i:prod
#RUN npm ci --only=production


# Bundle app source
COPY . .

EXPOSE 5001
CMD [ "npm", "run","start:prod" ]