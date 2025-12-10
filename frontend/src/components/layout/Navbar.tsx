import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              CourseMarket
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link to="/courses" className="text-gray-700 hover:text-blue-600">
                Courses
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/my-courses" className="text-gray-700 hover:text-blue-600">
                    My Courses
                  </Link>

                  <Link to="/live-lessons" className="text-gray-700 hover:text-blue-600">
                    Live Lessons
                  </Link>

                  {user?.role === UserRole.Instructor && (
                    <Link to="/instructor/dashboard" className="text-gray-700 hover:text-blue-600">
                      My Assignments
                    </Link>
                  )}

                  {user?.role === UserRole.Instructor && (
                    <Link to="/courses/create" className="text-gray-700 hover:text-blue-600">
                      Create Course
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
