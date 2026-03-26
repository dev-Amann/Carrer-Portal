import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20 bg-white">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-slate-50/50" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Revolutionizing Career Growth
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          <span className="block text-indigo-600 mb-2">
            CareerPortal
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl text-slate-700 font-bold">
            Your Future is Developed by You
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover your ideal career path with AI-powered recommendations.
          Connect with industry experts, bridge skill gaps, and accelerate your professional growth.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            onClick={() => navigate('/career-recommendation')}
            size="lg"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md"
          >
            Get Started
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>

          <Button
            onClick={() => navigate('/contact')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-slate-700 border-slate-200 hover:bg-slate-50"
          >
            Contact Sales
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { label: 'Active Users', value: '10K+' },
            { label: 'Career Paths', value: '500+' },
            { label: 'Experts', value: '100+' },
            { label: 'Success Rate', value: '94%' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

