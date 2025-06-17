
const Footer = () => {
  return (
    // Enhanced footer with a darker background, more refined text, and subtle animations
    <footer className="py-10 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-950 text-gray-400 text-center text-sm border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 animate-fade-in-up">
        {/* Copyright and tagline */}
        <p className="text-gray-500 text-base md:text-sm leading-relaxed">
          &copy; {new Date().getFullYear()} QuizMaster. All rights reserved. 
          <span className="block mt-1 md:inline md:ml-1 text-gray-600">Built with passion for effortless learning.</span>
        </p>

        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base md:text-sm">
          <a
            href="/privacy-policy" // Suggest using actual paths
            className="text-gray-400 hover:text-teal-400 font-medium transition-all duration-300 ease-in-out hover:underline underline-offset-4"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service" // Suggest using actual paths
            className="text-gray-400 hover:text-teal-400 font-medium transition-all duration-300 ease-in-out hover:underline underline-offset-4"
          >
            Terms of Service
          </a>
          <a
            href="/contact-us" // Suggest using actual paths
            className="text-gray-400 hover:text-teal-400 font-medium transition-all duration-300 ease-in-out hover:underline underline-offset-4"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;