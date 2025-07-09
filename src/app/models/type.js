import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a type name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Type name must be less than 100 characters']
  }
}, {
  timestamps: true
});

const Type = mongoose.models.Type || mongoose.model('Type', typeSchema);

export default Type;