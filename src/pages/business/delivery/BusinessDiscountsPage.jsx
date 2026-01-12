import React, { useEffect, useState } from 'react';
import { loadDiscounts, addDiscount, updateDiscount, deleteDiscount, getDiscountsByPartner, seedMockDiscounts } from '../../../store/discountsStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { addApproval } from '../../../store/approvalsStore';
import DiscountCampaignForm from '../../../components/discounts/DiscountCampaignForm';
import Modal from '../../../components/common/Modal';
import { convertCampaignToLegacy, convertLegacyToCampaign } from '../../../lib/types/discountCampaign';

// TYPE_OPTIONS and APPLIES_TO_OPTIONS removed - using shared DiscountCampaignForm

const BusinessDiscountsPage = () => {
  const { user } = useUnifiedAuth();
  const [discounts, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  // Form state removed - using DiscountCampaignForm

  useEffect(() => {
    seedMockDiscounts();
    if (user?.email) {
      const partnerDiscounts = getDiscountsByPartner(user.email);
      // Also show global discounts (no partnerId)
      const globalDiscounts = loadDiscounts().filter((d) => !d.partnerId && (d.service === 'DELIVERY' || d.service === 'ALL'));
      const allDiscounts = [...partnerDiscounts, ...globalDiscounts];
      // Remove duplicates
      const uniqueDiscounts = Array.from(new Map(allDiscounts.map(d => [d.id, d])).values());
      setDiscounts(uniqueDiscounts);
    }
  }, [user?.email]);

  const handleOpenModal = (discount = null) => {
    if (discount && (discount.partnerId === user?.email || discount.createdBy === user?.email)) {
      setEditingDiscount(discount);
    } else {
      setEditingDiscount(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
  };

  const handleSubmit = (campaignData) => {
    // Convert new schema to legacy format for store
    const legacyData = convertCampaignToLegacy(campaignData);
    
    // Add delivery-specific fields
    const discountData = {
      ...legacyData,
      code: legacyData.code || `DEL-${Date.now()}`,
      name: legacyData.title,
      service: 'DELIVERY',
      status: 'PENDING', // Business partners need admin approval
      partnerId: user?.email,
      createdBy: user?.email || '',
    };

    if (editingDiscount) {
      updateDiscount(editingDiscount.id, discountData);
      // If updating, create approval request
      addApproval({
        id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'DISCOUNT_UPDATE',
        entityId: editingDiscount.id,
        entityType: 'DISCOUNT',
        status: 'PENDING',
        submittedBy: user?.email,
        submittedAt: new Date().toISOString(),
        metadata: {
          code: discountData.code,
          name: discountData.name,
        },
      });
    } else {
      const newDiscount = addDiscount(discountData);
      // Create approval request for new discount
      if (newDiscount && newDiscount[0]) {
        addApproval({
          id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'DISCOUNT_CREATE',
          entityId: newDiscount[0].id,
          entityType: 'DISCOUNT',
          status: 'PENDING',
          submittedBy: user?.email,
          submittedAt: new Date().toISOString(),
          metadata: {
            code: discountData.code,
            name: discountData.name,
          },
        });
      }
    }

    // Refresh discounts
    if (user?.email) {
      const partnerDiscounts = getDiscountsByPartner(user.email);
      const globalDiscounts = loadDiscounts().filter((d) => !d.partnerId && (d.service === 'DELIVERY' || d.service === 'ALL'));
      const allDiscounts = [...partnerDiscounts, ...globalDiscounts];
      const uniqueDiscounts = Array.from(new Map(allDiscounts.map(d => [d.id, d])).values());
      setDiscounts(uniqueDiscounts);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const discount = discounts.find((d) => d.id === id);
    if (!discount) return;
    
    // Only allow deletion of own discounts
    if (discount.partnerId !== user?.email && discount.createdBy !== user?.email) {
      alert('자신이 생성한 쿠폰만 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('정말 이 쿠폰을 삭제하시겠습니까?')) {
      deleteDiscount(id);
      if (user?.email) {
        const partnerDiscounts = getDiscountsByPartner(user.email);
        const globalDiscounts = loadDiscounts().filter((d) => !d.partnerId && (d.service === 'DELIVERY' || d.service === 'ALL'));
        const allDiscounts = [...partnerDiscounts, ...globalDiscounts];
        const uniqueDiscounts = Array.from(new Map(allDiscounts.map(d => [d.id, d])).values());
        setDiscounts(uniqueDiscounts);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: 'bg-green-100 text-green-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      DISABLED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
    const labels = {
      ACTIVE: '활성',
      SCHEDULED: '예정',
      EXPIRED: '만료',
      DISABLED: '비활성',
      PENDING: '승인 대기중',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || badges.DISABLED}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const found = TYPE_OPTIONS.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const formatValue = (type, value) => {
    if (type === 'PERCENT') return `${value}%`;
    if (type === 'FIXED') return `₩${value.toLocaleString()}`;
    if (type === 'FREE_DELIVERY') return '무료 배송';
    return value;
  };

  const formatDateRange = (startAt, endAt) => {
    if (!startAt && !endAt) return '무제한';
    const start = startAt ? new Date(startAt).toLocaleDateString('ko-KR') : '시작일 없음';
    const end = endAt ? new Date(endAt).toLocaleDateString('ko-KR') : '종료일 없음';
    return `${start} ~ ${end}`;
  };

  const canEdit = (discount) => {
    return discount.partnerId === user?.email || discount.createdBy === user?.email;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">할인/쿠폰</h1>
          <p className="text-gray-600 mt-1">할인 쿠폰을 생성하고 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          쿠폰 추가
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">전체 쿠폰</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{discounts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">활성 쿠폰</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {discounts.filter((d) => d.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">승인 대기중</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {discounts.filter((d) => d.status === 'PENDING').length}
          </p>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  코드
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  할인액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    쿠폰이 없습니다
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{discount.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{discount.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTypeLabel(discount.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatValue(discount.type, discount.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateRange(discount.startAt, discount.endAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(discount.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {canEdit(discount) ? (
                        <>
                          <button
                            onClick={() => handleOpenModal(discount)}
                            className="text-dabang-primary hover:text-dabang-primary/80"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(discount.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">읽기 전용</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingDiscount ? '쿠폰 수정' : '쿠폰 추가'}
          size="large"
        >
          <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-2 rounded">
            쿠폰 생성 후 관리자 승인이 필요합니다.
          </p>
          <DiscountCampaignForm
            mode={editingDiscount ? 'edit' : 'create'}
            initialValue={editingDiscount ? convertLegacyToCampaign(editingDiscount) : {}}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            showStatus={false}
            defaultScope="DELIVERY"
          />
        </Modal>
      )}
    </div>
  );
};

export default BusinessDiscountsPage;

