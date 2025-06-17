import { redirect, useLoaderData } from "@remix-run/react"; // Correct import for useLoaderData
import Users from "../../models/user.model";
import Questions from "../../models/question.model";
import { Link } from "@remix-run/react";
import Header from "../components/Header";
import { Clock, PlayCircle, BarChart2, PlusCircle } from "lucide-react"; // Import Lucide icons for consistency

export const loader = async ({ params }) => {
  const userId = params.userId;

  let user = await Users.findById(userId);
  if (!user) {
    return redirect("/");
  }
  const quizzes = await Questions.distinct("testName", { userId: userId });

  const allQuizDetails = await Promise.all(
    quizzes.map(async (testName) => {
      const questionDoc = await Questions.findOne(
        { testName: testName, userId: userId },
        'testName time usersAnswer'
      );

      if (questionDoc) {
        return {
          testName: questionDoc.testName,
          time: questionDoc.time,
          usersAnswer: questionDoc.usersAnswer
        };
      } else {
        console.warn(`Full quiz data not found for testName: ${testName} under userId: ${userId}`);
        return null;
      }
    })
  );
  // Filter out any null entries that might result from missing data
  const filteredQuizDetails = allQuizDetails.filter(quiz => quiz !== null);

  return Response.json({
    allQuizDetails: filteredQuizDetails, // Use filtered data
    userId,
  });
};

const AllQuiz = () => {
  const { allQuizDetails, userId } = useLoaderData();

  return (
    <>
      <Header userId={userId} />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 p-6 md:p-10 lg:p-12 font-sans antialiased">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-teal-400 drop-shadow-lg animate-fade-in-up">
            Your Quizzes
          </h1>

          {allQuizDetails.length === 0 ? (
            <div className="text-center text-gray-400 text-xl py-20 animate-fade-in delay-300">
              <p className="mb-4">You haven&apos;t created or attempted any quizzes yet!</p>
              <Link to={`/upload/${userId}`}>
                <button className="btn-primary text-lg animate-bounce-in-small">
                  <PlusCircle size={20} className="mr-2" /> Create Your First Quiz
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {allQuizDetails.map((quiz, index) => (
                <div
                  className="bg-gray-800 rounded-xl p-6 w-full max-w-xs shadow-lg border border-gray-700
             transform transition-all duration-300 ease-in-out
             hover:scale-105 hover:shadow-2xl hover:bg-gray-700
             flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
                  key={quiz.testName}
                >
                  <h2 className="text-white text-2xl font-bold mb-4 leading-tight">{quiz.testName}</h2>

                  <div className="flex items-center text-gray-400 mb-6 text-sm">
                    <Clock size={18} className="mr-2 text-blue-400" />
                    <span>{quiz.time} minutes</span>
                  </div>

                  <Link to={`/quiz/${userId}/${quiz.testName}`} className="block w-full mb-3">
                    <button className="w-full bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center
                                       hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800
                                       transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:scale-98 shadow-md">
                      <PlayCircle size={20} className="mr-2" />
                      Start Quiz
                    </button>
                  </Link>

                  {quiz.usersAnswer && (
                    <Link to={`/result/${userId}/${quiz.testName}`} className="block w-full">
                      <button className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center
                                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800
                                         transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:scale-98 shadow-md">
                        <BarChart2 size={20} className="mr-2" />
                        Check Result
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Floating Action Button for Uploading a Quiz */}
          {allQuizDetails.length > 0 && ( // Only show FAB if there are existing quizzes
            <Link to={`/upload/${userId}`} className="fixed bottom-8 right-8 z-40">
              <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center
                                 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75
                                 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 animate-bounce-slow">
                <PlusCircle size={28} />
              </button>
            </Link>
          )}

          {allQuizDetails.length > 0 && ( // Add a text label for the FAB for user-friendliness
            <p className="fixed bottom-8 right-24 z-40 text-gray-400 text-sm animate-fade-in hidden md:block">Create New Quiz</p>
          )}

        </div>
      </div>
    </>
  );
};

export default AllQuiz;