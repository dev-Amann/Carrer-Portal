import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import blogData from '../data/blog';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import LazyImage from '../components/LazyImage';

/**
 * Blog page - displays list of blog posts
 * Requirements: 27.1, 27.2
 */
const Blog = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-page min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Blog"
        description="Expert advice and insights to help you navigate your career journey. Read career development tips, industry trends, and success stories."
      />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Career Insights & Tips
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Expert advice and insights to help you navigate your career journey
          </p>
        </motion.header>

        {/* Blog Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogData.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="aspect-video overflow-hidden">
                  <LazyImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-100 mb-3 hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">{post.author}</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
