import { Award, Bolt, Hourglass, TrendingUp, Upload, Users } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    // Enhanced FeatureCard styling with modern dark theme and hover effects
    <div
      className={`feature-card bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-2xl hover:bg-gray-700
                  flex flex-col items-start text-left
                  fade-in ${delay}`} // 'feature-card' class leverages global styles
    >
      <div className="text-teal-400 text-5xl mb-5 transform hover:scale-110 transition-transform duration-300 ease-in-out">
        <Icon size={52} className="drop-shadow-lg" /> {/* Larger icon, subtle shadow */}
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold text-gray-50 mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed text-base">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Bolt,
      title: 'Lightning Fast Creation',
      description: 'Quickly create quizzes from scratch or instantly convert your notes from image or PDF formats into engaging questions. Our AI handles the heavy lifting!',
      delay: 'delay-1' // Adjusted delay for staggered effect
    },
    {
      icon: Hourglass,
      title: 'Timed Challenges',
      description: 'Set custom time limits for your quizzes to add an exciting challenge. Perfect for exam preparation or friendly competitions.',
      delay: 'delay-2'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Get detailed results, performance analytics, and immediate feedback. Review your answers against the correct ones to learn effectively.',
      delay: 'delay-3'
    },
    {
      icon: Award,
      title: 'Fully Customizable',
      description: 'Name your quizzes, define categories, and add descriptions. Tailor every aspect to fit your learning needs or assessment goals.',
      delay: 'delay-4'
    },
    {
      icon: Upload,
      title: 'Flexible Input & Output',
      description: 'Upload questions from images or PDFs, and the system intelligently converts them. Users can also provide answers directly for self-assessment.',
      delay: 'delay-5'
    },
    {
      icon: Users,
      title: 'Effortless Access',
      description: 'No complex registration required. Jump straight into creating or taking quizzes and start mastering new topics instantly.',
      delay: 'delay-6' // Added a new delay for consistency
    },
  ];

  return (
    // Section background with subtle gradient and ample padding
    <section className="py-10 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-950 to-gray-800" id="Features">
      <div className="max-w-7xl mx-auto">
        {/* <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-teal-400 mb-16 fade-in animate-bounce-in-small">
          <span className="gradient-text">Unlock Your Potential</span> with QuizMaster Features
        </h2> */}
        <h2 className="text-4xl font-bold text-center mb-12 fade-in delay-3 gradient-text">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              // Dynamically apply delay based on index for natural staggering
              delay={`delay-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;