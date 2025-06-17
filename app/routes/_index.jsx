
import { useEffect } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CallToAction from "../components/CallToAction";
import { getTokenFromCookie, getUserFromToken } from "../cookies.server";
import { redirect, useLoaderData } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "QuizMaster App" },
    { name: "description", content: "Quiz yourself and master new topics with QuizMaster!" }, // Enhanced description
  ];
};

export const loader = async ({request}) => {
  const token = await getTokenFromCookie(request);
  console.log("token" , token)
  if (!token) return redirect("/logout"); // Consider redirecting to /login or /welcome if not logged in
  let id = await getUserFromToken(token);
  return Response.json({
    
    id
  })
}

export default function Index() {
  const { id} = useLoaderData()

  useEffect(() => {
    // Select all elements that should animate in
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el, index) => {
      // Add a staggered delay based on the element's order
      el.style.animationDelay = `${index * 0.1}s`; // Staggered animation
      el.classList.add('animate-fade-in'); // Trigger the animation
    });
  }, []);

  return (
    // Main container with dark theme, smooth text rendering, and a subtle gradient
    <div className="bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 min-h-screen flex flex-col font-sans antialiased overflow-hidden">
      <Header userId={id} />
      <main className="flex-grow"> {/* Added main tag for semantic structure */}
        <HeroSection />
        <FeaturesSection />
        <CallToAction userId={id}/>
      </main>
      {/* Optional: Add a subtle footer here for completeness if needed later */}
    </div>
  );
}