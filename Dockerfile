FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY . .

RUN ./gradlew clean bootJar --no-daemon

CMD ["sh", "-c", "java -Xmx350m -Xss256k -XX:MaxMetaspaceSize=100m -jar build/libs/*.jar"]

