FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY . .

RUN ./gradlew clean bootJar --no-daemon

CMD ["sh", "-c", "java -jar build/libs/*.jar"]

