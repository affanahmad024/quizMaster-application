import { Form, Link, redirect, useActionData } from '@remix-run/react'
import Users from '../../models/user.model'

export const action = async ({ request }) => {
  const fd = await request.formData()

  const email = fd.get("email")
  const password = fd.get("password")

  if (await Users.findOne({ email })) {
    return Response.json({ message: "User already exists with this email" })
  }

  const user = new Users({
    email,
    password,
  })
  await user.save()

  return redirect('/login')
}

const Register = () => {
  const data = useActionData()
  return (
    <>
      {/* Overall Dark Theme Background with subtle gradient */}
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 flex items-center justify-center p-4 font-sans antialiased">
        <main className="w-full max-w-md animate-fade-in-up">
          {/* Registration Card with modern styling */}
          <div className="bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300 ease-in-out">
            <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center tracking-tight drop-shadow-lg animate-bounce-in">
              Join QuizMaster
            </h2>

            <Form method="post" reloadDocument className="space-y-7">
              {data?.message && (
                <p className="bg-red-900 border border-red-600 text-red-100 p-4 rounded-lg text-sm text-center font-medium animate-shake">
                  {data.message}
                </p>
              )}

              {/* Email Input Group */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out text-base shadow-inner"
                />
              </div>

              {/* Password Input Group */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  required
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ease-in-out text-base shadow-inner"
                />
              </div>

              {/* Register Button with interactive animations */}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 ease-in-out text-lg shadow-lg transform hover:-translate-y-1 active:scale-95"
              >
                Register Account
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-400 mt-6 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-teal-400 hover:text-teal-500 font-semibold transition-all duration-200 ease-in-out hover:underline"
                >
                  Log In
                </Link>
              </p>
            </Form>
          </div>
        </main>
      </div>
    </>
  )
}

export default Register