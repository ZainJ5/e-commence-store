import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please provide the original price'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative']
  },
  category: {
    type: String,
    enum: ['tshirts', 'shirts', 'pants', 'jackets', 'dresses', 'shoes', 'accessories', ''],
    default: ''
  },
  size: {
    type: [String],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', ''],
    default: []
  },
  color: {
    type: [String],
    default: []
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'kids', 'unisex'],
    default: 'unisex'
  },
  image: {
    type: String
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Check if model already exists to prevent overwrite during hot reloads in development
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;