# Multi-stage build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY ../frontend/package*.json ./
RUN npm ci

COPY ../frontend/ ./
RUN npm run build:prod

# Java build stage
FROM eclipse-temurin:17-jdk-alpine AS backend-build

WORKDIR /app/backend
COPY gradle/ gradle/
COPY gradlew build.gradle settings.gradle ./
COPY src ./src/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/

RUN ./gradlew bootJar

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]