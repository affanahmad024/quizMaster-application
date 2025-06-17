import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import Questions from "../../models/question.model";
import Users from "../../models/user.model";
import { getTokenFromCookie, getUserFromToken } from "../cookies.server";
import { useEffect, useRef, useState } from "react";
import { Timer, Send } from "lucide-react"; // Import Lucide icons

export const loader = async ({ params, request }) => {
  const userId = params.userId;
  const testName = params.testName;

  let user = await Users.findById(userId);
  if (!user) {
    return redirect("/");
  }
  const token = await getTokenFromCookie(request);
  if (!token) {
    return redirect("/logout");
  }
  let id = await getUserFromToken(token);
  const isVerified = userId === id; // Use strict equality

  const questions = await Questions.find({ testName: testName, userId: userId });

  // If no questions or quiz not found for user, redirect back
  if (!questions || questions.length === 0) {
    console.warn(`No questions found for testName: ${testName} under userId: ${userId}`);
    return redirect(`/all-quiz/${userId}?error=quizNotFound`);
  }

  return Response.json({
    questions,
    isVerified,
    testName,
    userId,
  });
};

export const action = async ({ request }) => {
  const fd = await request.formData();
  const userId = fd.get("userId");
  const testName = fd.get("testName"); // Get testName from formData

  // Create an array to store updates
  const updates = [];

  for (let [key, value] of fd.entries()) {
    if (key.startsWith("question_")) {
      const questionId = key.split("_")[1];
      updates.push({
        questionId: questionId,
        usersAnswer: value,
      });
    }
  }

  // Use Promise.all to update all questions concurrently
  await Promise.all(
    updates.map(async (update) => {
      await Questions.findByIdAndUpdate(update.questionId, { usersAnswer: update.usersAnswer });
    })
  );
  console.log("Quiz answers updated.");

  // Redirect to the result page for the just completed quiz
  return redirect(`/result/${userId}/${testName}`);
};

const Quiz = () => {
  const { questions, isVerified, testName, userId } = useLoaderData();
  const formRef = useRef(null);
  // Initialize timeLeft from the first question's time, default to 15 minutes if not found
  const [timeLeft, setTimeLeft] = useState(questions[0]?.time ? questions[0].time * 60 : 15 * 60);

  useEffect(() => {
    // Only run the timer if there are questions and the user is verified
    if (!isVerified || questions.length === 0) {
      return;
    }

    if (timeLeft <= 0) {
      console.log("Time over! Submitting quiz.");
      if (formRef.current) {
        formRef.current.submit(); // Programmatically submit the form
      }
      // No need to redirect here, as the action will handle it after submission
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount or dependency change
  }, [timeLeft, userId, isVerified, questions.length]); // Added dependencies for useEffect

  // Format time for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 p-6 md:p-10 lg:p-12 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 md:p-8 animate-fade-in-up">
        {isVerified ? (
          <>
            {/* Quiz Header with Title and Timer */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
              <h1 className="text-3xl md:text-4xl font-extrabold text-teal-400 drop-shadow-md mb-4 sm:mb-0">
                Quiz: <span className="gradient-text">{testName}</span>
              </h1>
              <div className={`flex items-center text-xl font-bold px-4 py-2 rounded-full shadow-lg ${timeLeft <= 60 ? 'bg-red-800 text-red-100 animate-pulse' : 'bg-gray-700 text-gray-200'}`}>
                <Timer size={24} className="mr-2" />
                Time Left: {formattedTime}
              </div>
            </div>

            <Form method="post" reloadDocument ref={formRef} className="space-y-6">
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="testName" value={testName} /> {/* Pass testName for action */}

              {questions.length > 0 ? (
                questions.map((q, i) => (
                  <article
                    key={q._id}
                    className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-md animate-fade-in"
                    style={{ animationDelay: `${i * 0.15}s` }} // Staggered question reveal
                  >
                    <p className="text-lg font-semibold text-gray-200 mb-4 leading-relaxed">
                      <span className="text-teal-400 mr-2">Q.{i + 1}.</span> {q.question}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((opt, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`option_${q._id}_${index}`}
                            name={`question_${q._id}`}
                            value={opt}
                            required
                            className="form-radio h-5 w-5 text-teal-500 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:ring-offset-gray-800 checked:bg-teal-500 cursor-pointer"
                            // If a user has previously answered, pre-select it
                            // defaultChecked={q.usersAnswer === opt}
                          />
                          <label
                            htmlFor={`option_${q._id}_${index}`}
                            className="ml-3 text-gray-300 text-base cursor-pointer hover:text-white transition-colors duration-200"
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xl py-10">
                  <p>No questions found for this quiz.</p>
                  <Link to={`/upload/${userId}`} className="mt-4 inline-block btn-primary">
                    Upload new questions
                  </Link>
                </div>
              )}

              {questions.length > 0 && (
                <button
                  type="submit"
                  className="btn-primary w-full mt-8 py-3.5 text-lg flex items-center justify-center animate-bounce-in-small"
                >
                  <Send size={20} className="mr-2" />
                  Submit Quiz
                </button>
              )}
            </Form>
          </>
        ) : (
          <div className="text-center text-red-400 text-xl py-20 bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Access Denied!</h2>
            <p className="mb-6">You are not authorized to view this quiz. Please ensure you are logged in to the correct account.</p>
            <Link to="/login" className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;