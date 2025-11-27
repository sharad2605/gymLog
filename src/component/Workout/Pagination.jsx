import React from "react";

const Pagination = ({ total, perPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8 gap-2">

      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg border text-sm font-medium
          ${currentPage === 1 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
            : "bg-gray-900 text-white hover:bg-gray-700"}
        `}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-2 rounded-lg border text-sm font-medium
            ${
              currentPage === num
                ? "bg-yellow-400 border-yellow-500 text-black font-bold"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg border text-sm font-medium
          ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-gray-700"}
        `}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;
