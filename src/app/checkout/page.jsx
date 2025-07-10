"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useCartStore from '../stores/cartStores';
import Navbar from '../components/Navbar';
import OrderSummary from '../components/OrderSummary';
import Image from 'next/image';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  ThemeProvider,
  createTheme
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
  },
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout - would normally send to API
    router.push('/checkout/payment');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f0e6]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-medium text-black mb-6">Your Cart is Empty</h1>
            <p className="text-black mb-8">Add some items to your cart before checking out.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-[#f5f0e6]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-medium text-black mb-2">Checkout</h1>
            
            {/* Progress steps */}
            <div className="flex items-center mb-10">
              <div className="text-black text-sm">1. Cart</div>
              <div className="mx-3 text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="text-black font-medium text-sm">2. Checkout</div>
              <div className="mx-3 text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="text-black text-sm">3. Payment</div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div 
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Checkout Form */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 mb-8"
                variants={itemVariants}
              >
                <h2 className="text-xl font-medium text-black mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: '#000000' },
                      }}
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: '#000000' },
                      }}
                    />
                  </div>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{
                      style: { color: '#000000' },
                    }}
                  />
                  <TextField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{
                      style: { color: '#000000' },
                    }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: '#000000' },
                      }}
                    />
                    <TextField
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: '#000000' },
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                      label="ZIP / Postal Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        style: { color: '#000000' },
                      }}
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="country-select-label" style={{ color: '#000000' }}>Country</InputLabel>
                      <Select
                        labelId="country-select-label"
                        id="country-select"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        label="Country"
                      >
                        <MenuItem value="Pakistan">Pakistan</MenuItem>
                        <MenuItem value="India">India</MenuItem>
                        <MenuItem value="United States">United States</MenuItem>
                        <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mt-4"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
              
              {/* Order Items */}
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                variants={itemVariants}
              >
                <h2 className="text-xl font-medium text-black mb-6">Order Items ({totalItems})</h2>
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex items-center">
                      <div className="h-24 w-24 flex-shrink-0 bg-white rounded border border-gray-200 p-1">
                        <Image
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-6 flex-1">
                        <h3 className="text-base font-medium text-black">{item.name}</h3>
                        <p className="text-sm text-black">
                          Size: <span className="font-medium">{item.size}</span> • Color: <span className="font-medium">{item.color}</span>
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-black">Qty: {item.quantity}</span>
                          <span className="text-sm font-bold text-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Order Summary */}
              <div className="sticky top-6">
                <div className="bg-white rounded-lg shadow-md">
                  <OrderSummary showCoupon={true} isCheckoutPage={true} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}