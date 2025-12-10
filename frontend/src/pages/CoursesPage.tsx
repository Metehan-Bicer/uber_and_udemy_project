import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';

export const CoursesPage = () => {
  const [page, setPage] = useState(1);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['courses', page, search],
    queryFn: () => coursesApi.getAll(page, 12, search || undefined),
  });

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
              <p className="text-slate-500 text-lg">Master new skills with our expert-led courses.</p>
            </div>
            <div className="w-full md:w-96">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <Input
                        placeholder="Search for anything..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 shadow-sm"
                    />
                </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {data?.items.map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="group">
                    <div className="card-glass overflow-hidden h-full hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white border border-gray-100 rounded-2xl">
                      <div className="relative overflow-hidden h-56">
                        {course.imageUrl && !imageError[course.id] ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImageError(prev => ({ ...prev, [course.id]: true }))}
                          />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                <span className="text-indigo-300 text-4xl">📚</span>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full">Course</span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <span>⭐</span>
                                <span className="text-slate-700 text-sm font-bold">4.8</span>
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                            {course.title}
                        </h3>
                        
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {course.instructorName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-600">{course.instructorName}</span>
                          </div>
                          <span className="text-xl font-bold text-slate-900">${course.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
               {data && data.totalCount > 0 && (
                <div className="flex justify-center gap-3 mb-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-5 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                    Page {page} of {Math.ceil(data.totalCount / 12)}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(data.totalCount / 12)}
                    className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};
