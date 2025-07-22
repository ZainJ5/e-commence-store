import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ReviewForm({ productId, onReviewSubmitted, onClose }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: '',
    verifiedPurchase: false,
    productId
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment cannot be more than 1000 characters';
    }
    
    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text(); // Get response as text first
        
        // Try to parse as JSON, but handle if it's not valid JSON
        let errorMessage = 'Error submitting review';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use the raw text or a fallback message
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      // If response is ok, try to parse the JSON
      const responseText = await response.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText);
        throw new Error('Invalid response from server');
      }
      
      toast.success('Review submitted successfully!');
      if (onReviewSubmitted) onReviewSubmitted();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium font-['serif']">Write a Review</h2>
        <button
          onClick={onClose}
          type="button"
          className="text-gray-500 hover:text-black transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="text-2xl focus:outline-none"
              >
                <span className={`${formData.rating >= star ? 'text-black' : 'text-gray-300'}`}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={`w-full border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
            placeholder="Enter your name"
          />
          {errors.userName && (
            <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
            placeholder="Summarize your review"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Review Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className={`w-full border ${errors.comment ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
            placeholder="Share your experience with this product..."
          ></textarea>
          <div className="flex justify-between mt-1">
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.comment.length}/1000 characters
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verifiedPurchase"
            name="verifiedPurchase"
            checked={formData.verifiedPurchase}
            onChange={handleChange}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="verifiedPurchase" className="ml-2 block text-sm text-gray-700">
            I have purchased this product
          </label>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}