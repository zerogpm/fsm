FROM node:20-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json* tsconfig.json ./
RUN npm install

# Copy source code
COPY . .

# Set the default command
CMD ["npm", "run", "dev"]