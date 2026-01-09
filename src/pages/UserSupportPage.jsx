import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { createTicket } from '../store/supportTicketsStore';
import { userOrders } from '../mock/userOrders';
import { supportListings } from '../mock/realEstateData';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/delivery/Toast';
import { 
  supportDomains, 
  getCategoriesForDomain, 
  isComplaintCategory 
} from '../lib/config/supportCategories';

const UserSupportPage = () => {
  const { isAuthenticated, isUser, user } = useUnifiedAuth();
  const navigate = useNavigate();
  
  // Form state
  const [domain, setDomain] = useState('');
  const [serviceContext, setServiceContext] = useState('DELIVERY'); // 'DELIVERY' | 'MOVING' (only for DELIVERY domain)
  const [category, setCategory] = useState('');
  const [referenceType, setReferenceType] = useState(null); // 'ORDER' | 'PROPERTY' | 'CONTRACT' | 'PAYMENT' | null
  const [referenceId, setReferenceId] = useState('');
  const [orderNumberInput, setOrderNumberInput] = useState(''); // For manual order number entry
  const [paymentTransactionId, setPaymentTransactionId] = useState(''); // For PAYMENT manual transaction ID
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  // UI state
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // Data state
  const [allOrders, setAllOrders] = useState([]); // Combined delivery + moving orders
  const [realEstateProperties, setRealEstateProperties] = useState([]);
  const [realEstateContracts, setRealEstateContracts] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !isUser) {
      navigate('/login', { replace: true, state: { from: '/support' } });
    }
  }, [isAuthenticated, isUser, navigate]);

  // Load user data based on domain
  useEffect(() => {
    // Mock API calls - in real app, these would be actual API calls
    if (domain === 'DELIVERY') {
      // GET /me/orders?domain=DELIVERY and GET /me/orders?domain=MOVING
      // For now, use mock data that includes both delivery and moving orders
      setAllOrders(userOrders); // userOrders already contains both delivery and moving orders
    } else if (domain === 'REAL_ESTATE') {
      // GET /me/real-estate/favorites
      setRealEstateProperties(supportListings);
      // GET /me/real-estate/contracts (mock - would come from API)
      setRealEstateContracts([]);
    }
  }, [domain]);

  // Reset form when domain changes
  useEffect(() => {
    setServiceContext('DELIVERY'); // Reset to default
    setCategory('');
    setReferenceType(null);
    setReferenceId('');
    setOrderNumberInput('');
    setPaymentTransactionId('');
    setMessage('');
    setErrors({});
  }, [domain]);

  // Reset category-dependent fields when category changes
  useEffect(() => {
    setReferenceType(null);
    setReferenceId('');
    setOrderNumberInput('');
    setPaymentTransactionId('');
    setErrors({});
  }, [category]);

  // Filter orders based on serviceContext when DELIVERY domain
  const filteredOrders = useMemo(() => {
    if (domain !== 'DELIVERY') return [];
    // In a real app, this would filter based on order type/domain
    // For now, return all orders (they're already mixed in userOrders)
    return allOrders;
  }, [domain, allOrders, serviceContext]);

  // Get available categories for current domain
  const availableCategories = useMemo(() => {
    if (!domain) return [];
    return getCategoriesForDomain(domain).map(cat => ({
      value: cat.value,
      label: cat.label
    }));
  }, [domain]);

  // Check if current category is a complaint
  const isComplaint = useMemo(() => {
    if (!domain || !category) return false;
    return isComplaintCategory(domain, category);
  }, [domain, category]);

  // Get minimum message length
  const minMessageLength = useMemo(() => {
    return isComplaint ? 30 : 10;
  }, [isComplaint]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!domain) {
      newErrors.domain = '이슈 유형을 선택해주세요.';
    }

    if (!category) {
      newErrors.category = '이슈 카테고리를 선택해주세요.';
    }

    // Complaint validation: require reference
    if (isComplaint) {
      if (domain === 'DELIVERY') {
        if (!referenceId && !orderNumberInput) {
          newErrors.referenceId = '불만 접수는 관련 번호(주문/예약)가 필요합니다.';
        }
      } else if (domain === 'REAL_ESTATE') {
        if (!referenceType || !referenceId) {
          newErrors.referenceId = '불만 접수는 관련 번호(주문/예약)가 필요합니다.';
        }
      } else if (domain === 'PAYMENT') {
        if (!referenceId && !paymentTransactionId) {
          newErrors.referenceId = '불만 접수는 관련 번호(주문/예약)가 필요합니다.';
        }
      }
    }

    if (!message.trim()) {
      newErrors.message = '메시지를 입력해주세요.';
    } else if (message.trim().length < minMessageLength) {
      newErrors.message = `메시지는 최소 ${minMessageLength}자 이상 입력해주세요.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Determine reference type and ID
      let finalReferenceType = null;
      let finalReferenceId = null;
      let partnerId = null;
      let partnerName = null;

      if (domain === 'DELIVERY' && (referenceId || orderNumberInput)) {
        finalReferenceType = 'ORDER';
        finalReferenceId = referenceId || orderNumberInput;
        const order = filteredOrders.find(o => o.id === referenceId || o.orderNo === orderNumberInput);
        if (order) {
          partnerId = order.partnerId;
          partnerName = order.partnerName;
        }
      } else if (domain === 'REAL_ESTATE' && referenceType && referenceId) {
        finalReferenceType = referenceType === 'PROPERTY' ? 'PROPERTY' : 'CONTRACT';
        finalReferenceId = referenceId;
        if (referenceType === 'PROPERTY') {
          const property = realEstateProperties.find(p => p.id === referenceId);
          if (property) {
            partnerId = property.partnerId;
            partnerName = property.partnerName;
          }
        }
      } else if (domain === 'PAYMENT' && (referenceId || paymentTransactionId)) {
        finalReferenceType = 'PAYMENT';
        finalReferenceId = referenceId || paymentTransactionId;
      }

      const ticket = {
        id: `ticket-${Date.now()}`,
        createdBy: user?.email || 'unknown',
        role: 'USER',
        domain,
        serviceContext: domain === 'DELIVERY' ? serviceContext : undefined,
        category,
        isComplaint,
        referenceType: finalReferenceType,
        referenceId: finalReferenceId,
        partnerId,
        partnerName,
        subject: `[${domain}] ${category} - ${user?.name || 'User'}`,
        message: message.trim(),
        attachments: attachments.map(a => a.name),
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        internalNotes: []
      };

      // POST /support/tickets
      createTicket(ticket);

      // Show success toast
      setToast({
        isVisible: true,
        message: '접수가 완료되었습니다.',
        type: 'success'
      });

      // Reset form
      setDomain('');
      setServiceContext('DELIVERY');
      setCategory('');
      setReferenceType(null);
      setReferenceId('');
      setOrderNumberInput('');
      setPaymentTransactionId('');
      setMessage('');
      setAttachments([]);
      setErrors({});

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/mypage/support', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Error submitting ticket:', error);
      setToast({
        isVisible: true,
        message: '접수 중 오류가 발생했습니다. 다시 시도해주세요.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files.map(file => ({
      name: file.name,
      size: file.size,
      file
    })));
  };

  const isFormValid = useMemo(() => {
    if (!domain || !category || message.trim().length < minMessageLength) {
      return false;
    }
    
    // For complaints, require reference
    if (isComplaint) {
      if (domain === 'DELIVERY') {
        return !!(referenceId || orderNumberInput);
      } else if (domain === 'REAL_ESTATE') {
        return !!(referenceType && referenceId);
      } else if (domain === 'PAYMENT') {
        return !!(referenceId || paymentTransactionId);
      }
    }
    
    return true;
  }, [domain, category, message, minMessageLength, isComplaint, referenceId, orderNumberInput, paymentTransactionId, referenceType]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">지원 / 문의</h1>
              <p className="text-gray-600 mt-1">문의하실 유형과 내용을 작성해주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Domain */}
              <Select
                id="domain"
                label="이슈 유형"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                options={supportDomains.map(d => ({ value: d.value, label: d.label }))}
                placeholder="이슈 유형을 선택하세요"
                error={errors.domain}
              />

              {/* Service Context - DELIVERY only */}
              {domain === 'DELIVERY' && (
                <Select
                  id="serviceContext"
                  label="서비스 유형"
                  required
                  value={serviceContext}
                  onChange={(e) => setServiceContext(e.target.value)}
                  options={[
                    { value: 'DELIVERY', label: 'Delivery' },
                    { value: 'MOVING', label: 'Moving Service' }
                  ]}
                  placeholder="서비스 유형을 선택하세요"
                />
              )}

              {/* Issue Category */}
              {domain && (
                <Select
                  id="category"
                  label="이슈 카테고리"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={availableCategories}
                  placeholder="카테고리를 선택하세요"
                  error={errors.category}
                />
              )}

              {/* Related Reference - DELIVERY */}
              {domain === 'DELIVERY' && category && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    관련 주문 선택 {isComplaint && <span className="text-red-500">*</span>}
                  </label>
                  <Select
                    id="deliveryOrder"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    options={filteredOrders.map(order => ({
                      value: order.id,
                      label: `${order.orderNo} / ${order.pickup} → ${order.destination} / ${order.date}`
                    }))}
                    placeholder="주문을 선택하세요"
                    error={errors.referenceId}
                    required={isComplaint}
                  />
                  <div className="text-sm text-gray-500">
                    또는
                  </div>
                  <Input
                    id="orderNumber"
                    label="주문번호 직접 입력"
                    type="text"
                    value={orderNumberInput}
                    onChange={(e) => {
                      setOrderNumberInput(e.target.value);
                      setReferenceId(''); // Clear dropdown selection
                    }}
                    placeholder="주문번호를 입력하세요"
                    error={errors.referenceId && !referenceId ? errors.referenceId : null}
                  />
                </div>
              )}

              {/* Related Reference - REAL_ESTATE */}
              {domain === 'REAL_ESTATE' && category && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    관련 참조 {isComplaint && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex space-x-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="referenceType"
                        value="PROPERTY"
                        checked={referenceType === 'PROPERTY'}
                        onChange={(e) => {
                          setReferenceType(e.target.value);
                          setReferenceId('');
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">관련 매물</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="referenceType"
                        value="CONTRACT"
                        checked={referenceType === 'CONTRACT'}
                        onChange={(e) => {
                          setReferenceType(e.target.value);
                          setReferenceId('');
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">관련 계약/예약</span>
                    </label>
                  </div>
                  {referenceType === 'PROPERTY' && (
                    <Select
                      id="property"
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      options={realEstateProperties.map(prop => ({
                        value: prop.id,
                        label: `${prop.title} / ${prop.location} / ${prop.price}`
                      }))}
                      placeholder="매물을 선택하세요"
                      error={errors.referenceId}
                      required={isComplaint}
                    />
                  )}
                  {referenceType === 'CONTRACT' && (
                    <Select
                      id="contract"
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      options={realEstateContracts.length > 0 
                        ? realEstateContracts.map(contract => ({
                            value: contract.id,
                            label: `계약 #${contract.id} - ${contract.listing?.title || 'N/A'}`
                          }))
                        : [{ value: '', label: '계약 내역이 없습니다' }]
                      }
                      placeholder="계약을 선택하세요"
                      error={errors.referenceId}
                      required={isComplaint}
                      disabled={realEstateContracts.length === 0}
                    />
                  )}
                </div>
              )}

              {/* Related Reference - PAYMENT */}
              {domain === 'PAYMENT' && category && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    관련 결제 정보 {isComplaint && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    id="paymentTransactionId"
                    label="거래 ID 직접 입력"
                    type="text"
                    value={paymentTransactionId}
                    onChange={(e) => {
                      setPaymentTransactionId(e.target.value);
                      setReferenceId(''); // Clear dropdown selection if any
                    }}
                    placeholder="거래 ID 또는 주문/계약 번호를 입력하세요"
                    error={errors.referenceId && !paymentTransactionId ? errors.referenceId : null}
                    required={isComplaint}
                  />
                  <p className="text-xs text-gray-500">
                    결제 관련 불만 접수 시 거래 ID 또는 관련 주문/계약 번호를 입력해주세요.
                  </p>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메시지 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="문의 내용을 입력해주세요."
                />
                {errors.message && (
                  <p className="text-sm text-red-600">{errors.message}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {isComplaint 
                      ? '불만 접수는 최소 30자 이상 입력해주세요.'
                      : '최소 10자 이상 입력해주세요.'}
                  </p>
                  <p className={`text-xs ${message.length < minMessageLength ? 'text-red-500' : 'text-gray-500'}`}>
                    {message.length}/{minMessageLength}자
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  첨부 파일 (선택)
                  {isComplaint && <span className="text-xs text-gray-500 ml-2">권장: 스크린샷 또는 이미지</span>}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                />
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={!isFormValid || submitting}
                >
                  {submitting ? '제출 중...' : '제출'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default UserSupportPage;
