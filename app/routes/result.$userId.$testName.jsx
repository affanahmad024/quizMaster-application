import Questions from "../../models/question.model";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import Users from "../../models/user.model";
import { getTokenFromCookie, getUserFromToken } from "../cookies.server";
import Header from "../components/Header";
import { CheckCircle2, XCircle, Award, Target, Trophy } from "lucide-react"; // Import Lucide icons

export const loader = async ({ params, request }) => {
  const testName = params.testName;
  const userId = params.userId;

  let user = await Users.findById(userId);
  if (!user) {
    return redirect("/");
  }
  const token = await getTokenFromCookie(request);
  if (!token) return redirect("/logout");
  let id = await getUserFromToken(token);
  const isVerified = userId === id; // Use strict equality

  const questions = await Questions.find({
    testName: testName,
    userId: userId,
  });

  // Calculate correct marks
  let correctMarks = 0;
  questions.forEach(q => {
    // Ensure both q.answer and q.usersAnswer exist and are comparable
    // Convert to string for consistent comparison, especially if one is number and other is string
    if (String(q.answer) && String(q.usersAnswer) && String(q.answer) === String(q.usersAnswer)) {
      correctMarks++;
    }
  });

  return Response.json({
    questions,
    testName,
    isVerified,
    total: questions.length,
    marksObtained: correctMarks,
    userId
  });
};

const Result = () => {
  const { questions, testName, isVerified, total, marksObtained, userId } = useLoaderData();

  // Calculate percentage, handle division by zero for total questions
  const percentage = total > 0 ? ((marksObtained * 100) / total).toFixed(2) : 0;
  const passed = percentage >= 60; // Example passing threshold

  return (
    <>
      <Header userId={userId} />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 p-6 md:p-10 lg:p-12 font-sans antialiased">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 md:p-8 animate-fade-in-up">
          {isVerified ? (
            <>
              {/* Result Summary Section */}
              <div className={`text-center py-8 rounded-xl mb-10 shadow-lg ${passed ? 'bg-gradient-to-r from-teal-700 to-green-700' : 'bg-gradient-to-r from-red-700 to-orange-700'} animate-scale-in`}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow">
                  Quiz Results for <span className="gradient-text-light">{testName}</span>
                </h1>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
                  <div className="flex items-center text-white text-3xl font-bold">
                    <Trophy size={40} className="mr-3 text-yellow-300" />
                    <p>Score: {marksObtained} / {total}</p>
                  </div>
                  <div className="flex items-center text-white text-5xl font-extrabold">
                    <Award size={50} className="mr-3 text-yellow-300 animate-pulse-slow" />
                    <p>{percentage}%</p>
                  </div>
                </div>
                <p className={`text-xl font-semibold mt-4 ${passed ? 'text-green-200' : 'text-red-200'}`}>
                  {passed ? "Congratulations! You passed!" : "Keep learning! You can do better next time."}
                </p>
              </div>

              {/* Questions Breakdown */}
              {questions.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center animate-fade-in delay-300">Detailed Review</h2>
                  {questions.map((q, i) => (
                    <article
                      key={q._id}
                      className={`rounded-lg p-5 border shadow-md animate-fade-in`}
                      style={{ animationDelay: `${0.2 + i * 0.1}s` }} // Staggered reveal
                    >
                      <p className="text-lg font-semibold text-gray-200 mb-4 leading-relaxed">
                        <span className="text-teal-400 mr-2">Q.{i + 1}.</span> {q.question}
                      </p>
                      <div className="space-y-3">
                        {q.options.map((opt, index) => {
                          const isCorrectOption = String(q.answer) === String(opt);
                          const isUserAnswer = String(q.usersAnswer) === String(opt);
                          const isWrongAnswerSelected = isUserAnswer && !isCorrectOption;

                          return (
                            <div
                              key={index}
                              className={`flex items-center p-2 rounded-md ${isCorrectOption ? 'bg-green-900/40' : ''} ${isWrongAnswerSelected ? 'bg-red-900/40' : ''}`}
                            >
                              <input
                                type="radio"
                                id={`option_${q._id}_${index}`}
                                name={`question_${q._id}`} // Name is still needed for radio group behavior even if disabled
                                value={opt}
                                className="form-radio h-5 w-5 text-teal-500 bg-gray-700 border-gray-600 cursor-not-allowed"
                                disabled // Disable interaction as this is a result page
                                checked={isUserAnswer || isCorrectOption} // Show user's answer OR correct answer
                              />
                              <label
                                htmlFor={`option_${q._id}_${index}`}
                                className={`ml-3 text-base cursor-not-allowed ${isCorrectOption ? 'text-green-400 font-bold' : isWrongAnswerSelected ? 'text-red-400 line-through' : 'text-gray-300'}`}
                              >
                                {opt}
                                {isCorrectOption && !isUserAnswer && ( // Show correct mark if user didn't select it
                                    <span className="ml-2 text-green-400"> (Correct)</span>
                                )}
                                {isUserAnswer && !isCorrectOption && ( // Show user's wrong answer mark
                                    <span className="ml-2 text-red-400"> (Your Answer)</span>
                                )}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700 text-sm">
                        <p className="font-medium flex items-center text-gray-300">
                          <Target size={16} className="mr-2 text-blue-400" />
                          Correct Answer: <span className="ml-1 text-green-400 font-semibold">{q.answer || "N/A"}</span>
                        </p>
                        <p className={`font-medium flex items-center mt-2 ${String(q.answer) === String(q.usersAnswer) ? 'text-green-500' : 'text-red-500'}`}>
                          {String(q.answer) === String(q.usersAnswer) ? (
                            <CheckCircle2 size={16} className="mr-2" />
                          ) : (
                            <XCircle size={16} className="mr-2" />
                          )}
                          Your Answer: <span className="ml-1 font-semibold">{q.usersAnswer || "Not Answered"}</span>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 text-xl py-10">
                  <p>No questions found for this test.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-red-400 text-xl py-20 bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Access Denied!</h2>
              <p className="mb-6">You are not authorized to view these results. Please ensure you are logged in to the correct account.</p>
              <Link to="/login" className="btn-primary inline-block">
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Result;