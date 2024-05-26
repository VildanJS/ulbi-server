FROM node:20

# App folder
WORKDIR /usr/src/app

# Packages install
COPY package*.json ./
RUN npm install
# For production use
# RUN npm install --production

# Copy project files
COPY . .

# Notify about listening port
EXPOSE 8080

# Project start
CMD ["node", "index.js"]