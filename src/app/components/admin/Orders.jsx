"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';
import OrderDetailModal from './OrderDetailModal';
import ConfirmationDialog from './ConfirmationDialog';
import { Printer, Eye, Trash2, Search, Download } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const printRef = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        toast.error(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order_${selectedOrder?.orderId || 'Receipt'}`,
    onAfterPrint: () => toast.success('Receipt printed successfully!'),
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCloseDetails = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const confirmDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/orders/${selectedOrder.orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order');
      }

      setOrders(orders.filter(order => order.orderId !== selectedOrder.orderId));
      toast.success('Order deleted successfully!');
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setShowDeleteConfirmation(false);
      setSelectedOrder(null);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const data = await response.json();
      
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <p className="text-red-700">Error: {error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl text-black shadow-md overflow-hidden">
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <select
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredOrders.length}</span> orders
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? currentOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatPrice(order.payment.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.payment.method === 'cod' ? 'Cash on Delivery' : 
                   order.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {/* <button
                      onClick={() => {
                        setSelectedOrder(order);
                        handlePrint();
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-blue-50"
                      title="Print Receipt"
                    >
                      <Printer size={18} />
                    </button> */}
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => confirmDeleteOrder(order)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-50"
                      title="Delete Order"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found. Adjust your filters or try again.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOrders.length > ordersPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{' '}
                of <span className="font-medium">{filteredOrders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {[...Array(Math.ceil(filteredOrders.length / ordersPerPage))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === Math.ceil(filteredOrders.length / ordersPerPage)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          
          <div className="flex sm:hidden justify-between w-full">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
              className={`relative inline-flex items-center px-4 py-2 ml-3 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === Math.ceil(filteredOrders.length / ordersPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="hidden">
        <div ref={printRef}>
          {selectedOrder && (
            <div className="p-8 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">ShahBazar</h1>
                <p className="text-gray-500">Order Receipt</p>
              </div>
              
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg">Order ID: {selectedOrder.orderId}</h2>
                  <p className="text-gray-600">{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{selectedOrder.status.toUpperCase()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-2">Customer Information</h3>
                <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.phone}</p>
                <p>{selectedOrder.customer.fullAddress}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-2">Items</h3>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-center py-2">Quantity</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={`${item.id}-${item.size}-${item.color}`} className="border-b">
                        <td className="py-2">
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.size && `Size: ${item.size}`} 
                            {item.size && item.color && ' • '} 
                            {item.color && `Color: ${item.color}`}
                          </div>
                        </td>
                        <td className="text-center py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatPrice(item.price)}</td>
                        <td className="text-right py-2">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Shipping</span>
                  <span>{formatPrice(selectedOrder.payment.shipping)}</span>
                </div>
                {selectedOrder.payment.discount > 0 && (
                  <div className="flex justify-between mb-1">
                    <span>Discount</span>
                    <span>-{formatPrice(selectedOrder.payment.discount)}</span>
                  </div>
                )}
                {selectedOrder.payment.tax > 0 && (
                  <div className="flex justify-between mb-1">
                    <span>Tax</span>
                    <span>{formatPrice(selectedOrder.payment.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.payment.total)}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Payment & Shipping Details</h3>
                <p><span className="font-medium">Payment Method:</span> {
                  selectedOrder.payment.method === 'cod' ? 'Cash on Delivery' :
                  selectedOrder.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'
                }</p>
                <p><span className="font-medium">Shipping Method:</span> {
                  selectedOrder.shipping.method === 'standard' ? 'Standard (5-7 days)' : 'Express (2-3 days)'
                }</p>
                <p><span className="font-medium">Estimated Delivery Date:</span> {
                  formatDate(selectedOrder.estimatedDeliveryDate)
                }</p>
              </div>
              
              <div className="text-center mt-10 text-sm text-gray-500">
                <p>Thank you for shopping with ShahBazar!</p>
                <p>For any inquiries, please contact support@shahbazar.com</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showOrderDetail && selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder}
          onClose={handleCloseDetails}
          onUpdateStatus={handleUpdateStatus}
          onDelete={confirmDeleteOrder}
          onPrint={handlePrint}
        />
      )}

      {showDeleteConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to delete order ${selectedOrder?.orderId}? This action cannot be undone.`}
          onConfirm={handleDeleteOrder}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}