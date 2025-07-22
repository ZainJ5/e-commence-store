import { useState } from 'react';

export const useCheckoutForm = () => {
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  });

  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const standardShipping = 250;
  const expressShipping = 500;
  const freeShippingThreshold = 5000;

  const getShippingCost = (totalPrice) => {
    if (totalPrice >= freeShippingThreshold) return 0;
    return shippingMethod === 'standard' ? standardShipping : expressShipping;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleUploadClick = () => {
    document.getElementById('payment-receipt').click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCouponApply = () => {
    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'discount20') {
        const discountAmount = 0.2; // 20% discount
        setDiscount(discountAmount);
      } else if (couponCode.toLowerCase() === 'save50') {
        setDiscount(50);
      } else {
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const validateShippingForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!shippingInfo[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (shippingInfo.phone && !/^\d{10,11}$/.test(shippingInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    
    if (paymentMethod !== 'cod' && !uploadedImage) {
      newErrors.payment = 'Please upload a screenshot of your payment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    shippingInfo,
    setShippingInfo,
    errors,
    setErrors,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    uploadedImage,
    setUploadedImage,
    uploadPreview,
    setUploadPreview,
    couponCode,
    setCouponCode,
    discount,
    setDiscount,
    isApplyingCoupon,
    setIsApplyingCoupon,
    handleInputChange,
    handleUploadClick,
    handleFileChange,
    handleCouponApply,
    validateShippingForm,
    validatePaymentForm,
    getShippingCost,
  };
};