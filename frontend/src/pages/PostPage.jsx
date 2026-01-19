import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import blogData from '../data/blog';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import LazyImage from '../components/LazyImage';

/**
 * PostPage - displays individual blog post with social share buttons
 * Requirements: 27.3, 27.4, 27.5
 */
const PostPage = () => {
  const { slug } = useParams();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Find post by slug
  const post = blogData.find((p) => p.slug === slug);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 py-16 px-4">
        <SEO title="Post Not Found" description="The blog post you're looking for doesn't exist." />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Post Not Found
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            View All Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title={post.title}
        description={post.excerpt}
        ogImage={post.image}
      />
      <article className="max-w-4xl mx-auto">
        {/* Back to Blog Link */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Featured Image */}
          <div className="aspect-video overflow-hidden">
            <LazyImage
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-blue-900 text-blue-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-100">
                    {post.author}
                  </div>
                  <time
                    dateTime={post.publishedAt}
                    className="text-sm text-gray-400"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 mr-2">
                  Share:
                </span>
                <button
                  onClick={shareOnTwitter}
                  className="p-2 rounded-full bg-gray-700 hover:bg-blue-900 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 rounded-full bg-gray-700 hover:bg-blue-900 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="p-2 rounded-full bg-gray-700 hover:bg-blue-900 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={copyLink}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label="Copy link"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>

        {/* Related Posts CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
        >
          <Link
            to="/blog"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            Read More Articles
          </Link>
        </motion.div>
      </article>
    </div>
  );
};

export default PostPage;
