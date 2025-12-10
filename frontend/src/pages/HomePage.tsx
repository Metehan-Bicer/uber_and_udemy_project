import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
// import { Card, CardBody } from '../components/ui/Card'; // Custom glass cards
// import { Button } from '../components/ui/Button'; // Custom buttons
import { useAuthStore } from '../store/authStore';

export const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-slate-50 min-h-screen flex flex-col justify-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 font-display tracking-tight text-slate-900 leading-tight">
              Master New Skills with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Hybrid Learning
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of self-paced courses and on-demand live mentorship.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                 <>
                    <Link to="/courses" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all text-lg">
                        Explore Marketplace
                    </Link>
                    <Link to="/live-lessons" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg border border-indigo-100 hover:bg-indigo-50 hover:scale-105 transition-all text-lg">
                        Find a Mentor
                    </Link>
                 </>
              ) : (
                 <>
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all text-lg">
                        Start Learning Free
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg border border-indigo-100 hover:bg-indigo-50 hover:scale-105 transition-all text-lg">
                        Review Features
                    </Link>
                 </>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {/* Udemy Flow Card */}
            <div className="bg-white/60 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-9xl">📚</span>
                </div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        🎓
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Course Marketplace</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Browse thousands of high-quality video courses. Learn at your own pace with lifetime access.
                    </p>
                    <ul className="space-y-4">
                        {['Expert Instructors', 'Secure Payments', 'Lifetime Access', 'Certificate of Completion'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Uber Flow Card */}
            <div className="bg-white/60 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-9xl">🎯</span>
                </div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                        🧞‍♂️
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Mentorship</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Stuck on a problem? Get matched with an expert mentor for a 1-on-1 live session instantly.
                    </p>
                    <ul className="space-y-4">
                        {['AI Matching Algorithm', 'Instant Availability', 'Verified Experts', 'Screen Sharing Support'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-slate-900 text-white rounded-3xl p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20"></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {[
                    { number: '1.2k+', label: 'Active Students' },
                    { number: '150+', label: 'Verified Mentors' },
                    { number: '98%', label: 'Match Success Rate' }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                            {stat.number}
                        </div>
                        <div className="text-indigo-200 font-medium text-lg">{stat.label}</div>
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};
