# CourseMarket - Mini Udemy + Uber Hybrid Platform

A demonstration project combining Udemy-style course marketplace with Uber-style instructor matching, built with **.NET 8 Web API** and **React 18**.

## Project Overview

CourseMarket is a hybrid learning platform that offers:

1. **Udemy Flow**: Browse courses, purchase with Stripe, access purchased content
2. **Uber Logic**: Request personalized live lessons with automatic instructor matching

### Key Features

- Three user roles (User, Instructor, Admin) with JWT authentication
- Course marketplace with search and pagination
- Secure payment processing with Stripe
- Intelligent instructor matching algorithm
- Live lesson request system
- Responsive React UI with Tailwind CSS
- Clean Architecture backend with CQRS pattern

---

## Technology Stack

### Backend
- .NET 8 Web API
- Entity Framework Core 8 + SQLite
- MediatR (CQRS pattern)
- JWT Bearer Authentication
- Stripe.net SDK
- BCrypt for password hashing
- Swagger/OpenAPI documentation

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Query (@tanstack/react-query)
- Zustand (state management)
- React Router v6
- Axios

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (optional, for webhook testing)

---

## Getting Started

### 1. Clone the Repository

```bash
cd /path/to/your/projects
# Project is already in: uber_and_udemy_project/
```

### 2. Backend Setup

#### Install Dependencies & Run Migrations

```bash
cd backend/src/CourseMarket.API
dotnet restore
dotnet ef database update
```

#### Configure Settings

The `appsettings.json` is already configured with:
- JWT Secret: `YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm`
- Stripe Test Keys: (Replace with your own from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys))

```json
{
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  }
}
```

#### Run the Backend

```bash
dotnet run
```

The API will be available at:
- **HTTP**: http://localhost:5032
- **Swagger**: http://localhost:5032/swagger

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5032/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Replace the Stripe publishable key with your own.

#### Run the Frontend

```bash
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173

---

## Test Credentials

The database is pre-seeded with test accounts:

### Admin Account
```
Email: admin@coursemarket.com
Password: Admin123!
```

### Instructor Accounts
```
Email: john.instructor@coursemarket.com
Password: Instructor123!
Role: Instructor (Web Development)

Email: jane.instructor@coursemarket.com
Password: Instructor123!
Role: Instructor (Data Science)

Email: mike.instructor@coursemarket.com
Password: Instructor123!
Role: Instructor (Design)
```

### User Accounts
```
Email: alice@coursemarket.com
Password: User123!
Role: User

Email: bob@coursemarket.com
Password: User123!
Role: User

... (4 more users: charlie, diana, eve, fiona)
```

---

## Stripe Test Cards

Use these test cards for payment testing:

| Card Number | Scenario | Expected Result |
|-------------|----------|-----------------|
| `4242 4242 4242 4242` | Success | Payment succeeds |
| `4000 0000 0000 0002` | Decline | Card declined |
| `4000 0025 0000 3155` | Auth Required | Requires 3D Secure |

**Expiry Date**: Any future date (e.g., 12/34)
**CVC**: Any 3 digits (e.g., 123)
**ZIP**: Any 5 digits (e.g., 12345)

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Courses

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/courses` | List all courses (paginated) | No | - |
| GET | `/api/courses/{id}` | Get course details | No | - |
| GET | `/api/courses/my-courses` | Get purchased courses | Yes | Any |
| POST | `/api/courses` | Create new course | Yes | Instructor/Admin |
| PUT | `/api/courses/{id}` | Update course | Yes | Instructor/Admin |

**Query Parameters for GET `/api/courses`:**
- `page` (default: 1)
- `pageSize` (default: 10)
- `search` (optional)

### Purchases

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/purchases/create-payment-intent` | Start purchase flow | Yes |
| POST | `/api/purchases/confirm` | Confirm and complete purchase | Yes |
| GET | `/api/purchases/my-purchases` | Get purchase history | Yes |

### Live Lessons

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/live-lessons/requests` | Create lesson request | Yes | User |
| GET | `/api/live-lessons/my-requests` | Get user's requests | Yes | User |
| GET | `/api/live-lessons/assigned` | Get assigned lessons | Yes | Instructor |
| PATCH | `/api/live-lessons/requests/{id}/status` | Update request status | Yes | Instructor/Admin |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get user's notifications | Yes |
| PATCH | `/api/notifications/{id}/read` | Mark notification as read | Yes |
| PATCH | `/api/notifications/mark-all-read` | Mark all as read | Yes |

### Webhooks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/webhooks/stripe` | Stripe webhook handler | No (signature validated) |

---

## Project Structure

```
uber_and_udemy_project/
├── backend/
│   ├── CourseMarket.sln
│   └── src/
│       ├── CourseMarket.Domain/          # Entities, Enums
│       ├── CourseMarket.Application/     # CQRS Commands/Queries
│       ├── CourseMarket.Infrastructure/  # DbContext, Services
│       └── CourseMarket.API/            # Controllers, Program.cs
└── frontend/
    ├── src/
    │   ├── api/           # Axios client + endpoints
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Route-level pages
    │   ├── store/         # Zustand stores
    │   ├── types/         # TypeScript interfaces
    │   └── App.tsx        # Router configuration
    ├── package.json
    └── vite.config.ts
```

---

## How It Works

### 1. Course Purchase Flow (Udemy Logic)

1. User browses courses at `/courses`
2. Clicks on course to view details at `/courses/{id}`
3. Clicks "Purchase Course" button
4. Backend creates Stripe PaymentIntent and returns `clientSecret`
5. Frontend shows Stripe checkout form (in demo: auto-confirms)
6. Payment succeeds → Backend verifies and creates Purchase record
7. Course is added to user's "My Courses"
8. Stripe webhook (async) validates and logs transaction

### 2. Live Lesson Matching (Uber Logic)

1. User navigates to `/live-lessons` and clicks "Request Live Lesson"
2. Fills out form: topic, description, preferred date, duration
3. Submits request → Backend triggers matching algorithm
4. **Matching Algorithm** scores all instructors:
   - Topic Relevance: +10 points if instructor teaches related courses
   - Availability: -2 points per active assignment
   - Random Factor: +0-5 for variety
5. Best instructor is automatically assigned
6. `InstructorAssignment` record created with match score
7. Notification sent to instructor
8. User sees assigned instructor on `/live-lessons`
9. Instructor sees assignment on `/instructor/dashboard`

---

## Testing the Application

### Test Scenario 1: Purchase a Course

1. Register new account or login with `alice@coursemarket.com / User123!`
2. Navigate to "Browse Courses"
3. Click on any course (e.g., "Complete React Masterclass")
4. Click "Purchase Course"
5. In demo mode: automatically confirms purchase
6. Navigate to "My Courses" to see purchased course

### Test Scenario 2: Request Live Lesson

1. Login as a user (e.g., `bob@coursemarket.com / User123!`)
2. Navigate to "Live Lessons"
3. Click "Request Live Lesson"
4. Fill in:
   - Topic: "Advanced TypeScript"
   - Description: "Need help understanding generics"
   - Preferred Date: Any future date/time
   - Duration: 60 minutes
5. Submit → System automatically matches best instructor
6. View assignment with instructor details and match score

### Test Scenario 3: Instructor Dashboard

1. Login as instructor (`john.instructor@coursemarket.com / Instructor123!`)
2. Navigate to "Instructor Dashboard"
3. View assigned live lesson requests
4. See match scores and student information

---

## Webhook Testing (Optional)

To test Stripe webhooks locally:

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:5032/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Update `appsettings.json` with the new `WebhookSecret`
6. Trigger test events:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

---

## Database Management

### View Database

```bash
# Install SQLite browser (optional)
# macOS: brew install --cask db-browser-for-sqlite
# Windows: Download from https://sqlitebrowser.org/

# Database file location
backend/src/CourseMarket.API/coursemarket.db
```

### Reset Database

```bash
cd backend/src/CourseMarket.API
rm -f coursemarket.db*
dotnet ef database update
```

This will:
1. Delete existing database
2. Re-run migrations
3. Re-seed test data

---

## Architecture

This project follows **Clean Architecture** principles. For detailed information about:

- Technology choices and rationale
- Payment flow diagrams
- Instructor matching algorithm
- Scalability strategy

See: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Key Architectural Patterns

### Backend
- **Clean Architecture**: Domain → Application → Infrastructure → API
- **CQRS**: Commands (writes) and Queries (reads) separated via MediatR
- **Repository Pattern**: EF Core DbContext as Unit of Work
- **Dependency Injection**: Built-in .NET DI container

### Frontend
- **Container/Presentational**: Smart components with hooks vs pure UI
- **Custom Hooks**: Encapsulate React Query logic
- **Protected Routes**: HOC pattern for authentication/authorization
- **Atomic Design**: Reusable UI components (Button, Input, Card)

---

## Common Issues & Solutions

### Issue: Backend port already in use

**Solution:**
```bash
# Change port in backend/src/CourseMarket.API/Properties/launchSettings.json
"applicationUrl": "http://localhost:YOUR_PORT"
```

### Issue: Database migration errors

**Solution:**
```bash
cd backend/src/CourseMarket.API
dotnet ef database drop --force
dotnet ef database update
```

### Issue: CORS errors in frontend

**Solution:**
- Ensure backend is running on http://localhost:5032
- Check that frontend `.env` has correct `VITE_API_URL`
- Verify CORS policy in `Program.cs` includes frontend origin

### Issue: Stripe payments not working

**Solution:**
- Use test card: `4242 4242 4242 4242`
- Verify Stripe keys in `appsettings.json` and `.env`
- Check browser console for errors
- Ensure using test mode keys (start with `pk_test_` and `sk_test_`)

---

## Performance Considerations

- **Pagination**: All list endpoints support page/pageSize
- **Database Indexes**: Foreign keys indexed for fast queries
- **React Query Caching**: 5-minute stale time reduces API calls
- **Code Splitting**: React Router lazy loading for routes

---

## Security Features

- **Password Hashing**: BCrypt with salt rounds
- **JWT Tokens**: 7-day expiration, role-based claims
- **Role-based Authorization**: `[Authorize(Roles = "Instructor,Admin")]`
- **Stripe Security**: PCI compliance via Stripe.js, webhook signature validation
- **SQL Injection Protection**: EF Core parameterizes all queries
- **XSS Protection**: React escapes output by default

---

## Future Enhancements

- [ ] Real-time notifications with SignalR
- [ ] Course reviews and ratings
- [ ] Video upload and streaming
- [ ] Instructor availability calendar
- [ ] Email notifications
- [ ] Admin dashboard with analytics
- [ ] Full Stripe checkout integration (not just PaymentIntent)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Deployment to Azure/AWS

---

## License

This is a demonstration project for educational purposes.

---

## Contact & Support

For issues or questions:
- Open an issue on the repository
- Review the [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

---

## Acknowledgments

Built with:
- [.NET 8](https://dotnet.microsoft.com/)
- [React 18](https://react.dev/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [MediatR](https://github.com/jbogard/MediatR)
- [React Query](https://tanstack.com/query/)

---

**Happy Coding!** 🚀
