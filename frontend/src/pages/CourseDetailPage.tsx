import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { coursesApi } from '../api/courses';
import { purchasesApi } from '../api/purchases';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: () =>
      purchasesApi.createPaymentIntent({ courseId: parseInt(id!) }),
    onSuccess: () => {
      alert('Payment intent created! In production, this would redirect to Stripe checkout.');
      navigate('/my-courses');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Purchase failed');
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading course...</div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-12">Course not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}

          <CardHeader>
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </CardHeader>

          <CardBody>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p className="text-gray-700">{course.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Instructor</h3>
              <p className="text-gray-700">
                {course.instructor.firstName} {course.instructor.lastName}
              </p>
              <p className="text-gray-500 text-sm">{course.instructor.email}</p>
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
              <div>
                <p className="text-3xl font-bold text-blue-600">${course.price}</p>
                <p className="text-sm text-gray-500">One-time purchase</p>
              </div>

              {isAuthenticated ? (
                <Button
                  onClick={() => purchaseMutation.mutate()}
                  isLoading={purchaseMutation.isPending}
                  className="px-8"
                >
                  Purchase Course
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} className="px-8">
                  Login to Purchase
                </Button>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Note: This is a demo. In production, clicking "Purchase Course" would redirect to Stripe checkout.
                For testing, it will directly add the course to your collection.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
