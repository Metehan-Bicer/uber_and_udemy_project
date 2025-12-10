using CourseMarket.Domain.Entities;
using CourseMarket.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Infrastructure.Data.Seeding;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if database is already seeded
        if (await context.Users.AnyAsync())
        {
            return;
        }

        // Create users with hashed passwords (using BCrypt)
        var admin = new User
        {
            Email = "admin@coursemarket.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            FirstName = "Admin",
            LastName = "User",
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var instructors = new List<User>
        {
            new User
            {
                Email = "john.instructor@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor123!"),
                FirstName = "John",
                LastName = "Smith",
                Role = UserRole.Instructor,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "jane.instructor@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor123!"),
                FirstName = "Jane",
                LastName = "Doe",
                Role = UserRole.Instructor,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "mike.instructor@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Instructor123!"),
                FirstName = "Mike",
                LastName = "Johnson",
                Role = UserRole.Instructor,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        var regularUsers = new List<User>
        {
            new User
            {
                Email = "alice@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Alice",
                LastName = "Brown",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "bob@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Bob",
                LastName = "Wilson",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "charlie@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Charlie",
                LastName = "Davis",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "diana@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Diana",
                LastName = "Martinez",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "eric@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Eric",
                LastName = "Anderson",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Email = "fiona@coursemarket.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Fiona",
                LastName = "Taylor",
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        // Add all users
        context.Users.Add(admin);
        context.Users.AddRange(instructors);
        context.Users.AddRange(regularUsers);
        await context.SaveChangesAsync();

        // Create courses
        var courses = new List<Course>
        {
            // John's courses (Web Development)
            new Course
            {
                Title = "React Fundamentals",
                Description = "Learn the basics of React including components, props, state, and hooks. Perfect for beginners.",
                Price = 49.99m,
                InstructorId = instructors[0].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=React+Fundamentals",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Advanced TypeScript",
                Description = "Master TypeScript with advanced types, generics, decorators, and design patterns.",
                Price = 79.99m,
                InstructorId = instructors[0].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Advanced+TypeScript",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Node.js Backend Development",
                Description = "Build scalable backend applications with Node.js, Express, and MongoDB.",
                Price = 69.99m,
                InstructorId = instructors[0].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Node.js+Backend",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Jane's courses (Data Science)
            new Course
            {
                Title = "Python for Data Analysis",
                Description = "Learn Python programming for data analysis with pandas, numpy, and matplotlib.",
                Price = 59.99m,
                InstructorId = instructors[1].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Python+Data+Analysis",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Machine Learning Basics",
                Description = "Introduction to machine learning algorithms, supervised and unsupervised learning.",
                Price = 89.99m,
                InstructorId = instructors[1].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Machine+Learning",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "SQL Masterclass",
                Description = "Complete SQL course covering queries, joins, subqueries, and database design.",
                Price = 39.99m,
                InstructorId = instructors[1].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=SQL+Masterclass",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Mike's courses (Design)
            new Course
            {
                Title = "UI/UX Design Principles",
                Description = "Learn the fundamental principles of user interface and user experience design.",
                Price = 54.99m,
                InstructorId = instructors[2].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=UI+UX+Design",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Figma Complete Guide",
                Description = "Master Figma for UI design, prototyping, and collaboration.",
                Price = 44.99m,
                InstructorId = instructors[2].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Figma+Guide",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Web Design with Tailwind CSS",
                Description = "Build beautiful, responsive websites with Tailwind CSS utility-first framework.",
                Price = 49.99m,
                InstructorId = instructors[2].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Tailwind+CSS",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Adobe Photoshop Basics",
                Description = "Learn photo editing, retouching, and graphic design with Adobe Photoshop.",
                Price = 34.99m,
                InstructorId = instructors[2].Id,
                ImageUrl = "https://via.placeholder.com/400x300?text=Photoshop+Basics",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Courses.AddRange(courses);
        await context.SaveChangesAsync();

        // Create sample purchases
        var purchases = new List<Purchase>
        {
            new Purchase
            {
                UserId = regularUsers[0].Id, // Alice
                CourseId = courses[0].Id, // React Fundamentals
                Amount = courses[0].Price,
                StripePaymentIntentId = "pi_demo_alice_react",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-5),
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Purchase
            {
                UserId = regularUsers[1].Id, // Bob
                CourseId = courses[3].Id, // Python for Data Analysis
                Amount = courses[3].Price,
                StripePaymentIntentId = "pi_demo_bob_python",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-3),
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Purchase
            {
                UserId = regularUsers[2].Id, // Charlie
                CourseId = courses[6].Id, // UI/UX Design Principles
                Amount = courses[6].Price,
                StripePaymentIntentId = "pi_demo_charlie_uiux",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-7),
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new Purchase
            {
                UserId = regularUsers[3].Id, // Diana
                CourseId = courses[0].Id, // React Fundamentals
                Amount = courses[0].Price,
                StripePaymentIntentId = "pi_demo_diana_react",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Purchase
            {
                UserId = regularUsers[3].Id, // Diana
                CourseId = courses[2].Id, // Node.js Backend Development
                Amount = courses[2].Price,
                StripePaymentIntentId = "pi_demo_diana_nodejs",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new Purchase
            {
                UserId = regularUsers[4].Id, // Eric
                CourseId = courses[4].Id, // Machine Learning Basics
                Amount = courses[4].Price,
                StripePaymentIntentId = "pi_demo_eric_ml",
                Status = PurchaseStatus.Completed,
                PurchasedAt = DateTime.UtcNow.AddDays(-4),
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-4)
            }
        };

        context.Purchases.AddRange(purchases);
        await context.SaveChangesAsync();

        // Create sample lesson requests
        var lessonRequests = new List<LiveLessonRequest>
        {
            new LiveLessonRequest
            {
                UserId = regularUsers[0].Id, // Alice
                Topic = "React Hooks",
                Description = "I need help understanding useEffect and custom hooks in React.",
                PreferredDate = DateTime.UtcNow.AddDays(2),
                Duration = 60,
                Status = RequestStatus.Assigned,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UpdatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new LiveLessonRequest
            {
                UserId = regularUsers[5].Id, // Fiona
                Topic = "Python Data Visualization",
                Description = "Need guidance on using matplotlib and seaborn for data visualization.",
                PreferredDate = DateTime.UtcNow.AddDays(3),
                Duration = 90,
                Status = RequestStatus.Pending,
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                UpdatedAt = DateTime.UtcNow.AddHours(-1)
            },
            new LiveLessonRequest
            {
                UserId = regularUsers[4].Id, // Eric
                Topic = "UX Portfolio Review",
                Description = "I would like feedback on my UX design portfolio and case studies.",
                PreferredDate = DateTime.UtcNow.AddDays(1),
                Duration = 60,
                Status = RequestStatus.Assigned,
                CreatedAt = DateTime.UtcNow.AddHours(-3),
                UpdatedAt = DateTime.UtcNow.AddHours(-3)
            }
        };

        context.LiveLessonRequests.AddRange(lessonRequests);
        await context.SaveChangesAsync();

        // Create instructor assignments for assigned lessons
        var assignments = new List<InstructorAssignment>
        {
            new InstructorAssignment
            {
                RequestId = lessonRequests[0].Id, // Alice's React request
                InstructorId = instructors[0].Id, // John (React instructor)
                AssignedAt = DateTime.UtcNow.AddHours(-2),
                MatchScore = 15.0, // High match (teaches React)
                Status = RequestStatus.Assigned,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UpdatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new InstructorAssignment
            {
                RequestId = lessonRequests[2].Id, // Eric's UX request
                InstructorId = instructors[2].Id, // Mike (UX instructor)
                AssignedAt = DateTime.UtcNow.AddHours(-3),
                MatchScore = 12.0, // High match (teaches UX)
                Status = RequestStatus.Assigned,
                CreatedAt = DateTime.UtcNow.AddHours(-3),
                UpdatedAt = DateTime.UtcNow.AddHours(-3)
            }
        };

        context.InstructorAssignments.AddRange(assignments);
        await context.SaveChangesAsync();

        // Create sample notifications
        var notifications = new List<Notification>
        {
            new Notification
            {
                UserId = instructors[0].Id, // John
                Type = NotificationType.LessonAssignment,
                Title = "New Lesson Assignment",
                Message = "You have been assigned to teach Alice Brown about React Hooks.",
                IsRead = false,
                RelatedEntityId = lessonRequests[0].Id,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                UpdatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new Notification
            {
                UserId = instructors[2].Id, // Mike
                Type = NotificationType.LessonAssignment,
                Title = "New Lesson Assignment",
                Message = "You have been assigned to review Eric Anderson's UX portfolio.",
                IsRead = false,
                RelatedEntityId = lessonRequests[2].Id,
                CreatedAt = DateTime.UtcNow.AddHours(-3),
                UpdatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new Notification
            {
                UserId = regularUsers[0].Id, // Alice
                Type = NotificationType.PurchaseConfirmation,
                Title = "Purchase Confirmed",
                Message = "Your purchase of 'React Fundamentals' has been confirmed!",
                IsRead = true,
                RelatedEntityId = purchases[0].Id,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.Notifications.AddRange(notifications);
        await context.SaveChangesAsync();
    }
}
