# Use the official Node.js image.
FROM node:18

# Create and set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application files.
COPY . .

# Build the application.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 3000

# Start the application.
CMD ["npm", "run", "start"]
