import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 transition-opacity">
              CourseMarket
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {isAuthenticated && user?.role !== UserRole.Instructor && (
                <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Explore Courses
                </Link>
              )}

              {isAuthenticated && (
                <>
                  {user?.role === UserRole.Instructor ? (
                    <>
                      <Link to="/instructor/courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        My Courses
                      </Link>

                      <Link to="/instructor/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Live Sessions
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/my-courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        My Learning
                      </Link>

                      <Link to="/live-lessons" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Live Mentorship
                      </Link>
                    </>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <Link to="/courses" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Explore Courses
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                    {user?.role === UserRole.Instructor && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            Instructor
                        </span>
                    )}
                </div>
                <button
                  onClick={() => {
                    queryClient.removeQueries();
                    logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
