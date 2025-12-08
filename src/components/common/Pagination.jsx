import React from 'react';
import Button from '../ui/Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      
      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;