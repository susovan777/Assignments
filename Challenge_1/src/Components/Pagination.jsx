import React from "react";
import { useState } from "react";

const Pagination = ({
  totalItems,
  itemPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }
  const prevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };
  
  const nextPage = () => {
    if (currentPage === pageNumbers.length) return;
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="pagination">
      <p>Page No : {currentPage}</p>
      <span className="nav_btn">
        <button onClick={() => prevPage()}>Prev</button>
        <p>-</p>
        <button onClick={() => nextPage()}>Next</button>
      </span>
      <p>Per Page : 10</p>
    </div>
  );
};

export default Pagination;
