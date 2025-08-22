# Multi-stage build
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend
COPY ../frontend/package*.json ./
RUN npm ci

COPY ../frontend/ ./
RUN npm run build:prod

# Java build stage
FROM openjdk:17-jdk-slim as backend-build

WORKDIR /app/backend
COPY backend/gradle/ gradle/
COPY backend/gradlew backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/

RUN ./gradlew bootJar

# Runtime stage
FROM openjdk:17-jre-slim

WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]