import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    maxlength: [50, 'User name cannot be more than 50 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;