import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16 mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Welcome to CourseMarket
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A hybrid platform combining Udemy-style course marketplace with Uber-style
            instructor matching for personalized live lessons.
          </p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/courses">
                  <Button>Browse Courses</Button>
                </Link>
                <Link to="/live-lessons">
                  <Button variant="secondary">Request Live Lesson</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Udemy Flow */}
            <Card className="border-2 border-blue-200">
              <CardBody>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Course Marketplace</h3>
                  <p className="text-gray-600 mb-4">Udemy-style Learning</p>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Browse hundreds of courses across various topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Purchase courses with secure Stripe payment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Access your purchased courses anytime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Learn at your own pace with recorded content</span>
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Uber Flow */}
            <Card className="border-2 border-green-200">
              <CardBody>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Smart Matching</h3>
                  <p className="text-gray-600 mb-4">Uber-style Instructor Assignment</p>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Request personalized live lessons on any topic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>AI algorithm matches you with the best instructor</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Matching considers expertise, availability, and topic relevance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Get instant instructor assignment notifications</span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600 mb-2">10+</p>
              <p className="text-gray-700 font-medium">Active Courses</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">3</p>
              <p className="text-gray-700 font-medium">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">6+</p>
              <p className="text-gray-700 font-medium">Happy Students</p>
            </div>
          </div>
        </div>

        {/* User Roles Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardBody className="text-center">
                <div className="text-5xl mb-4">👤</div>
                <h3 className="text-xl font-bold mb-2">Student</h3>
                <p className="text-gray-600 mb-4">
                  Browse and purchase courses. Request personalized live lessons.
                </p>
                {!isAuthenticated && (
                  <Link to="/register">
                    <Button variant="secondary" className="w-full">
                      Register as Student
                    </Button>
                  </Link>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-5xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-bold mb-2">Instructor</h3>
                <p className="text-gray-600 mb-4">
                  Create courses, teach students, and receive live lesson assignments.
                </p>
                {!isAuthenticated && (
                  <Link to="/register">
                    <Button variant="secondary" className="w-full">
                      Register as Instructor
                    </Button>
                  </Link>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="text-5xl mb-4">👑</div>
                <h3 className="text-xl font-bold mb-2">Admin</h3>
                <p className="text-gray-600 mb-4">
                  Full system access to manage users, courses, and platform operations.
                </p>
                <p className="text-xs text-gray-500">Contact support for admin access</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join CourseMarket today and experience the future of online education.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="secondary" className="border-white text-white hover:bg-blue-700">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Demo Note */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-900 mb-2">Demo Project Notice</h3>
          <p className="text-sm text-yellow-800 mb-3">
            This is a demonstration project showcasing Clean Architecture, CQRS pattern,
            and hybrid business logic (Udemy + Uber). Test credentials are available on the login page.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-yellow-800">
            <div>
              <p className="font-semibold mb-1">Backend Features:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>.NET 8 Web API with Clean Architecture</li>
                <li>JWT Authentication with role-based authorization</li>
                <li>Stripe payment integration</li>
                <li>Instructor matching algorithm</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Frontend Features:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>React 18 + TypeScript + Vite</li>
                <li>Tailwind CSS styling</li>
                <li>React Query for server state</li>
                <li>Zustand for client state</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
