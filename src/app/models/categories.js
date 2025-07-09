import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name must be less than 100 characters']
  }
}, {
  timestamps: true
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
