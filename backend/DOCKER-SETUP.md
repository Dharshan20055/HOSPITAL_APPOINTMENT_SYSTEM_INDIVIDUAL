# Docker Setup for Hospital Appointment System Backend

## Files Created

1. **Dockerfile** - Multi-stage build configuration for production-ready image
2. **.dockerignore** - Excludes unnecessary files from Docker build context
3. **docker-compose.yml** - Container orchestration for local development

## Building and Running

### Using Docker Compose (Recommended for local development)
```bash
# Build and start the service
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the service
docker-compose down

# View logs
docker-compose logs -f hospital-backend
```

### Using Docker CLI

#### Build the image
```bash
docker build -t hospital-backend:latest .
```

#### Run the container
```bash
docker run -d \
  --name hospital-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  hospital-backend:latest
```

#### View logs
```bash
docker logs -f hospital-backend
```

#### Stop the container
```bash
docker stop hospital-backend
docker rm hospital-backend
```

## Accessing the Application

- **API Base URL**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## Image Details

- **Base Image**: eclipse-temurin:17-jre-alpine (lightweight Java runtime)
- **Build Image**: maven:3.9.6-eclipse-temurin-17 (for compilation)
- **Default Port**: 8080
- **Health Check**: Enabled (checks `/actuator/health` endpoint every 30 seconds)

## Environment Variables

You can customize the following environment variables:

- `SPRING_PROFILES_ACTIVE` - Spring active profile (default: docker)
- `SERVER_PORT` - Application port (default: 8080)
- `JAVA_OPTS` - JVM options for memory and performance tuning

## Notes

- The Dockerfile uses a multi-stage build to minimize the final image size
- Alpine Linux is used for the runtime image to keep it lightweight
- The container automatically restarts unless stopped manually
- H2 database is configured within the application and doesn't require external setup
