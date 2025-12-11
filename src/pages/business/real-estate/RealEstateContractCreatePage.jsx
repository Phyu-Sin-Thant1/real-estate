import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers, listings, createContract } from '../../../mock/realEstateData';

const RealEstateContractCreatePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    phoneNumber: '',
    email: '',
    customerType: 'Buyer',
    existingCustomer: '',
    
    // Property / Listing
    listingId: '',
    
    // Contract Details
    contractType: 'Sale',
    contractStatus: 'Pending',
    contractDate: '',
    moveInDate: '',
    contractTermStart: '',
    contractTermEnd: '',
    contractTermMonths: '',
    
    // Price & Payment
    salePrice: '',
    deposit: '',
    monthlyRent: '',
    commission: '',
    
    // Notes and Attachments
    internalNotes: '',
    attachment: null
  });
  
  const [errors, setErrors] = useState({});
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Customer types
  const customerTypes = [
    { value: 'Buyer', label: 'Buyer' },
    { value: 'Tenant', label: 'Tenant' },
    { value: 'Seller', label: 'Seller' },
    { value: 'Landlord', label: 'Landlord' },
    { value: 'Other', label: 'Other' }
  ];
  
  // Contract types
  const contractTypes = [
    { value: 'Sale', label: 'Sale' },
    { value: 'Jeonse', label: 'Jeonse' },
    { value: 'Monthly rent', label: 'Monthly rent' },
    { value: 'Other', label: 'Other' }
  ];
  
  // Contract statuses
  const contractStatuses = [
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Pending', label: 'Pending' }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSelectCustomer = (customerId) => {
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerName: customer.name,
        phoneNumber: customer.phone,
        existingCustomer: customerId
      }));
    }
  };
  
  const handleSelectListing = (listingId) => {
    const listing = listings.find(l => l.id === parseInt(listingId));
    if (listing) {
      setSelectedListing(listing);
      setFormData(prev => ({
        ...prev,
        listingId: listingId
      }));
      
      // Clear error if exists
      if (errors.listingId) {
        setErrors(prev => ({
          ...prev,
          listingId: ''
        }));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Customer Information validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    // Property / Listing validation
    if (!formData.listingId) {
      newErrors.listingId = 'Listing is required';
    }
    
    // Contract Details validation
    if (!formData.contractType) {
      newErrors.contractType = 'Contract type is required';
    }
    
    if (!formData.contractDate) {
      newErrors.contractDate = 'Contract date is required';
    }
    
    // Price validation based on contract type
    if (formData.contractType === 'Sale') {
      if (!formData.salePrice) {
        newErrors.salePrice = 'Sale price is required for sale contracts';
      }
    } else if (formData.contractType === 'Jeonse') {
      if (!formData.deposit) {
        newErrors.deposit = 'Deposit is required for jeonse contracts';
      }
    } else if (formData.contractType === 'Monthly rent') {
      if (!formData.deposit && !formData.monthlyRent) {
        newErrors.deposit = 'Either deposit or monthly rent is required';
        newErrors.monthlyRent = 'Either deposit or monthly rent is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Prepare data for submission
        const contractData = {
          ...formData,
          propertyName: selectedListing ? selectedListing.name : '',
          type: formData.contractType,
          price: formData.salePrice || formData.deposit || formData.monthlyRent,
          status: formData.contractStatus,
          createdAt: new Date().toISOString()
        };
        
        // Call mock API
        const newContract = await createContract(contractData);
        console.log('Contract created:', newContract);
        
        // Show success message and redirect
        alert('Contract created successfully');
        navigate('/business/real-estate/contracts');
      } catch (error) {
        console.error('Error creating contract:', error);
        alert('Error creating contract. Please try again.');
      }
    }
  };
  
  const handleCancel = () => {
    navigate('/business/real-estate/contracts');
  };
  
  return (
    <div className="pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 계약 등록</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Existing Customer Selector */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose existing customer
              </label>
              <select
                value={formData.existingCustomer}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`w-full border ${errors.customerName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer type
              </label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                {customerTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Property / Listing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property / Listing</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Listing Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing <span className="text-red-500">*</span>
              </label>
              <select
                name="listingId"
                value={formData.listingId}
                onChange={(e) => handleSelectListing(e.target.value)}
                className={`w-full border ${errors.listingId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                <option value="">Select a listing</option>
                {listings.map(listing => (
                  <option key={listing.id} value={listing.id}>
                    {listing.name} - {listing.region}
                  </option>
                ))}
              </select>
              {errors.listingId && (
                <p className="mt-1 text-sm text-red-600">{errors.listingId}</p>
              )}
            </div>
            
            {/* Read-only listing details */}
            {selectedListing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Listing Type</p>
                  <p className="font-medium">{selectedListing.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedListing.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction Type</p>
                  <p className="font-medium">{selectedListing.transactionType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">{selectedListing.price}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contract Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contract Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract type <span className="text-red-500">*</span>
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                className={`w-full border ${errors.contractType ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              >
                {contractTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.contractType && (
                <p className="mt-1 text-sm text-red-600">{errors.contractType}</p>
              )}
            </div>
            
            {/* Contract Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract status
              </label>
              <select
                name="contractStatus"
                value={formData.contractStatus}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                {contractStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Contract Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleInputChange}
                className={`w-full border ${errors.contractDate ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
              />
              {errors.contractDate && (
                <p className="mt-1 text-sm text-red-600">{errors.contractDate}</p>
              )}
            </div>
            
            {/* Move-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Move-in date
              </label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            {/* Contract Term Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract term start
              </label>
              <input
                type="date"
                name="contractTermStart"
                value={formData.contractTermStart}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            {/* Contract Term End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract term end
              </label>
              <input
                type="date"
                name="contractTermEnd"
                value={formData.contractTermEnd}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            {/* Contract Term Months */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract term (months)
              </label>
              <input
                type="number"
                name="contractTermMonths"
                value={formData.contractTermMonths}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Price & Payment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price & Payment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sale Price (shown for Sale contracts) */}
            {formData.contractType === 'Sale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.salePrice ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                />
                {errors.salePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
                )}
              </div>
            )}
            
            {/* Deposit (shown for Jeonse and Monthly rent) */}
            {(formData.contractType === 'Jeonse' || formData.contractType === 'Monthly rent') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit {formData.contractType === 'Jeonse' ? <span className="text-red-500">*</span> : ''}
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.deposit ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                />
                {errors.deposit && (
                  <p className="mt-1 text-sm text-red-600">{errors.deposit}</p>
                )}
              </div>
            )}
            
            {/* Monthly Rent (shown for Monthly rent) */}
            {formData.contractType === 'Monthly rent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly rent {formData.deposit ? '' : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.monthlyRent ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
                )}
              </div>
            )}
            
            {/* Commission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission / fee
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Notes and Attachments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes and Attachments</h2>
          
          <div className="space-y-4">
            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal notes
              </label>
              <textarea
                name="internalNotes"
                value={formData.internalNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment (PDF/images)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dabang-primary"
            >
              계약 저장
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RealEstateContractCreatePage;