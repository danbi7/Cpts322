FROM gradle:8-jdk17 AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

COPY src src

RUN ./gradlew clean build -x test

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

ENV PORT=8080
EXPOSE $PORT

ENTRYPOINT ["java", "-jar", "app.jar"]
