# Base image
FROM node:lts

# Create a directory for the application
WORKDIR /usr/src/app

# Install global packages
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the application
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]