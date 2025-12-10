import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function EBooksCategory() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/resources/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error("Error fetching book details:", err));
  }, [id]);

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  };

  const pageTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.5,
  };

  if (!book) {
    return <p className="p-8 text-lg text-gray-500">Loading book details...</p>;
  }

  return (
    <motion.div
      className="p-8 max-w-3xl mx-auto"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Book Title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📖 {book.title}</h1>

      {/* Book Description */}
      {book.description && (
        <p className="mb-6 text-gray-700">
          <span className="font-semibold">Description:</span> {book.description}
        </p>
      )}

      {/* Open Book Button */}
      <a
        href={book.data} // make sure this is a full URL
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow hover:from-green-700 hover:to-green-500 transition"
      >
        📥 Open Book
      </a>
    </motion.div>
  );
}

