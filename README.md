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
