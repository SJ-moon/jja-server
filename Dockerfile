# Stage 1 : install dependencies and build
FROM node:10 AS builder
COPY . .
RUN npm install
RUN npm run build

# Stage 2 : run
FROM node:10-alpine
EXPOSE 3000
COPY --from=builder . .
CMD ["npm", "run", "start"]