import { motion } from 'framer-motion';

const ShippingForm = ({ 
  shippingInfo, 
  handleInputChange, 
  errors, 
  shippingMethod,
  setShippingMethod,
  handleContinueToPayment,
  containerVariants,
  itemVariants 
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-gray-50 rounded-md p-6 mb-8"
        variants={itemVariants}
      >
        <h2 className="font-['serif'] text-xl text-gray-900 mb-6">Contact Information</h2>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-gray-50 rounded-md p-6 mb-8"
        variants={itemVariants}
      >
        <h2 className="font-['serif'] text-xl text-gray-900 mb-6">Shipping Address</h2>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
              Street address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 sm:text-sm border ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
              Apartment, suite, etc. (optional)
            </label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={shippingInfo.apartment}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
              />
            </div>
            
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                ZIP / Postal
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 sm:text-sm border ${
                  errors.zipCode ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
            >
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-gray-50 rounded-md p-6 mb-8"
        variants={itemVariants}
      >
        <h2 className="font-['serif'] text-xl text-gray-900 mb-6">Shipping Method</h2>
        
        <div className="space-y-4">
          <label className={`relative flex p-4 cursor-pointer border ${shippingMethod === 'standard' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
            <input
              type="radio"
              name="shipping-method"
              value="standard"
              checked={shippingMethod === 'standard'}
              onChange={() => setShippingMethod('standard')}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${shippingMethod === 'standard' ? 'bg-black' : 'border border-gray-300'}`}>
                  {shippingMethod === 'standard' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 tracking-wide">Standard Shipping</div>
                  <div className="text-xs text-gray-500 tracking-wide">5-7 business days</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                Rs 250
              </div>
            </div>
          </label>
          
          <label className={`relative flex p-4 cursor-pointer border ${shippingMethod === 'express' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
            <input
              type="radio"
              name="shipping-method"
              value="express"
              checked={shippingMethod === 'express'}
              onChange={() => setShippingMethod('express')}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${shippingMethod === 'express' ? 'bg-black' : 'border border-gray-300'}`}>
                  {shippingMethod === 'express' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 tracking-wide">Express Shipping</div>
                  <div className="text-xs text-gray-500 tracking-wide">2-3 business days</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                Rs 500
              </div>
            </div>
          </label>
        </div>
      </motion.div>
      
      <motion.div className="mt-8" variants={itemVariants}>
        <button
          type="button"
          onClick={handleContinueToPayment}
          className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 uppercase tracking-widest text-sm"
        >
          Continue to Payment
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ShippingForm;