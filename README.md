# target-price-tracker
To track the target prices

# For local development with hot reload
# Terminal 1 - Backend
cd backend && ./gradlew bootRun

# Terminal 2 - Frontend  
cd frontend && ng serve

# For local bundled testing
# Option 1: Build frontend manually, then backend
cd frontend && npm run build:backend
cd backend && ./gradlew bootJar
java -jar build/libs/*.jar

# Option 2: Use the optional Gradle task (if npm available)
cd backend && ./gradlew buildFrontendLocal bootJar
java -jar build/libs/*.jar

# Clean and rebuild everything
cd backend && ./gradlew clean
cd frontend && rm -rf dist
cd frontend && npm run build:backend
cd backend && ./gradlew bootJar