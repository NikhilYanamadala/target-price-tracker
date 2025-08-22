# Multi-stage build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build -- --output-path=../backend/src/main/resources/static

# Java build stage
FROM eclipse-temurin:17-jdk-alpine AS backend-build

WORKDIR /app/backend
COPY backend/gradle/ gradle/
COPY backend/gradlew backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/backend/src/main/resources/static ./src/main/resources/static/

RUN chmod +x ./gradlew && ./gradlew bootJar

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]