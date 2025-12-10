import { useQuery } from '@tanstack/react-query';
import { liveLessonsApi } from '../api/liveLessons';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';
import { RequestStatus } from '../types';

export const InstructorDashboardPage = () => {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assigned-lessons'],
    queryFn: liveLessonsApi.getAssignedLessons,
  });

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case RequestStatus.Assigned:
        return 'bg-green-100 text-green-800';
      case RequestStatus.Completed:
        return 'bg-blue-100 text-blue-800';
      case RequestStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.Pending:
        return 'Pending';
      case RequestStatus.Assigned:
        return 'Assigned to You';
      case RequestStatus.Completed:
        return 'Completed';
      case RequestStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 15) return 'text-green-600';
    if (score >= 10) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">
            View and manage your assigned live lesson requests
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading your assignments...</div>
        ) : assignments && assignments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardBody>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">
                      {assignments.length}
                    </p>
                    <p className="text-gray-600 mt-2">Total Assignments</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">
                      {assignments.filter((a) => a.status === RequestStatus.Assigned).length}
                    </p>
                    <p className="text-gray-600 mt-2">Active Lessons</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-purple-600">
                      {assignments.filter((a) => a.status === RequestStatus.Completed).length}
                    </p>
                    <p className="text-gray-600 mt-2">Completed</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardBody>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl">{assignment.request.topic}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {getStatusText(assignment.status)}
                          </span>
                        </div>
                        <p className="text-gray-600">{assignment.request.description}</p>
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500 mb-1">Match Score</p>
                        <p className={`text-2xl font-bold ${getMatchScoreColor(assignment.matchScore)}`}>
                          {assignment.matchScore}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Student Info</p>
                        <p className="font-medium">
                          {assignment.request.student.firstName}{' '}
                          {assignment.request.student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.request.student.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Lesson Details
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Preferred Date:</span>
                            <span className="font-medium">
                              {new Date(assignment.request.preferredDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">
                              {new Date(assignment.request.preferredDate).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">
                              {assignment.request.duration} minutes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Why you were matched:</strong> Our algorithm selected you based on
                        topic relevance, availability, and expertise. The match score of{' '}
                        {assignment.matchScore} indicates a strong fit for this lesson.
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Assigned on: {new Date(assignment.assignedAt).toLocaleString()}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You don't have any lesson assignments yet.
            </p>
            <p className="text-sm text-gray-500">
              You will receive assignments when students request lessons that match your expertise.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
