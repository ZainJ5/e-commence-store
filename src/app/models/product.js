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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: [true, 'Please select a type']
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
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (images) {
        return images.length <= 10;
      },
      message: 'Cannot upload more than 10 images per product'
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productTags: {
    type: [String],
    enum: ['new-arrival', 'featured', 'mr-shah-collection'],
    default: []
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;