import SEO from '../components/SEO';

const About = () => {
  const teamMembers = [
    {
      name: 'Aman',
      role: 'Full Stack & AI',
      description: 'Expert in building scalable web applications and AI-powered solutions',
      image: 'https://picsum.photos/seed/aman/400/400'
    }
  ];

  return (
    <div className="about-page min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO
        title="About Us"
        description="Learn about CarrerPortal's mission to democratize access to quality career guidance through technology and expert mentorship."
      />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            About CarrerPortal
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Empowering careers through technology and personalized guidance
          </p>
        </header>

        {/* Company Story and Mission */}
        <section className="mb-20">
          <div className="bg-white border border-slate-200 rounded-xl p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <p>
                CarrerPortal was born from a simple observation: talented individuals often struggle to find
                the right career path that matches their unique skills and aspirations. We saw countless
                professionals feeling lost in their career journey, unsure of which direction to take or
                how to bridge the gap between where they are and where they want to be.
              </p>
              <p>
                Founded by a team of technologists and career development experts, we set out to create
                a platform that combines cutting-edge AI technology with human expertise to provide
                personalized career guidance at scale.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-10">
              Our Mission
            </h3>
            <p className="text-slate-700 leading-relaxed">
              To democratize access to quality career guidance by leveraging technology and connecting
              individuals with the right resources, mentors, and opportunities to achieve their
              professional goals.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-10">
              Our Values
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span><strong>Personalization:</strong> Every journey is unique</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span><strong>Accessibility:</strong> Guidance for everyone</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span><strong>Innovation:</strong> Technology-driven improvement</span>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span><strong>Integrity:</strong> Honest and transparent</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Team Members */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">
            Meet Our Team
          </h2>
          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center w-full max-w-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-slate-100"
                />
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-4 text-sm">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
