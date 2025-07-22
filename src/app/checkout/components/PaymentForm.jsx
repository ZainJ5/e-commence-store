import { motion } from 'framer-motion';
import { Upload, AlertCircle, X } from 'lucide-react';

const PaymentForm = ({ 
  paymentMethod,
  setPaymentMethod,
  uploadedImage,
  uploadPreview,
  handleUploadClick,
  handleFileChange,
  handlePlaceOrder,
  isProcessing,
  errors,
  setUploadPreview,
  setUploadedImage,
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
        <h2 className="font-['serif'] text-xl text-gray-900 mb-6">Payment Method</h2>
        
        <div className="space-y-4">
          <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'cod' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
            <input
              type="radio"
              name="payment-method"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-black' : 'border border-gray-300'}`}>
                  {paymentMethod === 'cod' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 tracking-wide">Cash on Delivery</div>
                  <div className="text-xs text-gray-500 tracking-wide">Pay when you receive your order</div>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </label>
          
          <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'easypaisa' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
            <input
              type="radio"
              name="payment-method"
              value="easypaisa"
              checked={paymentMethod === 'easypaisa'}
              onChange={() => setPaymentMethod('easypaisa')}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'easypaisa' ? 'bg-black' : 'border border-gray-300'}`}>
                  {paymentMethod === 'easypaisa' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 tracking-wide">EasyPaisa</div>
                  <div className="text-xs text-gray-500 tracking-wide">Send payment to our account</div>
                </div>
              </div>
              <div className="flex items-center justify-center px-2 py-1 rounded text-xs font-medium bg-[#f0f8f2] text-[#3c7c45]">
                EasyPaisa
              </div>
            </div>
          </label>
          
          <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'jazzcash' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
            <input
              type="radio"
              name="payment-method"
              value="jazzcash"
              checked={paymentMethod === 'jazzcash'}
              onChange={() => setPaymentMethod('jazzcash')}
              className="sr-only"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'jazzcash' ? 'bg-black' : 'border border-gray-300'}`}>
                  {paymentMethod === 'jazzcash' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 tracking-wide">JazzCash</div>
                  <div className="text-xs text-gray-500 tracking-wide">Send payment to our account</div>
                </div>
              </div>
              <div className="flex items-center justify-center px-2 py-1 rounded text-xs font-medium bg-[#fbf0ed] text-[#b24a3c]">
                JazzCash
              </div>
            </div>
          </label>
        </div>
      </motion.div>
      
      {paymentMethod !== 'cod' && (
        <motion.div 
          className="bg-gray-50 rounded-md p-6 mb-8"
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <h2 className="font-['serif'] text-xl text-gray-900 mb-6">
            {paymentMethod === 'easypaisa' ? 'EasyPaisa Payment Details' : 'JazzCash Payment Details'}
          </h2>
          
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-4 h-4 text-gray-900 mr-2" />
              <p className="text-sm text-gray-900 font-medium tracking-wide">Please send payment to the following account:</p>
            </div>
            <div className="space-y-2 text-sm text-gray-600 tracking-wide pl-6">
              <p><span className="font-medium">Account Title:</span> Fashion Store</p>
              <p><span className="font-medium">Phone Number:</span> 0300-1234567</p>
              <p><span className="font-medium">Amount:</span> Total amount from your cart</p>
              <p><span className="font-medium">Reference:</span> Your Order ID will be generated after payment</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                Upload Payment Screenshot
              </label>
              
              <div 
                onClick={handleUploadClick}
                className={`border-2 border-dashed ${errors.payment ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md px-6 pt-5 pb-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-all duration-300`}
              >
                <input 
                  id="payment-receipt" 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleFileChange}
                />
                
                {!uploadPreview ? (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <p className="pl-1 tracking-wide">Click to upload payment screenshot</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <img 
                      src={uploadPreview} 
                      alt="Payment screenshot" 
                      className="mx-auto h-48 object-contain"
                    />
                    <div className="mt-2 text-center text-sm text-gray-500 tracking-wide">
                      {uploadedImage.name}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadPreview(null);
                        setUploadedImage(null);
                      }}
                      className="absolute top-0 right-0 bg-red-100 rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {errors.payment && (
                <p className="mt-2 text-sm text-red-600">{errors.payment}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div className="mt-8" variants={itemVariants}>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className={`w-full py-3 ${
            isProcessing 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800'
          } text-white rounded-md transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 uppercase tracking-widest text-sm`}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentForm;