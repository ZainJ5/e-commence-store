import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CheckoutProgress = ({ activeStep }) => {
  return (
    <motion.div 
      className="flex justify-center mb-8 sm:mb-12 px-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <div className="relative flex items-center w-full max-w-md">
        <div className={`flex flex-col items-center ${activeStep === 'shipping' ? 'text-gray-900' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
            activeStep === 'shipping' 
              ? 'bg-black text-white' 
              : activeStep === 'payment' || activeStep === 'confirmation' 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-gray-100 text-gray-500'
          }`}>
            {activeStep === 'payment' || activeStep === 'confirmation' ? <Check size={14} /> : 
              <span className="text-xs sm:text-sm">1</span>}
          </div>
          <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">Shipping</span>
        </div>
        
        <div className="h-[1px] flex-grow mx-1 sm:mx-3 bg-gray-200"></div>
        
        <div className={`flex flex-col items-center ${activeStep === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
            activeStep === 'payment' 
              ? 'bg-black text-white' 
              : activeStep === 'confirmation' 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-gray-100 text-gray-500'
          }`}>
            {activeStep === 'confirmation' ? <Check size={14} /> : 
              <span className="text-xs sm:text-sm">2</span>}
          </div>
          <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">Payment</span>
        </div>
        
        <div className="h-[1px] flex-grow mx-1 sm:mx-3 bg-gray-200"></div>
        
        <div className={`flex flex-col items-center ${activeStep === 'confirmation' ? 'text-gray-900' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
            activeStep === 'confirmation' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className="text-xs sm:text-sm">3</span>
          </div>
          <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap">Confirmation</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutProgress;