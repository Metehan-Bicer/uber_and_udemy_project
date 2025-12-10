# CourseMarket - Architecture Document

## Project Overview
CourseMarket is a hybrid platform combining Udemy-style course marketplace with Uber-style instructor matching. Built with **.NET 8 Web API** backend and **React 18** frontend, demonstrating Clean Architecture, CQRS pattern, and sophisticated business logic.

---

## Technology Stack & Rationale

### Backend Technologies

| Technology | Rationale |
|-----------|-----------|
| **.NET 8 Web API** | Modern, high-performance framework with built-in DI, middleware pipeline, and excellent async support |
| **Clean Architecture** | Separation of concerns (Domain → Application → Infrastructure → API) for maintainability and testability |
| **Entity Framework Core 8** | Type-safe ORM with migrations, LINQ queries, and excellent SQLite/PostgreSQL support |
| **SQLite** | Zero-config embedded database perfect for demos; easy migration path to PostgreSQL for production |
| **MediatR** | CQRS implementation with clear separation between Commands (writes) and Queries (reads) |
| **JWT Bearer Auth** | Stateless authentication ideal for distributed systems; includes role claims for authorization |
| **Stripe API** | Industry-standard payment processing with test mode for development |
| **BCrypt.Net** | Secure password hashing with salt rounds for user credential protection |

### Frontend Technologies

| Technology | Rationale |
|-----------|-----------|
| **React 18 + TypeScript** | Type safety catches errors at compile-time; React 18 concurrent features improve UX |
| **Vite** | Lightning-fast dev server and build tool (10x faster than Create React App) |
| **Tailwind CSS** | Utility-first styling for rapid UI development without context switching |
| **React Query** | Server state management with caching, automatic refetching, and optimistic updates |
| **Zustand** | Lightweight client state management for auth (100x smaller than Redux) |
| **React Router v6** | Declarative routing with nested routes and protected route wrappers |
| **Axios** | HTTP client with interceptor support for automatic JWT token injection |

---

## Core Business Flows

### 1. Payment Flow (Udemy Logic)

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌──────────┐
│ User    │      │ Frontend│      │ Backend │      │  Stripe  │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬─────┘
     │                │                │                │
     │ 1. Click      │                │                │
     │  "Purchase"   │                │                │
     ├──────────────>│                │                │
     │                │ 2. POST        │                │
     │                │  /purchases/   │                │
     │                │  create-intent │                │
     │                ├───────────────>│ 3. Create      │
     │                │                │  PaymentIntent │
     │                │                ├───────────────>│
     │                │                │<───────────────┤
     │                │<───────────────┤ 4. Return      │
     │                │  clientSecret  │  clientSecret  │
     │                │                │                │
     │ 5. Stripe     │                │                │
     │  Checkout UI  │                │                │
     │<──────────────┤                │                │
     │                │                │                │
     │ 6. Enter Card │                │                │
     │  4242...      │                │                │
     ├──────────────>│ 7. Confirm     │                │
     │                │  Payment       │                │
     │                ├───────────────────────────────>│
     │                │                │<───────────────┤
     │                │ 8. POST        │ 9. Payment     │
     │                │  /purchases/   │  Succeeded     │
     │                │  confirm       │                │
     │                ├───────────────>│                │
     │                │                │ 10. Verify &   │
     │                │                │  Create Purchase│
     │                │<───────────────┤  Assign Course │
     │                │  Success       │                │
     │<──────────────┤                │                │
     │ 7. Redirect   │                │                │
     │  to My Courses│                │                │
     │                │                │<───────────────┤
     │                │                │ 11. Webhook    │
     │                │                │  (async logging)│
```

**Key Points:**
- **PaymentIntent API**: Creates payment intent on backend with course metadata
- **Client-side confirmation**: Frontend uses Stripe.js for PCI compliance
- **Backend verification**: Backend verifies payment status before granting access
- **Webhook handling**: Asynchronous webhook validates signature and logs events
- **Idempotency**: Webhook checks prevent duplicate processing

**Security Measures:**
- Payment metadata includes courseId/userId for verification
- Backend validates payment status before course assignment
- Stripe webhook signature validation prevents spoofing
- No sensitive card data touches our servers (PCI compliance)

---

### 2. Instructor Matching Algorithm (Uber Logic)

When a user creates a live lesson request, the system automatically assigns the best instructor using a scoring algorithm:

```csharp
public async Task<(int InstructorId, int MatchScore)> FindBestInstructorAsync(
    string topic, string description)
{
    var instructors = await GetAllInstructorsAsync();
    var instructorScores = new List<(int InstructorId, int Score)>();

    foreach (var instructor in instructors)
    {
        var score = 0;

        // 1. Topic Relevance (+10 points)
        // Check if instructor teaches courses related to the requested topic
        var hasRelatedCourse = await HasCourseWithTopic(instructor.Id, topic);
        if (hasRelatedCourse) score += 10;

        // 2. Availability (-2 points per active assignment)
        // Penalize instructors with many active assignments
        var activeAssignmentsCount = await GetActiveAssignmentsCount(instructor.Id);
        score -= (activeAssignmentsCount * 2);

        // 3. Random Factor (+0-5 points)
        // Adds variety and prevents always assigning the same instructor
        score += Random.Next(0, 6);

        instructorScores.Add((instructor.Id, score));
    }

    // Return instructor with highest score
    return instructorScores.OrderByDescending(x => x.Score).First();
}
```

**Scoring Breakdown:**

| Factor | Points | Purpose |
|--------|--------|---------|
| **Topic Relevance** | +10 | Prioritize instructors with expertise in the subject |
| **Availability** | -2 per active lesson | Distribute workload fairly across instructors |
| **Random Factor** | +0 to +5 | Prevent always selecting the same instructor, add variety |

**Example Scenario:**
- User requests lesson on "React Hooks"
- Instructor A: Teaches React course (+10), has 2 active lessons (-4), random +3 = **Score: 9**
- Instructor B: No React course (+0), has 0 active lessons (-0), random +5 = **Score: 5**
- Instructor C: Teaches React course (+10), has 1 active lesson (-2), random +2 = **Score: 10** ✓ **Selected**

**Flow:**
1. User submits `CreateLessonRequestCommand` with topic, description, date, duration
2. Handler calls `InstructorMatchingService.FindBestInstructorAsync()`
3. Algorithm scores all instructors and selects highest
4. System creates `InstructorAssignment` record with match score
5. Notification sent to assigned instructor
6. User sees assigned instructor with match score explanation

---

## Architecture Patterns

### Backend - Clean Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CourseMarket.API                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Controllers, Middleware, Program.cs, Swagger           │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ Depends on
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 CourseMarket.Application                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Commands, Queries, Handlers, DTOs, Validators          │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ Depends on
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               CourseMarket.Infrastructure                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ DbContext, Services, Migrations, Seeding               │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ Depends on
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CourseMarket.Domain                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Entities, Enums, Exceptions (NO DEPENDENCIES)          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Principles:**
- Domain layer has zero dependencies (pure business objects)
- Application layer contains business logic (CQRS with MediatR)
- Infrastructure layer implements interfaces from Application
- API layer is thin orchestration layer

### Frontend - Component Architecture

```
src/
├── api/              # Axios client + endpoint functions
├── components/
│   ├── auth/        # ProtectedRoute
│   ├── layout/      # Navbar, Layout
│   └── ui/          # Button, Input, Card (reusable)
├── pages/           # Route-level components
├── store/           # Zustand stores (auth)
├── types/           # TypeScript interfaces
└── App.tsx          # Router configuration
```

**Patterns:**
- **Container/Presentational**: Smart components (hooks) vs UI components
- **Custom Hooks**: Encapsulate React Query logic (`useCourses`, `usePurchase`)
- **Protected Routes**: HOC pattern for authentication/authorization
- **Composition**: Small, reusable components over large monoliths

---

## Scalability Strategy

### Current Architecture (Demo)
- **Single Server**: Runs on localhost
- **SQLite**: Embedded file-based database
- **Synchronous Processing**: All operations handled in request cycle
- **No Caching**: Fresh data on every request

**Suitable for:** 1-100 users, development/testing environments

### Phase 1: Small Production (100-1K users)

| Component | Change | Rationale |
|-----------|--------|-----------|
| **Database** | SQLite → PostgreSQL | Better concurrency, ACID compliance, full-text search |
| **Hosting** | Single Azure App Service | Managed platform, automatic SSL, easy deployment |
| **Caching** | Add Redis | Cache course catalog, reduce DB load by 70% |
| **CDN** | Azure CDN for images | Offload static assets, improve global latency |
| **Logging** | Add Application Insights | Monitor performance, track errors |

**Estimated Cost:** $50-100/month

### Phase 2: Medium Scale (1K-10K users)

| Component | Change | Rationale |
|-----------|--------|-----------|
| **Load Balancer** | Azure Load Balancer | Distribute traffic across 2-3 API servers |
| **Database** | Read Replicas | Separate read/write traffic, use replicas for queries |
| **Background Jobs** | Azure Functions | Process webhooks, notifications, email async |
| **File Storage** | Azure Blob Storage | Store course images, videos separately |
| **Search** | Azure Cognitive Search | Full-text search across courses |

**Estimated Cost:** $200-500/month

### Phase 3: Large Scale (10K-100K+ users)

| Component | Change | Rationale |
|-----------|--------|-----------|
| **Microservices** | Split into services | Courses, Payments, Matching as separate services |
| **Message Queue** | Azure Service Bus | Event-driven architecture, decouple services |
| **Database Sharding** | Partition by user region | Distribute data across multiple databases |
| **API Gateway** | Azure API Management | Rate limiting, authentication, routing |
| **Auto-scaling** | Kubernetes (AKS) | Dynamic scaling based on load |
| **Real-time** | SignalR for notifications | WebSocket connections for live updates |

**Estimated Cost:** $1,000-5,000/month

### Database Migration Path

**Current (SQLite):**
```csharp
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
```

**Future (PostgreSQL):**
```csharp
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
```

**No code changes needed** - EF Core abstracts database provider!

---

## Security Considerations

| Layer | Implementation |
|-------|----------------|
| **Authentication** | JWT tokens with 7-day expiration, BCrypt password hashing |
| **Authorization** | Role-based access control (User, Instructor, Admin) |
| **API Security** | HTTPS only, CORS whitelist, rate limiting (future) |
| **Payment Security** | Stripe handles PCI compliance, webhook signature validation |
| **SQL Injection** | EF Core parameterizes all queries automatically |
| **XSS Protection** | React escapes output by default |

---

## Performance Optimizations

### Current Implementation
- **Database Indexes**: Foreign keys, UserId, CourseId, RequestStatus
- **Pagination**: All list endpoints support page/pageSize
- **React Query Caching**: 5-minute stale time for course catalog
- **Lazy Loading**: React Router code-splitting for routes

### Future Optimizations
- **Database Connection Pooling**: Reuse connections (built-in with EF Core)
- **Response Compression**: Gzip API responses
- **Image Optimization**: WebP format, lazy loading
- **Query Optimization**: Eager loading with `.Include()` to prevent N+1 queries

---

## Testing Strategy (Future Implementation)

### Backend
- **Unit Tests**: Business logic in Application layer (MediatR handlers)
- **Integration Tests**: Test controllers with in-memory database
- **E2E Tests**: Stripe test mode with webhook simulation

### Frontend
- **Component Tests**: React Testing Library for UI components
- **Integration Tests**: Test user flows with Mock Service Worker
- **E2E Tests**: Playwright for critical paths (purchase, lesson request)

---

## Conclusion

CourseMarket demonstrates a **production-ready architecture** with:
- ✅ Clean separation of concerns (Clean Architecture)
- ✅ Scalable patterns (CQRS, event-driven webhooks)
- ✅ Type safety (TypeScript, C# with nullable reference types)
- ✅ Modern best practices (React 18, .NET 8, JWT auth)
- ✅ Clear migration path from demo to production

The hybrid business model (Udemy + Uber) showcases sophisticated logic while maintaining code simplicity through proper abstraction layers.
