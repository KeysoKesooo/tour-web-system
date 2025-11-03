# 🔐 Next.js Authentication Boilerplate

A **production-ready, reusable authentication backend** with role-based access control (RBAC). Clone this as the backbone for any Next.js project that needs secure user authentication.

## 🎯 Purpose

This is a **starter template** / **boilerplate** for Next.js projects that need:

- User registration, login, and logout
- Role-based access control (Admin, Staff, User)
- Secure session management
- Edge Runtime compatibility

**Clone this → Build your app on top → Ship fast! 🚀**

---

## ✨ What You Get

✅ **Complete Auth System** - Register, Login, Logout with sessions  
✅ **Role-Based Access Control** - 3 roles: Admin, Staff, User  
✅ **Edge Runtime Compatible** - Works with Next.js middleware  
✅ **OOP Architecture** - Clean Services, Repositories, Models pattern  
✅ **Type-Safe** - Full TypeScript + Zod validation  
✅ **Secure by Default** - Bcrypt hashing, no role selection in registration  
✅ **Production Ready** - Error handling, proper validation, security best practices  
✅ **Easy to Extend** - Add your own routes, models, and features

---

## 📁 Project Structure

```
your-app/
├── prisma/
│   ├── schema.prisma              # Database models (User, Session)
│   ├── seed.js                    # Creates initial admin user
│   └── migrations/                # Auto-generated migrations
│
├── src/
│   ├── middleware.js              # 🔒 Auth protection (Edge-compatible)
│   │
│   ├── lib/
│   │   ├── auth.ts                # Lucia auth configuration
│   │   ├── authUtils.ts           # 🔑 Helper: getAuthenticatedUser(), hasRole()
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── roles.ts               # RoleManager class
│   │
│   ├── models/
│   │   └── user.model.ts          # UserModel with helper methods
│   │
│   ├── repositories/
│   │   └── UserRepository.ts      # All database operations for User
│   │
│   ├── services/
│   │   ├── AuthService.ts         # 🔐 register(), login(), logout()
│   │   └── UserService.ts         # User CRUD operations
│   │
│   ├── dto/
│   │   ├── auth.dto.ts            # RegisterDTO, LoginDTO (Zod)
│   │   └── user.dto.ts            # CreateUserDTO, UpdateUserDTO
│   │
│   ├── types/
│   │   └── RoleAction.ts          # Role type definitions
│   │
│   └── app/api/
│       ├── auth/
│       │   ├── register/route.ts  # ✅ POST - Public registration
│       │   ├── login/route.ts     # ✅ POST - Public login
│       │   └── logout/route.ts    # ✅ POST - Protected logout
│       │
│       ├── users/                 # 👤 User management (Admin only)
│       │   ├── route.ts           # GET (list), POST (create)
│       │   └── [id]/route.ts      # GET, PUT, DELETE by ID
│       │
│       └── [your-features]/       # 🎨 ADD YOUR OWN ROUTES HERE
│
├── .env.example                   # Example environment variables
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone this repository

```bash
git clone <your-repo-url> my-new-project
cd my-new-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/myapp?schema=public"
NODE_ENV="development"
```

### 4. Setup database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed admin user
npx prisma db seed
```

**Default Login Credentials:**

- **Admin:** `admin@clinic.com` / `admin123`
- **Staff:** `staff@clinic.com` / `staff123`

### 5. Start development

```bash
npm run dev
```

🎉 **Done!** Your auth backend is running on `http://localhost:3000`

---

## 🧪 Test the API

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

### Access protected route

```bash
curl -X GET http://localhost:3000/api/users \
  -b cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

---

## 📋 Available API Endpoints

### 🔓 Public Routes

| Method | Endpoint             | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| POST   | `/api/auth/register` | Register new user (auto-assigned 'staff' role) |
| POST   | `/api/auth/login`    | Login and get session cookie                   |

### 🔒 Protected Routes

| Method | Endpoint           | Access | Description                    |
| ------ | ------------------ | ------ | ------------------------------ |
| POST   | `/api/auth/logout` | All    | Logout and clear session       |
| GET    | `/api/users`       | Admin  | List all users                 |
| POST   | `/api/users`       | Admin  | Create user with specific role |
| GET    | `/api/users/[id]`  | Admin  | Get user by ID                 |
| PUT    | `/api/users/[id]`  | Admin  | Update user                    |
| DELETE | `/api/users/[id]`  | Admin  | Delete user                    |

---

## 🎨 How to Add Your Own Features

### 1. Create a new route (e.g., `/api/posts`)

**File:** `src/app/api/posts/route.ts`

```typescript
import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  hasRole,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/authUtils";

// GET /api/posts - All authenticated users
export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  // Your logic here
  const posts = [];
  return Response.json({ posts });
}

// POST /api/posts - Admin and Staff only
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin", "staff"])) {
    return forbiddenResponse("Access denied");
  }

  const body = await req.json();
  // Your logic here
  return Response.json({ message: "Post created" }, { status: 201 });
}
```

### 2. Add route to middleware protection

**File:** `src/middleware.js`

```javascript
export const config = {
  matcher: [
    "/api/users/:path*",
    "/api/posts/:path*", // ✅ Add your route here
    // ... other protected routes
  ],
};
```

### 3. Create your models, services, repositories

Follow the same OOP pattern:

```
src/
├── models/
│   └── post.model.ts          # PostModel class
├── repositories/
│   └── PostRepository.ts      # Database operations
├── services/
│   └── PostService.ts         # Business logic
└── dto/
    └── post.dto.ts            # Validation schemas
