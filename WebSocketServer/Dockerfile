# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN  apt-get update && \
     apt-get install python3 make g++ &&\ 
     apt-get install -y build-essential &&\
     apt-get install -y libglew-dev &&\
     apt-get install -y libglu1-mesa-dev && \
     apt-get install -y libxi-dev && \
     apt-get install -y git && \
     apt-get install -y  pkg-config && \
     # npm install -g node-gyp && \
     npm install -g nodemon && \
     npm install -g prisma &&\
     npm install && \
     npx playwright install
 
    


# Copy the rest of the application files to the container
COPY . .

# ENV PORT = 8080
# Expose the port the app runs on
EXPOSE 4000

# Command to run your application
CMD ["node", "appWithWebSocket5.js"]

# CMD ["node", "app.js"]
# CMD ["npm", "start"]

#docker build -t my-express-app .

#docker run -p 3000:3000 -d my-express-app

