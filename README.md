# My New Nest App

A modern NestJS application with authentication, user management, and JWT-based security.

## Description

This is a production-ready NestJS application built with TypeScript featuring:

- **Authentication & Authorization**: Complete JWT-based authentication system with refresh tokens
- **User Management**: User registration, login, and profile management
- **Security**: Argon2 password hashing, JWT guards, and cookie-based session management
- **Database**: TypeORM integration with PostgreSQL support
- **Validation**: Class-validator for request validation
- **Testing**: Unit and e2e testing setup with Jest

## Features

### 🔐 Authentication
- Local authentication with username/password
- JWT access tokens and refresh tokens
- Passport strategies for multiple authentication methods
- Password hashing with Argon2
- Cookie-based session management
- Public routes decorator for bypassing authentication

### 👤 User Management
- User registration and login
- User entity with TypeORM
- User service for CRUD operations

### 🛡️ Security
- JWT guards for protecting routes
- Local authentication guard
- Custom decorators for public routes
- Cookie interceptor for secure token handling

### 🏗️ Architecture
- Modular architecture with separate auth and users modules
- DTOs for request validation
- TypeScript decorators and guards
- Clean separation of concerns

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Other
PORT=3000
```

## Project setup

```bash
# Clone the repository
$ git clone <your-repo-url>
$ cd my-new-nest-app

# Install dependencies
$ npm install
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with credentials
- `POST /auth/logout` - Logout and clear tokens
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/profile` - Get current user profile (protected)

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── interceptors/        # Cookie management interceptors
│   ├── strategies/          # Passport authentication strategies
│   ├── types/              # Type definitions for auth
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.module.ts       # Auth module configuration
│   └── *.guard.ts          # Authentication guards
├── users/                   # User management module
│   ├── user.entity.ts       # User database entity
│   ├── users.service.ts     # User business logic
│   └── users.module.ts      # Users module configuration
├── app.module.ts            # Root application module
└── main.ts                  # Application entry point
```

## Database Schema

### Users Table
- `id` - Primary key (UUID)
- `email` - Unique email address
- `password` - Hashed password (Argon2)
- `refreshTokenHash` - Hashed refresh token
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Development

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# watch mode for tests
$ npm run test:watch
```

## Code Quality

```bash
# lint code
$ npm run lint

# format code
$ npm run format

# build project
$ npm run build
```

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js with JWT
- **Password Hashing**: Argon2
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Linting**: ESLint with Prettier

## Security Features

- **Password Security**: Argon2 hashing algorithm
- **JWT Tokens**: Secure access and refresh token implementation
- **Guards**: Route protection with custom guards
- **Validation**: Input validation with class-validator
- **Environment Variables**: Sensitive data stored in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
