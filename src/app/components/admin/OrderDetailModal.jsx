"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Trash2, Check, Download, Eye, Tag, Clock, MapPin, Phone, Mail, User, Truck, CreditCard, Calendar } from 'lucide-react';

export default function OrderDetailModal({ order, onClose, onUpdateStatus, onDelete }) {
  const [viewReceipt, setViewReceipt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef(null);

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const handlePrint = () => {
    if (!printRef.current) {
      console.error("Print content reference is not available");
      return;
    }

    setIsPrinting(true);

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert("Please allow popups for this website to print the order details.");
      setIsPrinting(false);
      return;
    }

    const contentToPrint = printRef.current.innerHTML;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.orderId} - Print View</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              color: #1F2937;
              padding: 40px;
              background: #F9FAFB;
            }
            h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 12px;
              color: #111827;
            }
            h2 {
              font-size: 20px;
              font-weight: 600;
              margin-top: 24px;
              margin-bottom: 12px;
              color: #111827;
            }
            table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-bottom: 24px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            th {
              background: #F3F4F6;
              text-align: left;
              padding: 12px 16px;
              font-size: 13px;
              font-weight: 600;
              color: #4B5563;
              text-transform: uppercase;
              border-bottom: 1px solid #E5E7EB;
            }
            td {
              padding: 12px 16px;
              border-bottom: 1px solid #E5E7EB;
              background: #FFFFFF;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }
            .badge-pending { background: #FEF3C7; color: #92400E; }
            .badge-confirmed { background: #DBEAFE; color: #1E40AF; }
            .badge-shipped { background: #EDE9FE; color: #5B21B6; }
            .badge-delivered { background: #D1FAE5; color: #065F46; }
            .badge-cancelled { background: #FEE2E2; color: #B91C1C; }
            .info-section {
              margin-bottom: 24px;
              background: #FFFFFF;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            .text-right { text-align: right; }
            .total-row {
              font-weight: 700;
              border-top: 2px solid #374151;
              background: #F9FAFB;
            }
            .promo-tag {
              display: inline-block;
              padding: 4px 8px;
              background: #ECFDF5;
              color: #047857;
              border-radius: 6px;
              margin-right: 8px;
              font-size: 12px;
              font-weight: 600;
            }
            @media print {
              body {
                padding: 0;
                background: #FFFFFF;
                box-shadow: none;
              }
              button { display: none; }
              .info-section { box-shadow: none; }
              table { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div>
            <h1>Order #${order.orderId}</h1>
            <p>Date: ${formatDate(order.orderDate)}</p>
            <p>Status: <span class="badge badge-${order.status}">${order.status.toUpperCase()}</span></p>

            <h2>Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center">Quantity</th>
                  <th style="text-align: right">Price</th>
                  <th style="text-align: right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      ${item.name}
                      ${(item.size || item.color) ?
                        `<br><small style="color: #6B7280">${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' • ' : ''}${item.color ? `Color: ${item.color}` : ''}</small>`
                        : ''}
                    </td>
                    <td style="text-align: center">${item.quantity}</td>
                    <td style="text-align: right">${formatPrice(item.price)}</td>
                    <td style="text-align: right">${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right">Subtotal</td>
                  <td style="text-align: right">${formatPrice(order.payment.subtotal)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right">Shipping</td>
                  <td style="text-align: right">${formatPrice(order.payment.shipping)}</td>
                </tr>
                ${order.payment.discount > 0 ? `
                <tr>
                  <td colspan="3" style="text-align: right">
                    ${order.payment.promoCode && order.payment.promoCode.code ?
                      `Discount <span class="promo-tag">PROMO: ${order.payment.promoCode.code}</span>
                       ${order.payment.promoCode.discountPercentage ? `(${order.payment.promoCode.discountPercentage}% off)` : ''}` : 'Discount'}
                  </td>
                  <td style="text-align: right; color: #047857">-${formatPrice(order.payment.discount)}</td>
                </tr>` : ''}
                ${order.payment.tax > 0 ? `
                <tr>
                  <td colspan="3" style="text-align: right">Tax</td>
                  <td style="text-align: right">${formatPrice(order.payment.tax)}</td>
                </tr>` : ''}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right">Total</td>
                  <td style="text-align: right">${formatPrice(order.payment.total)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
              <div class="info-section">
                <h2>Customer Information</h2>
                <p><span class="info-label">Name:</span> ${order.customer.firstName} ${order.customer.lastName}</p>
                <p><span class="info-label">Email:</span> ${order.customer.email}</p>
                <p><span class="info-label">Phone:</span> ${order.customer.phone}</p>
              </div>

              <div class="info-section">
                <h2>Shipping Details</h2>
                <p><span class="info-label">Address:</span><br>${order.customer.fullAddress.replace(/\n/g, '<br>')}</p>
                <p>
                  <span class="info-label">Method:</span>
                  ${order.shipping.method === 'standard' ? 'Standard (5-7 days)' : 'Express (2-3 days)'}
                </p>
                <p><span class="info-label">Estimated Delivery:</span> ${formatDate(order.estimatedDeliveryDate)}</p>
              </div>

              <div class="info-section">
                <h2>Payment Information</h2>
                <p>
                  <span class="info-label">Payment Method:</span>
                  ${order.payment.method === 'cod' ? 'Cash on Delivery' :
                   order.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
                </p>
                ${order.payment.promoCode && order.payment.promoCode.code ? `
                <p><span class="info-label">Promo Code:</span> ${order.payment.promoCode.code}</p>
                <p><span class="info-label">Discount:</span> ${order.payment.promoCode.discountPercentage}%</p>
                ` : ''}
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const receiptVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
  };

  const handleDownloadReceipt = async () => {
    if (!order.payment.receiptImage) return;

    try {
      setIsDownloading(true);
      const response = await fetch(order.payment.receiptImage);
      if (!response.ok) {
        throw new Error('Failed to fetch receipt image');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${order.orderId}.png`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 z-40 backdrop-blur-md"
        onClick={onClose}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
      />

      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

          <motion.div
            className="inline-block bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all align-middle max-w-5xl w-full"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <X size={20} />
              </button>
            </div>

            <div ref={printRef} className="px-6 sm:px-8 py-6 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Order #{order.orderId}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-gray-500 text-sm flex items-center">
                      <Tag size={14} className="mr-1.5 text-gray-400" /> Order ID
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <Clock size={14} className="mr-1.5 text-gray-400" /> {formatDate(order.orderDate)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {isPrinting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Printing...
                      </>
                    ) : (
                      <>
                        <Printer size={16} className="mr-1.5" />
                        Print Order
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDelete(order)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    Delete Order
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                      <div className="mb-4 sm:mb-0">
                        <h4 className="text-lg font-semibold text-gray-900">Order Status</h4>
                        <p className="text-sm text-gray-500 mt-1">Last updated: {formatDate(order.orderDate)}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full border ${getStatusBadgeColor(order.status)} font-semibold text-sm tracking-wide`}>
                        {order.status.toUpperCase()}
                      </div>
                    </div>

                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Update Status:</p>
                        <div className="flex flex-wrap gap-3">
                          {order.status !== 'confirmed' && (
                            <button
                              onClick={() => onUpdateStatus(order.orderId, 'confirmed')}
                              className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <Check size={14} className="mr-1.5" />
                              Confirm Order
                            </button>
                          )}

                          {(order.status === 'confirmed' || order.status === 'pending') && (
                            <button
                              onClick={() => onUpdateStatus(order.orderId, 'shipped')}
                              className="inline-flex items-center px-4 py-2 border border-indigo-200 text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <Check size={14} className="mr-1.5" />
                              Mark Shipped
                            </button>
                          )}

                          {(order.status === 'shipped' || order.status === 'confirmed') && (
                            <button
                              onClick={() => onUpdateStatus(order.orderId, 'delivered')}
                              className="inline-flex items-center px-4 py-2 border border-emerald-200 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <Check size={14} className="mr-1.5" />
                              Mark Delivered
                            </button>
                          )}

                          <button
                            onClick={() => onUpdateStatus(order.orderId, 'cancelled')}
                            className="inline-flex items-center px-4 py-2 border border-rose-200 text-sm font-medium rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <X size={14} className="mr-1.5" />
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-5">Order Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Qty
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {order.items.map((item) => (
                            <tr key={`${item.id}-${item.size}-${item.color}`} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {item.image ? (
                                    <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden shadow-sm">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        className="object-cover"
                                        fill
                                        sizes="48px"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {item.size && `Size: ${item.size}`}
                                      {item.size && item.color && ' • '}
                                      {item.color && `Color: ${item.color}`}
                                      {item.customizable && (item.size || item.color) && ' • '}
                                      {item.customizable && (
                                        <span className="inline-flex items-center text-blue-600">
                                          Customizable
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                {item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                                {formatPrice(item.price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                              Subtotal
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                              {formatPrice(order.payment.subtotal)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                              Shipping
                            </td>
                            <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                              {formatPrice(order.payment.shipping)}
                            </td>
                          </tr>
                          {order.payment.discount > 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                                {order.payment.promoCode && order.payment.promoCode.code ? (
                                  <div className="flex items-center justify-end">
                                    <span>Discount</span>
                                    <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                      <Tag size={12} className="mr-1.5" />
                                      {order.payment.promoCode.code}
                                      {order.payment.promoCode.discountPercentage && (
                                        <span className="ml-1">({order.payment.promoCode.discountPercentage}%)</span>
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  "Discount"
                                )}
                              </td>
                              <td className="px-6 py-3 text-right text-sm font-semibold text-emerald-600">
                                -{formatPrice(order.payment.discount)}
                              </td>
                            </tr>
                          )}
                          {order.payment.tax > 0 && (
                            <tr>
                              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-600">
                                Tax
                              </td>
                              <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                                {formatPrice(order.payment.tax)}
                              </td>
                            </tr>
                          )}
                          <tr className="border-t-2 border-gray-200">
                            <td colSpan="3" className="px-6 py-3 text-right text-base font-bold text-gray-900">
                              Total
                            </td>
                            <td className="px-6 py-3 text-right text-base font-bold text-gray-900">
                              {formatPrice(order.payment.total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-5">
                      <User size={18} className="text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900">Customer Details</h4>
                    </div>
                    <div className="text-sm space-y-3">
                      <p className="font-semibold text-gray-900">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="text-gray-600 flex items-center">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {order.customer.email}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {order.customer.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-5">
                      <Truck size={18} className="text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900">Shipping Information</h4>
                    </div>
                    <div className="text-sm space-y-4">
                      <div>
                        <p className="font-semibold text-gray-700 mb-1 flex items-center">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          Address
                        </p>
                        <p className="text-gray-600 pl-6 whitespace-pre-line">{order.customer.fullAddress}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Method</p>
                        <p className="text-gray-600">
                          {order.shipping.method === 'standard'
                            ? 'Standard Shipping (5-7 days)'
                            : 'Express Shipping (2-3 days)'}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1 flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          Estimated Delivery
                        </p>
                        <p className="text-gray-600 pl-6">{formatDate(order.estimatedDeliveryDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-5">
                      <CreditCard size={18} className="text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900">Payment Details</h4>
                    </div>
                    <div className="text-sm space-y-4">
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Method</p>
                        <p className="text-gray-600">
                          {order.payment.method === 'cod' ? 'Cash on Delivery' :
                           order.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
                        </p>
                      </div>

                      {order.payment.promoCode && order.payment.promoCode.code && (
                        <div className="pt-2">
                          <p className="font-semibold text-gray-700 mb-2 flex items-center">
                            <Tag size={14} className="mr-2 text-gray-400" />
                            Promo Code
                          </p>
                          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                            <p className="font-semibold text-emerald-800">{order.payment.promoCode.code}</p>
                            {order.payment.promoCode.discountPercentage && (
                              <p className="text-emerald-600 text-xs mt-1">
                                {order.payment.promoCode.discountPercentage}% discount applied
                              </p>
                            )}
                            <p className="text-emerald-600 font-semibold mt-1">
                              Savings: {formatPrice(order.payment.discount)}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.payment.method !== 'cod' && order.payment.receiptImage && (
                        <div className="pt-2">
                          <p className="font-semibold text-gray-700 mb-2">Payment Receipt</p>
                          <button
                            onClick={() => setViewReceipt(true)}
                            className="inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <Eye size={16} className="mr-2" />
                            View Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {viewReceipt && order.payment.receiptImage && (
          <>
            <motion.div
              className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 z-50 backdrop-blur-md"
              onClick={() => setViewReceipt(false)}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
            >
              <motion.div
                className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
                variants={receiptVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Receipt</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownloadReceipt}
                      disabled={isDownloading}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 relative"
                      title="Download Receipt"
                    >
                      <Download size={18} className={`${isDownloading ? 'text-gray-400' : 'text-gray-600'}`} />
                      {isDownloading && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setViewReceipt(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                      title="Close"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="overflow-auto flex-1 flex items-center justify-center bg-gray-100 p-6">
                  <img
                    src={order.payment.receiptImage}
                    alt="Payment Receipt"
                    className="max-w-full max-h-[70vh] object-contain shadow-lg rounded-lg"
                  />
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    {order.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Payment Receipt for Order #{order.orderId}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
