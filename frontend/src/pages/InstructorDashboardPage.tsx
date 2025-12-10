import { useQuery } from '@tanstack/react-query';
import { liveLessonsApi } from '../api/liveLessons';
import { Layout } from '../components/layout/Layout';
import { RequestStatus } from '../types';

export const InstructorDashboardPage = () => {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assigned-lessons'],
    queryFn: liveLessonsApi.getAssignedLessons,
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Pending:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case RequestStatus.Assigned:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case RequestStatus.Completed:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case RequestStatus.Cancelled:
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Pending: return 'Pending';
      case RequestStatus.Assigned: return 'Assigned';
      case RequestStatus.Completed: return 'Completed';
      case RequestStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 15) return 'text-emerald-500';
    if (score >= 10) return 'text-blue-500';
    if (score >= 5) return 'text-amber-500';
    return 'text-slate-400';
  };

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-slate-50 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">Instructor Dashboard</h1>
              <p className="text-lg text-slate-500">Manage your upcoming live sessions and requests.</p>
            </div>
          </div>

          {isLoading ? (
             <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : assignments && assignments.length > 0 ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl">📊</div>
                   <div className="relative z-10">
                      <div className="text-5xl font-bold text-slate-900 mb-2">{assignments.length}</div>
                      <div className="text-slate-500 font-medium">Total Assignments</div>
                   </div>
                </div>

                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl">⚡</div>
                   <div className="relative z-10">
                      <div className="text-5xl font-bold text-indigo-600 mb-2">{assignments.filter((a) => a.status === RequestStatus.Assigned).length}</div>
                      <div className="text-indigo-900/60 font-medium">Active Sessions</div>
                   </div>
                </div>

                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl">✅</div>
                   <div className="relative z-10">
                      <div className="text-5xl font-bold text-emerald-600 mb-2">{assignments.filter((a) => a.status === RequestStatus.Completed).length}</div>
                      <div className="text-emerald-900/60 font-medium">Completed</div>
                   </div>
                </div>
              </div>

              {/* Assignments List */}
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Assignments</h2>
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="card-glass bg-white p-6 hover:shadow-lg transition-all group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(assignment.status)}`}>
                             {getStatusText(assignment.status)}
                           </span>
                           <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                             {assignment.topic}
                           </h3>
                        </div>
                        <p className="text-slate-500 mb-4">{assignment.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                     {assignment.studentName.charAt(0)}
                                </div>
                                <span className="font-medium">{assignment.studentName}</span>
                             </div>
                             <div className="hidden sm:block text-slate-300">|</div>
                             <div className="flex items-center gap-2">
                                 <span>📅</span>
                                 <span>{new Date(assignment.preferredDate || '').toLocaleDateString()}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <span>⏰</span>
                                 <span>{assignment.duration} min</span>
                             </div>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 gap-4 min-w-[150px]">
                         <div className="text-right">
                             <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Match Score</div>
                             <div className={`text-4xl font-bold ${getMatchScoreColor(assignment.matchScore)}`}>
                                {assignment.matchScore}
                             </div>
                         </div>
                         <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                            Auto-matched by AI
                         </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
               <div className="text-6xl mb-4">💤</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Assignments Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                You're all caught up! Relax while our algorithm finds the perfect students for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
