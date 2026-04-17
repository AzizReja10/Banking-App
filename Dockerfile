# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compile the app, skipping tests to speed up the build
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Explicitly limit JVM memory to fit inside Render's 512MB free tier
ENTRYPOINT ["java", "-Xmx256m", "-Xms256m", "-jar", "app.jar"]