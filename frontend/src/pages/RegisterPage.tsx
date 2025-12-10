import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { UserRole } from '../types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.User as UserRole,
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/courses');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
         {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              CourseMarket
            </Link>
            <p className="text-slate-500 mt-2">Create your account to start learning.</p>
        </div>

        <div className="card-glass bg-white/80 p-8">
           <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Register</h2>
          
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="bg-white/50"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="bg-white/50"
                  />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/50"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-white/50"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  I want to be a:
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: UserRole.User })}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === UserRole.User ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                        Student 🎓
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: UserRole.Instructor })}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === UserRole.Instructor ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                        Instructor 👨‍🏫
                    </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center text-sm mt-4">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};