```

---

## 🔐 Security Features

### 1. **No Role Selection During Registration**

Users cannot choose their role. All new registrations get `staff` role by default (defined in Prisma schema). Only admins can create users with specific roles.

### 2. **Session Validation in Routes (Not Middleware)**

Middleware only checks if a token exists. Full validation with Prisma happens in API routes (Node.js runtime, not Edge).

### 3. **Password Hashing**

All passwords hashed with bcrypt (10 rounds) before storage.

### 4. **Type-Safe Validation**

Zod schemas validate all inputs before processing.

### 5. **Session Expiry**

Sessions expire after 7 days (configurable in `src/lib/auth.ts`).

---

## 🛡️ Role-Based Access Control

Three built-in roles:

| Role      | Description        | Can Access                        |
| --------- | ------------------ | --------------------------------- |
| **admin** | Full system access | Everything                        |
| **staff** | Standard user      | Auth endpoints + shared resources |
| **user**  | Limited access     | Auth endpoints only               |

**Change roles in `prisma/schema.prisma` if needed:**

```prisma
model User {
  role String @default("staff")  // Change default here
}
```

---

## 🔧 Tech Stack

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| **Next.js 15** | React framework (App Router) |
| **TypeScript** | Type safety                  |
| **Prisma**     | Database ORM                 |
| **PostgreSQL** | Database                     |
| **Lucia Auth** | Session management           |
| **Zod**        | Schema validation            |
| **Bcrypt**     | Password hashing             |

---

## 🗄️ Database Schema

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  role      String    @default("staff")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  Session   Session[]
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**To add more fields:**

```bash
# Edit prisma/schema.prisma, then:
npx prisma migrate dev --name add_user_fields
```

---

## 📦 Customization Guide

### Change Default Role

**File:** `prisma/schema.prisma`

```prisma
role String @default("user")  // Change "staff" to "user"
```

### Change Session Expiry

**File:** `src/lib/auth.ts`

```typescript
sessionExpiresIn: new TimeSpan(30, "d"),  // 30 days instead of 7
```

### Add New Roles

1. Update type: `src/types/RoleAction.ts`

```typescript
export type Role = "admin" | "staff" | "user" | "moderator";
```

2. Update RoleManager: `src/lib/roles.ts`

```typescript
isModerator() {
  return this.role === "moderator";
}
```

3. Update DTOs: `src/dto/user.dto.ts`

```typescript
role: z.enum(["admin", "staff", "user", "moderator"]);
```

### Change Database

Currently uses PostgreSQL. To use MySQL:

**File:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

### "PrismaClient is not configured to run in Edge Runtime"

✅ **Fixed!** This boilerplate uses route-based validation. Middleware doesn't call Prisma.

### Seed fails

Check `package.json`:

```json
{
  "type": "module",
  "prisma": {
    "seed": "node ./prisma/seed.js"
  }
}
```

### Unauthorized on all routes

- Clear cookies and login again
- Check if `auth_session` cookie is set in browser DevTools
- Restart dev server

### TypeScript errors

```bash
npx prisma generate  # Regenerate Prisma types
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma migrate dev   # Create migration
npx prisma migrate reset # Reset database
npx prisma db seed       # Seed admin user
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma Client

# Linting
npm run lint             # Run ESLint
```

---

## 🚢 Deployment Checklist

- [ ] Change default admin password in `prisma/seed.js`
- [ ] Set `NODE_ENV=production` in environment
- [ ] Use production database URL
- [ ] Enable secure cookies (`secure: true` in production)
- [ ] Set up database backups
- [ ] Add rate limiting to auth endpoints
- [ ] Configure CORS for your frontend domain
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Add health check endpoint
- [ ] Enable database connection pooling

---

## 🎯 Use Cases

Perfect starting point for:

- 🏥 **Healthcare Apps** - Patient management systems
- 📚 **E-Learning Platforms** - Student/teacher management
- 🏪 **E-Commerce** - Customer/admin dashboards
- 📝 **CMS** - Content management systems
- 💼 **SaaS Apps** - Multi-tenant applications
- 🏢 **Internal Tools** - Company admin panels
- 📊 **Analytics Platforms** - User/organization management

---

## 🔄 Version History

**v1.0.0** - Initial release

- ✅ User authentication (register, login, logout)
- ✅ Role-based access control
- ✅ Edge Runtime compatible
- ✅ OOP architecture
- ✅ TypeScript + Zod validation

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Lucia Auth](https://lucia-auth.com/)
- [Zod Docs](https://zod.dev/)

---

## 📄 License

MIT License - Use this however you want!

---

## 🤝 Contributing

Found a bug or want to improve this boilerplate?

1. Fork the repo
2. Create a branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 💡 Tips

- Keep this repo as a clean template - don't mix it with project-specific code
- When starting a new project, clone this and immediately change:
  - Project name in `package.json`
  - Database name in `.env`
  - Admin credentials in `seed.js`
- Tag stable versions so you can always roll back to a working base

---

## ⭐ Star This Repo

If this boilerplate saves you time, give it a star! ⭐

---

**Happy Building! 🚀**

---

## 🎓 Example Projects Built with This

Share your project built with this boilerplate:

- Your project here...
- Submit a PR to add yours!

---

_This is a backend-only boilerplate. Add your own frontend (React, Vue, Mobile app, etc.)_
