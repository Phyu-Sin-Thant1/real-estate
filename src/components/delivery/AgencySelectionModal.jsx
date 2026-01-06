import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { getAllAgencies } from '../../mock/agencies';
import { deliveryServices } from '../../mock/deliveryServices';

const AgencySelectionModal = ({ isOpen, onClose, selectedPackage, onAgencySelect }) => {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);

  useEffect(() => {
    if (isOpen && selectedPackage) {
      // Get all moving agencies
      const allAgencies = getAllAgencies('moving');
      
      // Find agencies that offer services matching the selected package type
      const matchingAgencies = allAgencies.map(agency => {
        // Find services from this agency that match the package type
        const agencyServices = deliveryServices.filter(
          service => service.agencyId === agency.id && 
          service.serviceType === selectedPackage.id
        );
        
        if (agencyServices.length > 0) {
          // Use the first matching service's price, or default to package price
          const servicePrice = agencyServices[0].minPrice || selectedPackage.price;
          
          return {
            ...agency,
            servicePrice: servicePrice,
            serviceDetails: agencyServices[0].description || selectedPackage.description,
            serviceLimits: agencyServices[0].limitations 
              ? `Up to ${agencyServices[0].limitations.maxFloors || 'N/A'} floors, ${agencyServices[0].limitations.maxWeight || 'N/A'}kg`
              : selectedPackage.limits,
            serviceId: agencyServices[0].id
          };
        }
        return null;
      }).filter(Boolean);

      // If no agencies found, create mock agencies with the package price
      if (matchingAgencies.length === 0) {
        const mockAgencies = allAgencies.slice(0, 3).map((agency, index) => ({
          ...agency,
          servicePrice: selectedPackage.price + (index * 5000), // Vary price slightly
          serviceDetails: selectedPackage.description,
          serviceLimits: selectedPackage.limits,
          serviceId: `service-${agency.id}-${selectedPackage.id}`
        }));
        setAgencies(mockAgencies);
      } else {
        setAgencies(matchingAgencies);
      }
    }
  }, [isOpen, selectedPackage]);

  const formatPrice = (price) => {
    if (!price) return '₩0';
    if (price >= 10000) {
      return `₩${(price / 10000).toFixed(0)}만`;
    }
    return `₩${price.toLocaleString()}`;
  };

  const handleSelectAgency = (agency) => {
    setSelectedAgency(agency);
  };

  const handleConfirm = () => {
    if (selectedAgency) {
      // Call onAgencySelect which will handle closing this modal and opening the customization form
      onAgencySelect({
        ...selectedAgency,
        basePrice: selectedAgency.servicePrice
      });
      // Don't call onClose here - let onAgencySelect handle the modal transition
    }
  };

  if (!selectedPackage) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select Delivery Agency for ${selectedPackage.name}`}>
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          Choose a delivery agency from the list below. Each agency offers different pricing and service levels.
        </p>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {agencies.map((agency) => {
            const isSelected = selectedAgency?.id === agency.id;
            
            return (
              <div
                key={agency.id}
                onClick={() => handleSelectAgency(agency)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Agency Logo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={agency.logo}
                      alt={agency.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                    />
                    {agency.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Agency Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{agency.name}</h3>
                        {agency.rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(agency.rating) ? 'fill-current' : 'fill-none'}`}
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {agency.rating}/5
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-gray-700 mb-2">{agency.serviceDetails}</p>
                        {agency.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{agency.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
                          {formatPrice(agency.servicePrice)}
                        </div>
                      </div>
                    </div>

                    {/* Select Agency Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAgency(agency);
                      }}
                      className={`w-full mt-3 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select Agency'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedAgency}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            선택한 업체로 진행
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AgencySelectionModal;

