import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true,
  },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fullAddress: { type: String, required: true }
  },
  items: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    size: { type: String },
    color: { type: String }
  }],
  payment: {
    method: { 
      type: String, 
      required: true, 
      enum: ['cod', 'easypaisa', 'jazzcash'] 
    },
    receiptImage: { type: String },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: {
      code: { type: String },
      discountPercentage: { type: Number },
      promoCodeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PromoCode' 
      }
    }
  },
  shipping: {
    method: { 
      type: String, 
      required: true,
      enum: ['standard', 'express']
    },
    address: {
      street: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);