import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { liveLessonsApi } from '../api/liveLessons';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RequestStatus } from '../types';

export const LiveLessonsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    preferredDate: '',
    duration: 60,
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['my-lesson-requests'],
    queryFn: liveLessonsApi.getMyRequests,
  });

  const createRequestMutation = useMutation({
    mutationFn: liveLessonsApi.createRequest,
    onSuccess: () => {
      alert('Lesson request created! We are finding the best instructor for you...');
      setShowForm(false);
      setFormData({ topic: '', description: '', preferredDate: '', duration: 60 });
      queryClient.invalidateQueries({ queryKey: ['my-lesson-requests'] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequestMutation.mutate(formData);
  };

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
        return 'Finding Instructor...';
      case RequestStatus.Assigned:
        return 'Instructor Assigned';
      case RequestStatus.Completed:
        return 'Completed';
      case RequestStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Live Lesson Requests</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Request Live Lesson'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold">Request a Live Lesson</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                  placeholder="e.g., React Hooks, Python Data Analysis"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what you want to learn..."
                  />
                </div>

                <Input
                  label="Preferred Date"
                  type="datetime-local"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  required
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  min={30}
                  max={180}
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={createRequestMutation.isPending}
                >
                  Submit Request
                </Button>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    After submitting, our algorithm will automatically match you with the best
                    instructor based on topic relevance, availability, and expertise.
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading your requests...</div>
        ) : requests && requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{request.topic}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{request.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Preferred Date:</span>
                      <span className="font-medium">
                        {new Date(request.preferredDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{request.duration} minutes</span>
                    </div>

                    {request.assignment && (
                      <>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Assigned Instructor:
                          </p>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="font-medium">
                              {request.assignment.instructor.firstName}{' '}
                              {request.assignment.instructor.lastName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {request.assignment.instructor.email}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Match Score: {request.assignment.matchScore} points
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't requested any live lessons yet.</p>
            <Button onClick={() => setShowForm(true)}>Request Your First Lesson</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};
