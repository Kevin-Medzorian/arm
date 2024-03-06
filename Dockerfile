# Use the official Node.js image as the base image
# FROM node:18

# Set the working directory in the container
# WORKDIR /app

# Copy the application files into the working directory
# COPY . /app

# Install the application dependencies
# RUN npm install

# Open Port 5000
# EXPOSE 5000/tcp

# Define the entry point for the container
# CMD ["npm", "start"]

FROM node:20
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "server.js" ]