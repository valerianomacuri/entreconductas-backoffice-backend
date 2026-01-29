# Entreconductas Backend

A production-ready NestJS backend application for Entreconductas backoffice management.

## 🚀 Features

- **Monolithic HTTP-only NestJS App** - Clean, scalable architecture
- **MongoDB Integration** - Using Mongoose for data persistence
- **User Management** - Full CRUD operations with role-based access
- **Password Security** - Automatic hashing with bcrypt
- **API Documentation** - Swagger/OpenAPI documentation at `/api-docs`
- **TypeScript** - Full type safety
- **Docker Support** - Ready for containerized deployment
- **Data Seeding** - Initial admin user creation
- **Validation** - Using class-validator and class-transformer

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root application module
├── config/
│   └── database.config.ts  # MongoDB configuration
├── users/
│   ├── dto/                # Data Transfer Objects
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/           # Mongoose schemas
│   │   └── user.entity.ts
│   ├── users.controller.ts # REST endpoints
│   ├── users.service.ts    # Business logic
│   ├── users.repository.ts # Data access layer
│   └── users.module.ts     # Users module configuration
└── shared/
    └── utils/              # Shared utilities
        └── password.utils.ts
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (or use Docker)
- npm or yarn

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB (if not using Docker):**

   ```bash
   mongod
   ```

4. **Run the application:**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

5. **Seed initial data:**
   ```bash
   npm run seed
   ```

### Docker Setup

1. **Build and run with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api-docs

## 📚 API Documentation

The application provides automatic Swagger documentation at `/api-docs`.

### Users Endpoints

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/users`     | Get all users   |
| GET    | `/users/:id` | Get user by ID  |
| POST   | `/users`     | Create new user |
| PATCH  | `/users/:id` | Update user     |
| DELETE | `/users/:id` | Delete user     |

### Default Users (after seeding)

- **Admin:** `admin@entreconductas.com` / `admin123`
- **Manager:** `manager@entreconductas.com` / `manager123`

## 🔧 Environment Variables

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/entreconductas
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode

# Production
npm run build             # Build the application
npm run start:prod        # Start production build

# Testing
npm run test              # Run unit tests
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Database
npm run seed              # Seed database with initial data
```

## 🏗️ Architecture

### Layered Architecture

1. **Controller Layer** - Handles HTTP requests and responses
2. **Service Layer** - Contains business logic and orchestrates data flow
3. **Repository Layer** - Manages data persistence and database operations
4. **Entity Layer** - Defines data models and schemas

### Key Features

- **Separation of Concerns:** Each layer has a specific responsibility
- **Dependency Injection:** Uses NestJS DI container for loose coupling
- **Error Handling:** Centralized error handling with proper HTTP status codes
- **Logging:** Integrated logging for debugging and monitoring
- **Validation:** Input validation using class-validator decorators

## 🔐 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- Input validation and sanitization
- CORS configuration
- Environment-based configuration

## 🐳 Docker Configuration

The application includes Docker support with:

- **Multi-stage Dockerfile** for optimized production builds
- **Docker Compose** with MongoDB integration
- **Environment variables** configuration
- **Health checks** and restart policies

## 📝 User Entity Schema

```typescript
{
  id: string; // MongoDB ObjectId
  name: string; // User full name
  email: string; // Unique email address
  password: string; // Hashed password
  role: 'admin' | 'manager'; // User role
  isActive: boolean; // Account status
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

## 🔄 Development Workflow

1. **Make changes** to source code
2. **Run tests:** `npm run test`
3. **Lint code:** `npm run lint`
4. **Build application:** `npm run build`
5. **Test locally:** `npm run start:dev`

## 📄 License

This project is proprietary and confidential.
