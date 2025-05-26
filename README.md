<h1 align="center">Event Buddy Backend API</h1>
<h4 align="center">Event management system</h4>

## Description

Backend system of a simplified event booking system called Event Buddy. The system provided RESTful APIs for all core functionalities, including event listing, event details, seat booking, authentication, and admin event management.

## Installation Commands
Ensure you have installed NestJS
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
    JWT_EXPIRES_IN=1h

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

## Folder Structure

```bash
ehrekramul-event-buddy-api/
├── README.md
├── public/
│   └── uploads/
│       └── event-images/
└── src/
    ├── app.module.ts
    ├── app.controller.ts
    ├── app.service.ts
    ├── main.ts
    ├── admin/
    │   └── events/
    │       ├── events.controller.ts
    │       ├── events.module.ts
    │       ├── events.service.ts
    │       └── dto/
    │           ├── create-event.dto.ts
    │           ├── event-response.dto.ts
    │           └── update-event.dto.ts
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── config/
    │   │   ├── db.config.ts
    │   │   ├── jwt.config.ts
    │   │   └── refresh-jwt.config.ts
    │   ├── decorators/
    │   │   ├── public.decorator.ts
    │   │   └── roles.decorator.ts
    │   ├── dto/
    │   │   ├── login-request.dto.ts
    │   │   ├── login-response.dto.ts
    │   │   └── refresh-token-response.dto.ts
    │   ├── enums/
    │   │   └── user-role.enum.ts
    │   ├── guards/
    │   │   ├── jwt-auth/
    │   │   │   ├── jwt-auth.guard.spec.ts
    │   │   │   └── jwt-auth.guard.ts
    │   │   ├── local-auth/
    │   │   │   ├── local-auth.guard.spec.ts
    │   │   │   └── local-auth.guard.ts
    │   │   ├── refresh-auth/
    │   │   │   ├── refresh-auth.guard.spec.ts
    │   │   │   └── refresh-auth.guard.ts
    │   │   └── roles/
    │   │       └── roles.guard.ts
    │   ├── strategies/
    │   │   ├── jwt.strategy.ts
    │   │   ├── local.strategy.ts
    │   │   └── refresh.strategy.ts
    │   └── types/
    │       ├── auth-jwt-payload.d.ts
    │       └── current-user.d.ts
    ├── entities/
    │   ├── booking.entity.ts
    │   ├── event.entity.ts
    │   └── user.entity.ts
    ├── events/
    │   └── public-events/
    │       ├── public-events.controller.ts
    │       ├── public-events.module.ts
    │       ├── public-events.service.ts
    │       └── dto/
    │           ├── individual-event-response.dto.ts
    │           └── search-event.dto.ts
    └── user/
        ├── user.controller.ts
        ├── user.module.ts
        ├── user.service.ts
        ├── dto/
        │   ├── create-user.dto.ts
        │   └── user-response.dto.ts
        └── user-bookings/
            ├── user-bookings.controller.ts
            ├── user-bookings.module.ts
            ├── user-bookings.service.ts
            └── dto/
                └── book-event.dto.ts

```
