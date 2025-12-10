import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
// import { Card, CardBody } from '../components/ui/Card'; // Replaced with glass design

export const MyCoursesPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect instructors to their created courses page
  useEffect(() => {
    if (user?.role === UserRole.Instructor) {
      navigate('/instructor/courses', { replace: true });
    }
  }, [user, navigate]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: coursesApi.getMyCourses,
    enabled: user?.role !== UserRole.Instructor,
  });

  // Show loading while redirecting
  if (user?.role === UserRole.Instructor) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-slate-50 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
             <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">My Learning</h1>
             <p className="text-lg text-slate-500">Track your progress and continue learning.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group">
                  <div className="card-glass bg-white h-full hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden">
                    {course.imageUrl ? (
                        <div className="h-48 overflow-hidden relative">
                           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                           <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
                          <span className="text-6xl transform group-hover:scale-125 transition-transform duration-500">🎓</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                            Purchased
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {course.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                         <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                 {course.instructorName.charAt(0)}
                             </div>
                             <span className="text-sm font-medium text-slate-600">{course.instructorName}</span>
                         </div>
                         <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-lg">
                             <span>▶</span>
                             <span>Resume</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No courses yet</h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">Start your learning journey today by exploring our marketplace.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all"
                >
                  Browse Courses
                </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
