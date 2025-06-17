import { Link } from "@remix-run/react";

const CallToAction = ({userId}) => {
  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 relative overflow-hidden">
      {/* Background blobs for modern aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>


      <div className="max-w-4xl mx-auto text-center relative z-10 py-10 fade-in delay-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 gradient-text leading-tight animate-bounce-in-small">
          Ready to Elevate Your Knowledge?
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unlock your potential with **QuizMaster**. Create, share, and conquer quizzes designed to make learning engaging and effective. It&apos;s time to test your limits!
        </p>
        <Link to={`/upload/${userId}`} className="inline-block animate-scale-in">
          <button className="btn-primary text-xl px-12 py-4 shadow-2xl hover:shadow-cyan-500/50">
            Start Quizzing Now!
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;