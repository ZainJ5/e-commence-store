import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewForm from './ReviewForm';
import { toast } from 'react-hot-toast';

export default function ReviewsSection({ productId }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewData, setReviewData] = useState({
    reviews: [],
    averageRating: 0,
    ratingPercentages: { 5: '0', 4: '0', 3: '0', 2: '0', 1: '0' },
    totalReviews: 0,
    loading: true,
    error: null
  });

  const fetchReviews = async () => {
    try {
      setReviewData(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/reviews/product/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReviewData({
          reviews: data.data.reviews,
          averageRating: data.data.averageRating,
          ratingPercentages: data.data.ratingPercentages,
          totalReviews: data.data.totalReviews,
          loading: false,
          error: null
        });
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch reviews'
      }));
      toast.error('Error loading reviews. Please try again.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  // Format date to be readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.3 } }
  };
  
  // Review item component to avoid code duplication
  const ReviewItem = ({ review }) => (
    <div className="py-8">
      <div className="flex justify-between mb-2">
        <p className="font-medium">{review.userName}</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${star <= review.rating ? 'text-black' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span>{formatDate(review.createdAt)}</span>
        {review.verifiedPurchase && (
          <>
            <span className="mx-2">•</span>
            <span className="text-green-600">Verified Purchase</span>
          </>
        )}
      </div>
      
      {review.title && (
        <p className="font-medium mb-2">{review.title}</p>
      )}
      
      <p className="text-sm leading-relaxed text-gray-700">{review.comment}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {reviewData.loading ? (
        <div className="flex flex-col items-center space-y-4 py-12">
          <div className="w-12 h-12 rounded-full border-4 border-black border-t-gray-200 animate-spin"></div>
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : reviewData.error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{reviewData.error}</p>
          <button
            onClick={fetchReviews}
            className="mt-4 text-black border-b border-black hover:text-gray-700"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-['Playfair_Display'] mb-4">{reviewData.averageRating}</div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(reviewData.averageRating) ? 'text-black' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">Based on {reviewData.totalReviews} review{reviewData.totalReviews !== 1 && 's'}</p>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm w-2">{rating}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mx-3">
                      <div 
                        className="bg-black h-2 rounded-full" 
                        style={{ width: `${reviewData.ratingPercentages[rating]}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-9">
                      {reviewData.ratingPercentages[rating]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-black text-white py-3 px-8 hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Write a Review
            </button>
          </div>
          
          {reviewData.reviews.length === 0 ? (
            <div className="text-center py-12 border-t border-gray-100">
              <h3 className="text-lg mb-2">Be the First to Review</h3>
              <p className="text-gray-500 mb-6">Share your thoughts with other customers</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-block bg-black text-white py-3 px-6 hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-widest"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <>
              {/* Show only the top 3 reviews initially */}
              <div className="divide-y">
                {reviewData.reviews.slice(0, 3).map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))}
              </div>
              
              {/* View All Reviews button (only if there are more than 3 reviews) */}
              {reviewData.reviews.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="inline-block bg-white text-black border border-black py-2 px-6 hover:bg-black hover:text-white transition-all duration-300 text-sm tracking-widest"
                  >
                    View All Reviews ({reviewData.totalReviews})
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-3xl my-8"
            >
              <ReviewForm 
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
                onClose={() => setShowReviewForm(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* All Reviews Modal */}
      <AnimatePresence>
        {showAllReviews && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] my-8"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-medium font-['Playfair_Display']">
                    All Reviews ({reviewData.totalReviews})
                  </h2>
                  <button
                    onClick={() => setShowAllReviews(false)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Scrollable reviews container */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 divide-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {reviewData.reviews.map((review) => (
                    <ReviewItem key={review._id} review={review} />
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-black text-white py-3 px-8 hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-widest"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}