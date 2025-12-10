import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// 🔹 Gradient Icons by Stream
const GradientIcons = {
  Science: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center animate-pulse">
      <span className="text-white font-bold">🧪</span>
    </div>
  ),
  Commerce: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center animate-pulse">
      <span className="text-white font-bold">💼</span>
    </div>
  ),
  Arts: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
      <span className="text-white font-bold">🎨</span>
    </div>
  ),
  Default: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center animate-pulse">
      <span className="text-white font-bold">📘</span>
    </div>
  ),
};

export default function EBooks() {
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/resources")
      .then((res) => res.json())
      .then((data) => setEbooks(Array.isArray(data) ? data : [data]))
      .catch((err) => console.error("Error fetching eBooks:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-[Poppins]">
      {/* --- Header Banner --- */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 text-center shadow-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="flex justify-center items-center gap-3 text-4xl md:text-5xl font-extrabold">
            <span className="animate-bounce">📚</span>
            Explore E-Books
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            Read, learn, and grow with a wide collection of digital books across multiple domains.
          </p>
        </div>
      </section>

      {/* --- Main Content --- */}
      <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {ebooks.length === 0 ? (
            <p className="text-center text-gray-500">No e-books available.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {ebooks.map((book) => (
                <motion.div
                  key={book._id}
                  className="relative p-8 bg-white rounded-2xl shadow-md border border-gray-200
                  hover:shadow-2xl hover:scale-[1.03] transition transform flex flex-col justify-between overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  {/* Glow Background */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    {GradientIcons[book.stream] || GradientIcons.Default}
                    <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>

                  <div className="flex mt-4 relative z-10">
                    <a
                      href={book.data} // Make sure this is a full URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-5 py-3 text-base rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition text-center"
                    >
                      View E-Book
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white text-gray-600 text-center py-4 border-t border-gray-200 shadow-inner mt-auto">
        &copy; 2025 Career Website. All rights reserved.
      </footer>
    </div>
  );
}
