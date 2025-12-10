import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { UserRole } from '../types';
import type { AuthResponse, LoginRequest } from '../types';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, data.user);
      
      const from = location.state?.from?.pathname || (data.user.role === UserRole.Instructor ? '/instructor/dashboard' : '/courses');
      navigate(from);
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-y-12 -translate-x-12 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"></div>
        
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              CourseMarket
            </Link>
            <p className="text-slate-500 mt-2">Welcome back! Please login to continue.</p>
        </div>

        <div className="card-glass bg-white/80 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@example.com"
                className="bg-white/50"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-white/50"
              />

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center text-sm">
                <p className="text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-8 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wider">Demo Credentials:</p>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Student:</span>
                    <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">alice@coursemarket.com / User123!</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Instructor:</span>
                    <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">john.instructor@coursemarket.com / Instructor123!</span>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
