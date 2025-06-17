import { Link } from "@remix-run/react";
import { Brain } from "lucide-react";

const Header = ({ userId }) => {
  return (
    // Modernized header with a deeper dark background, subtle border, and animated entrance
    <header className="p-4 md:px-8 lg:px-12 bg-gray-950 border-b border-gray-800 shadow-xl sticky top-0 z-50 animate-slide-down">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand/Logo Section */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <Brain
            size={44} // Slightly larger icon
            className="text-teal-400 transform group-hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-md"
          />
          <Link to="/" className="text-3xl lg:text-4xl font-extrabold gradient-text tracking-tight transform group-hover:scale-105 transition-transform duration-300 ease-in-out">
            QuizMaster
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        {/* For mobile, you might consider a hamburger menu, but that would involve functionality changes */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <button className="btn-header-secondary">Home</button>
          </Link>
          <Link to={`/upload/${userId}`}>
            <button className="btn-header-secondary">Create Quiz</button>
          </Link>
          <Link to={`/all-quiz/${userId}`}>
            <button className="btn-header-secondary">All Quizzes</button>
          </Link>
          <Link to="/logout">
            <button className="btn-primary-small">Logout</button>
          </Link>
        </div>

        {/* Placeholder for a mobile menu icon (if functionality is added later) */}
        <div className="md:hidden">
            {/* Example: <button className="text-gray-200 focus:outline-none"><Menu size={28} /></button> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;