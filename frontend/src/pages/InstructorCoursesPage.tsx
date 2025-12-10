import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { coursesApi } from '../api/courses';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';

export const InstructorCoursesPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-created-courses'],
    queryFn: coursesApi.getMyCreatedCourses,
  });

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-created-courses'] });
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setShowCreateForm(false);
      alert('Course created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create course');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <Layout>
      <div className="pt-24 min-h-screen bg-slate-50 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">My Courses</h1>
              <p className="text-lg text-slate-500">Manage your created courses and create new ones.</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
            >
              {showCreateForm ? 'Cancel' : '+ Create New Course'}
            </button>
          </div>

          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Course</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advanced React Patterns"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="49.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Image URL (optional)</label>
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-wait"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group">
                  <div className="card-glass bg-white h-full hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden border border-slate-100 rounded-2xl">
                    {course.imageUrl ? (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center relative overflow-hidden">
                        <span className="text-6xl transform group-hover:scale-125 transition-transform duration-500">📚</span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                          Your Course
                        </span>
                        <span className="text-lg font-bold text-slate-900">${course.price}</span>
                      </div>

                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-600">Instructor</span>
                        <span className="text-sm font-medium text-slate-900">{course.instructorName}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No courses created yet</h2>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start creating your first course and share your knowledge with students.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
