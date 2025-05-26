# Event Buddy Backend API

[![Nest Logo](https://nestjs.com/img/logo-small.svg)](http://nestjs.com/)

## Description

Ensure you have installed NestJS

## Installation Commands

```bash
# Additional packages used
npm install @nestjs/swagger
npm i --save class-validator class-transformer
npm install --save @nestjs/typeorm typeorm pg
npm install bcrypt
npm install --save-dev @types/bcrypt
npm i @nestjs/config
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
npm i @nestjs/jwt passport-jwt
npm i -D @types/passport-jwt
npm i argon2
npm install --save-dev @types/express @types/multer
```

## Database Setup

```bash
# Create PostgreSQL database
CREATE DATABASE event_buddy;

# .env file
    # Database configuration
    db_host=localhost
    db_password=3639
    db_name=event_buddy
    db_port=5432
    db_user=postgres

    # JWT configuration for access token
    JWT_SECRET=63fe41dfa7bb8dd40f1b8b38700a1bb4fbaaa85c92be4f0e85061e7057962cdd
    JWT_EXPIRES_IN=20s

    # JWT configuration for refresh token
    JWT_REFRESH_SECRET=fbad649edd3a5e401032f594ffb69334e3d7ce092cd6240193c980a52d318e29
    JWT_REFRESH_EXPIRES_IN=7d
```

## Compile and run the project

```bash
# Clone the repository
git clone https://github.com/EHREkramul/Event-Buddy-API.git
cd Event-Buddy-API

# watch mode
npm run start:dev

# development
npm run start
```

## API Documentation

```bash
# View Swagger docs (Visit after starting the server)
http://localhost:46570/api
```
