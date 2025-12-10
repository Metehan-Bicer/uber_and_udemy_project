import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Layout } from '../components/layout/Layout';
import { Card, CardBody } from '../components/ui/Card';

export const MyCoursesPage = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: coursesApi.getMyCourses,
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading your courses...</div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Purchased
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{course.instructorName}</span>
                      <span className="text-blue-600 font-bold">${course.price}</span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't purchased any courses yet.</p>
            <Link
              to="/courses"
              className="text-blue-600 hover:underline"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};
