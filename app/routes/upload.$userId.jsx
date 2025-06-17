import { Form, Link, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { questionPrompt } from "../../upload/gemini"; // Assuming gemini.js is correctly located
import { Buffer } from "buffer";
import Questions from "../../models/question.model";
import Users from "../../models/user.model";
import { getTokenFromCookie, getUserFromToken } from "../cookies.server";
import Header from "../components/Header";
import { UploadCloud, FileText, Clock, AlertCircle } from "lucide-react"; // Import Lucide icons

export const loader = async ({ params, request }) => {
  const userId = params.userId; // userId comes from route params or context if not a direct param
  // For the upload page, userId might not be in params directly from URL,
  // but retrieved from cookie to check verification.
  // Re-checking userId from token if not directly in params for robustness
  const token = await getTokenFromCookie(request);
  if (!token) return redirect("/logout");
  let id = await getUserFromToken(token);
  const isVerified = userId === id; // Use strict equality

  // If userId is not provided in params, ensure it's taken from the token
  const actualUserId = userId || id; // Use userId from params if present, else from token

  let user = await Users.findById(actualUserId);
  if (!user) {
    return redirect("/");
  }

  return Response.json({
    userId: actualUserId,
    isVerified,
  });
};

export const action = async ({ request }) => {
  if (request.method === "POST") {
    const fd = await request.formData();
    const file = fd.get("file");
    const userId = fd.get("userId");
    const testName = fd.get("testName");
    const time = fd.get("time");

    // Basic validation
    if (!file || !testName || !time || !userId) {
      return Response.json({ message: "All fields are required.", status: "error" }, { status: 400 });
    }
    if (file.size === 0) {
      return Response.json({ message: "Uploaded file is empty.", status: "error" }, { status: 400 });
    }
    if (isNaN(parseInt(time)) || parseInt(time) <= 0) {
      return Response.json({ message: "Time must be a positive number.", status: "error" }, { status: 400 });
    }

    const prevTest = await Questions.findOne({ testName, userId });
    if (prevTest) { // Check if any document exists with this testName for this user
      return Response.json({ message: "Test name must be unique for your quizzes.", status: "error" }, { status: 409 });
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileData = buffer.toString("base64");
      const resp = await questionPrompt(fileData, file.type);
      const result = JSON.parse(resp.text);

      if (!Array.isArray(result) || result.length === 0) {
        return Response.json({ message: "Could not extract questions from the file. Please try a different image.", status: "error" }, { status: 422 });
      }

      await Promise.all(
        result.map(async (res) => {
          const question = new Questions({
            question: res.question,
            options: res.options,
            answer: res.answer,
            userId,
            testName,
            time: parseInt(time) // Ensure time is stored as a number
          });
          await question.save();
        })
      );

      console.log("Questions uploaded and saved successfully.");
      return redirect(`/all-quiz/${userId}`);
    } catch (error) {
      console.error("Upload action failed:", error);
      return Response.json({ message: `Failed to process file: ${error.message}`, status: "error" }, { status: 500 });
    }
  }
  return null;
};

export default function UploadQuiz() {
  const { userId, isVerified } = useLoaderData();
  const actionData = useActionData(); // Renamed 'data' to 'actionData' for clarity

  return (
    <>
      <Header userId={userId} />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 flex items-center justify-center p-4 font-sans antialiased">
        <main className="w-full max-w-md animate-fade-in-up">
          <div className="bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out">
            <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center tracking-tight drop-shadow-lg animate-bounce-in">
              Upload New Quiz
            </h2>

            {isVerified ? (
              <Form method="post" encType="multipart/form-data" className="space-y-6">
                {/* Action message display */}
                {actionData?.message && (
                  <p className={`p-3 rounded-lg text-sm text-center font-medium animate-shake
                    ${actionData.status === "error" ? "bg-red-900 border border-red-600 text-red-100" : "bg-green-900 border border-green-600 text-green-100"}`}
                  >
                    <AlertCircle size={20} className="inline mr-2" />
                    {actionData.message}
                  </p>
                )}

                {/* File Input */}
                <div>
                  <label htmlFor="file" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
                    <UploadCloud size={20} className="mr-2 text-blue-400" /> Questions Photo (JPG, PNG)
                  </label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".jpg,.jpeg,.png" // Specify accepted file types
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200
                               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-teal-500 file:text-gray-900 hover:file:bg-teal-600"
                  />
                </div>

                {/* Test Name Input */}
                <div>
                  <label htmlFor="testName" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
                    <FileText size={20} className="mr-2 text-purple-400" /> Name Your Quiz
                  </label>
                  <input
                    type="text"
                    name="testName"
                    id="testName"
                    placeholder="e.g., Biology Basics, Chapter 1 Quiz"
                    required
                    className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-base shadow-inner"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label htmlFor="time" className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
                    <Clock size={20} className="mr-2 text-yellow-400" /> Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    name="time"
                    id="time"
                    placeholder="e.g., 30"
                    min="1" // Minimum time is 1 minute
                    required
                    className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-base shadow-inner"
                  />
                </div>

                <input type="hidden" name="userId" value={userId} />

                {/* Upload Button */}
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800
                             transition-all duration-300 ease-in-out text-lg shadow-lg transform hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  <UploadCloud size={24} className="mr-3" />
                  Upload Quiz
                </button>
              </Form>
            ) : (
              <div className="text-center text-red-400 text-xl py-10 bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-4">Access Denied!</h2>
                <p className="mb-6">You are not authorized to upload quizzes. Please ensure you are logged in.</p>
                <Link to="/login" className="btn-primary inline-block">
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}