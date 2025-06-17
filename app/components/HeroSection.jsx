
const HeroSection = () => {
  return (
    // Main content area with flexible centering and responsive padding
    <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-80 z-0"></div>

      <section className="text-center max-w-5xl mx-auto relative z-10">
        {/* Main Heading with enhanced styling and animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-8 leading-tight text-gray-50 drop-shadow-xl animate-fade-in-up">
          Create, Take, and{" "}
          <span className="gradient-text">Master Quizzes</span> with Ease
        </h1>

        {/* Sub-headline 1 with improved readability and animation */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed animate-fade-in delay-500">
          Unlock your potential with **dynamic quizzes**. Transform any content into
          interactive learning experiences, effortlessly.
        </p>

        {/* Sub-headline 2 with improved readability and animation */}
        {/* <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in delay-1000">
          **Customize every detail:** Name your quizzes, define categories, and add rich
          descriptions. Tailor each aspect to fit your unique learning needs or assessment goals.
        </p> */}

        {/* Call to action buttons with improved spacing and animation */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-1500">
          {/* Example of a Login button, uncomment if needed */}
          {/* <Link to={`/login`}>
            <button className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4">Login to Start Your Journey</button>
          </Link> */}

          <a href="#Features">
            <button className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4">Explore Features</button>
          </a>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;