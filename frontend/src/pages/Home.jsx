import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Button from '../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <SEO
        title="Home"
        description="CareerPortal - AI-Powered Career Guidance System. Bridging the gap between skills and opportunities."
      />

      {/* Hero Section - Clean & Trustworthy */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Build Your Career <br className="hidden sm:block" />
            <span className="text-indigo-600">With Data-Driven Insights</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive platform connecting students with personalized career paths, expert mentorship, and skill development resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/career-recommendation')}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Start Assessment
            </Button>
            <Button
              onClick={() => navigate('/about')}
              variant="outline"
              size="lg"
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Process</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our systematic approach ensures accurate career matching and effective development planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="text-indigo-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Profile Assessment</h3>
              <p className="text-slate-600 leading-relaxed">
                We analyze your technical skills, soft skills, and academic background to create a comprehensive professional profile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="text-indigo-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gap Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our algorithm identifies specific knowledge gaps between your current profile and your target career requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="text-indigo-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Mentorship</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with vetted industry professionals who provide personalized guidance to bridge your skill gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join a community of focused professionals and students utilizing data to make informed career decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/signup')} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-sm">
              Create Student Account
            </Button>
            <Button onClick={() => navigate('/expert/register')} variant="outline" size="lg" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 px-8">
              Join as Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

