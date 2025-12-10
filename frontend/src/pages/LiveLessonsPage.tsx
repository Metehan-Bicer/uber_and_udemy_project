import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { liveLessonsApi } from '../api/liveLessons';
import { Layout } from '../components/layout/Layout';
// import { Card, CardBody, CardHeader } from '../components/ui/Card'; // Custom glass design
import { Input } from '../components/ui/Input';
import { RequestStatus, UserRole } from '../types';
import { useAuthStore } from '../store/authStore';

export const LiveLessonsPage = () => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState(60);
    const { user } = useAuthStore();

    const queryClient = useQueryClient();

    const { data: requests, isLoading } = useQuery({
        queryKey: ['my-lesson-requests'],
        queryFn: liveLessonsApi.getMyRequests,
        enabled: user?.role !== UserRole.Instructor,
    });

    const createMutation = useMutation({
        mutationFn: liveLessonsApi.createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-lesson-requests'] });
            setTopic('');
            setDescription('');
            setDate('');
            setDuration(60);
            alert('Lesson request created successfully! An instructor will be assigned shortly.');
        },
        onError: (error) => {
            console.error('Failed to create request:', error);
            alert('Failed to create lesson request. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            topic,
            description,
            preferredDate: new Date(date).toISOString(),
            duration,
        });
    };

    // If instructor, redirect to dashboard with message
    if (user?.role === UserRole.Instructor) {
        return (
            <Layout>
                <div className="pt-24 min-h-screen bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center py-24">
                            <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
                                <div className="text-6xl mb-6">👨‍🏫</div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">Instructor Dashboard</h1>
                                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                                    As an instructor, you can view and manage your assigned live sessions from your dashboard.
                                </p>
                                <Link
                                    to="/instructor/dashboard"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all"
                                >
                                    Go to Your Dashboard →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-display">Live Mentorship</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Need help? Request a 1-on-1 live session and our AI matching algorithm will find the perfect expert for you instantly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Request Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-xl p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">🚀</span>
                                    Request a Session
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                                        <Input
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="e.g. React Performance Optimization"
                                            required
                                            className="bg-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe what you need help with..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none h-32"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                                        <Input
                                            type="datetime-local"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="bg-white/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                        >
                                            <option value={30}>30 Minutes</option>
                                            <option value={60}>60 Minutes</option>
                                            <option value={90}>90 Minutes</option>
                                            <option value={120}>2 Hours</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                                    >
                                        {createMutation.isPending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Finding Expert...
                                            </>
                                        ) : (
                                            'Find Mentor'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Requests List */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Requests</h2>

                            {isLoading ? (
                                <div className="text-center py-12">Loading...</div>
                            ) : requests?.length === 0 ? (
                                <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">No requests yet. Create one to get started!</p>
                                </div>
                            ) : (
                                requests?.map((req) => (
                                    <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{req.topic}</h3>
                                                <p className="text-sm text-slate-500">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                req.status === RequestStatus.Assigned
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : req.status === RequestStatus.Pending
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {req.status === RequestStatus.Pending ? 'Pending' : 
                                                 req.status === RequestStatus.Assigned ? 'Assigned' : 
                                                 req.status === RequestStatus.Completed ? 'Completed' : 'Cancelled'}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl text-sm">
                                            {req.description}
                                        </p>

                                        {req.assignment && (
                                            <div className="flex items-center gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                                                    {req.assignment.instructorName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-indigo-600 font-bold uppercase">Assigned Expert</p>
                                                    <p className="font-bold text-slate-900">{req.assignment.instructorName}</p>
                                                </div>
                                                <div className="ml-auto">
                                                     <div className="text-right">
                                                        <p className="text-xs text-slate-500">Match Score</p>
                                                        <p className="font-bold text-indigo-600 text-lg">{req.assignment.matchScore}%</p>
                                                     </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
