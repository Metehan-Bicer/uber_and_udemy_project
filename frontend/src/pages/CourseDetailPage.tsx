import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/courses';
import { purchasesApi } from '../api/purchases';
import { Layout } from '../components/layout/Layout';

// import { Card, CardBody, CardHeader } from '../components/ui/Card'; // Custom glass
// import { Button } from '../components/ui/Button'; // Custom button
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const { data: myCourses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: coursesApi.getMyCourses,
    enabled: isAuthenticated,
  });

  const location = useLocation();

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const intentResponse = await purchasesApi.createPaymentIntent({ courseId: parseInt(id!) });
      // In a real app, you would use stripe.confirmCardPayment here
      // For mock, we just send the secret back to our confirm endpoint
      return await purchasesApi.confirmPurchase({ paymentIntentId: intentResponse.clientSecret });
    },
    onSuccess: () => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      alert('Payment Successful! Course added to your library.');
      navigate('/my-courses');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Purchase failed');
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
           <div className="text-xl text-slate-500">Course not found</div>
        </div>
      </Layout>
    );
  }



  const isPurchased = myCourses?.some((c) => c.id === parseInt(id!));

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-slate-50 pb-12">
        <div className="max-w-6xl mx-auto px-6">
            
          {/* Breadcrumb / Back */}
          <button onClick={() => navigate(-1)} className="mb-6 text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors">
            ← Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <div className="card-glass bg-white p-8 mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">{course.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">{course.description}</p>
                    
                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</span>
                            <span className="font-bold text-slate-700">(4.8)</span>
                        </div>
                        <div className="text-slate-400">|</div>
                        <div className="text-slate-600">
                            Created by <span className="font-bold text-indigo-600">{course.instructor.firstName} {course.instructor.lastName}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-4">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {['Master the fundamentals', 'Build real-world projects', 'Understand best practices', 'Get job-ready skills'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-600">
                                <span className="text-green-500">✓</span> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar / Stats */}
            <div className="lg:col-span-1">
                <div className="card-glass bg-white p-6 sticky top-24">
                    {course.imageUrl ? (
                        <div className="rounded-xl overflow-hidden mb-6 shadow-lg">
                             <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    ) : (
                         <div className="rounded-xl overflow-hidden mb-6 shadow-lg h-48 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                            <span className="text-5xl">📚</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="text-4xl font-bold text-slate-900 mb-2">${course.price}</div>
                        <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                            <span>🕒</span> 80% off for the next 5 hours!
                        </div>
                    </div>

                    {isAuthenticated ? (
                        user?.role === UserRole.Instructor ? (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 text-indigo-700 mb-2">
                                    <span className="text-xl">👨‍🏫</span>
                                    <span className="font-bold">Instructor View</span>
                                </div>
                                <p className="text-sm text-indigo-600">
                                    As an instructor, you can view this course but cannot purchase it.
                                </p>
                            </div>
                        ) : isPurchased ? (
                            <button
                                disabled
                                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 cursor-default mb-4 text-lg flex items-center justify-center gap-2"
                            >
                                <span>✅</span> Already Purchased
                            </button>
                        ) : (
                            <button
                                onClick={() => purchaseMutation.mutate()}
                                disabled={purchaseMutation.isPending}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all mb-4 text-lg"
                            >
                                {purchaseMutation.isPending ? 'Processing...' : 'Buy Now'}
                            </button>
                        )
                    ) : (
                         <button
                          onClick={() => navigate('/login', { state: { from: location } })}
                          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all mb-4 text-lg"
                        >
                          Login to Buy
                        </button>
                    )}
                    
                    <p className="text-xs text-center text-slate-400 mb-4">30-Day Money-Back Guarantee</p>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                             <span>Includes:</span>
                             <span className="font-medium">24h on-demand video</span>
                        </div>
                         <div className="flex items-center justify-between text-sm text-slate-600">
                             <span>Access:</span>
                             <span className="font-medium">Full Lifetime Access</span>
                        </div>
                         <div className="flex items-center justify-between text-sm text-slate-600">
                             <span>Device:</span>
                             <span className="font-medium">Mobile and TV</span>
                        </div>
                    </div>

                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
