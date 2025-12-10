import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Building2, Award } from "lucide-react";
import gsap from "gsap";

// ✅ Import Google Fonts in your index.css or global.css
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Playfair+Display:wght@600;700&display=swap');

export default function Landing() {
  const features = [
    {
      title: "Aptitude Test",
      desc: "Know your strengths & skills.",
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Course Mapping",
      desc: "Find courses that fit your profile.",
      icon: <GraduationCap className="h-10 w-10 text-green-500" />,
    },
    {
      title: "Top Colleges",
      desc: "Get details about leading institutions.",
      icon: <Building2 className="h-10 w-10 text-indigo-500" />,
    },
    {
      title: "Scholarships",
      desc: "Discover opportunities to fund your studies.",
      icon: <Award className="h-10 w-10 text-yellow-500" />,
    },
  ];

  const steps = [
    "Take Aptitude Test",
    "Explore Courses",
    "Find Colleges",
    "Eligible Scholarships", // ✅ Changed here
  ];

  // GSAP Refs
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const buttonRef = useRef(null);

  const [visible, setVisible] = useState([]);
  const refs = useRef([]);
  refs.current = [];
  const addToRefs = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = document.querySelectorAll(".hero-letter");

      gsap.from(letters, {
        opacity: 0,
        y: 40,
        stagger: 0.05,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      gsap.from(heroImageRef.current, {
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(buttonRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "elastic.out(1,0.6)",
      });
    });

    // Intersection observer for features & steps
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((v) => [...v, entry.target.dataset.index]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    refs.current.forEach((ref) => observer.observe(ref));

    return () => ctx.revert();
  }, []);

  // Split heading into letters
  const renderAnimatedText = (text, gradient = false) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className={`hero-letter inline-block ${
          gradient
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            : "text-gray-900"
        }`}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <div className="font-['Poppins'] relative overflow-hidden bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-14 py-16 gap-10 bg-gradient-to-r from-blue-50/70 to-indigo-100/70 rounded-b-3xl shadow-lg">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 z-10 text-center md:text-left">
          <h1 className="leading-tight">
            <span className="font-['Poppins'] text-4xl md:text-5xl font-extrabold text-gray-900">
              {renderAnimatedText("Unlock Your ", true)}
            </span>
            <br />
            <span className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-indigo-800 italic">
              {renderAnimatedText("Future With Confidence")}
            </span>
          </h1>

          <p
            ref={heroTextRef}
            className="text-lg md:text-xl text-gray-700 mt-4 font-['Poppins']"
          >
            Explore your strengths, match with the right courses, and step into
            top colleges with clarity.
          </p>
          <div
            ref={buttonRef}
            className="flex justify-center md:justify-start space-x-4 mt-6"
          >
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-['Poppins']"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-['Poppins']"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="md:w-1/2 relative z-10">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Career Growth"
            className="rounded-3xl shadow-xl w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-14">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-['Playfair_Display']">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              ref={addToRefs}
              data-index={i}
              className={`backdrop-blur-md bg-white/50 rounded-3xl p-6 shadow-md transform transition duration-700 hover:scale-105 hover:shadow-xl opacity-0 ${
                visible.includes(i.toString())
                  ? "opacity-100 translate-y-0"
                  : "translate-y-10"
              }`}
            >
              <div className="mb-3 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900 text-center font-['Poppins']">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-center text-sm font-['Poppins']">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6 md:px-14 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 font-['Playfair_Display']">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={addToRefs}
              data-index={i + features.length}
              className={`flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-md transition transform hover:-translate-y-2 opacity-0 ${
                visible.includes((i + features.length).toString())
                  ? "opacity-100 translate-y-0"
                  : "translate-y-10"
              }`}
            >
              <div className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-lg mb-2 animate-bounce font-['Poppins']">
                {i + 1}
              </div>
              <p className="text-gray-700 font-medium text-sm font-['Poppins']">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-14 text-center bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-900 rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Playfair_Display']">
          Start Your Career Journey Today
        </h2>
        <Link
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition font-['Poppins']"
          to="/signup"
        >
          Join Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 py-6 text-center border-t border-gray-200 font-['Poppins']">
        &copy; 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}
