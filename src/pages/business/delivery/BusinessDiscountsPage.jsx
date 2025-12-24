import React, { useEffect, useState } from 'react';
import { loadDiscounts, addDiscount, updateDiscount, deleteDiscount, getDiscountsByPartner, seedMockDiscounts } from '../../../store/discountsStore';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { addApproval } from '../../../store/approvalsStore';

const TYPE_OPTIONS = [
  { value: 'PERCENT', label: '퍼센트 할인' },
  { value: 'FIXED', label: '고정 금액 할인' },
  { value: 'FREE_DELIVERY', label: '무료 배송' },
];

const APPLIES_TO_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'ORDER', label: '주문' },
];

const BusinessDiscountsPage = () => {
  const { user } = useUnifiedAuth();
  const [discounts, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'PERCENT',
    value: 0,
    minSpend: '',
    maxDiscount: '',
    appliesTo: 'ALL',
    appliesToIds: '',
    startAt: '',
    endAt: '',
  });

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
      setForm({
        code: discount.code || '',
        name: discount.name || '',
        type: discount.type || 'PERCENT',
        value: discount.value || 0,
        minSpend: discount.minSpend || '',
        maxDiscount: discount.maxDiscount || '',
        appliesTo: discount.appliesTo || 'ALL',
        appliesToIds: discount.appliesToIds ? discount.appliesToIds.join(', ') : '',
        startAt: discount.startAt ? discount.startAt.split('T')[0] : '',
        endAt: discount.endAt ? discount.endAt.split('T')[0] : '',
      });
    } else {
      setEditingDiscount(null);
      setForm({
        code: '',
        name: '',
        type: 'PERCENT',
        value: 0,
        minSpend: '',
        maxDiscount: '',
        appliesTo: 'ALL',
        appliesToIds: '',
        startAt: '',
        endAt: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
    setForm({
      code: '',
      name: '',
      type: 'PERCENT',
      value: 0,
      minSpend: '',
      maxDiscount: '',
      appliesTo: 'ALL',
      appliesToIds: '',
      startAt: '',
      endAt: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const discountData = {
      code: form.code.toUpperCase().trim(),
      name: form.name.trim(),
      service: 'DELIVERY',
      type: form.type,
      value: Number(form.value),
      minSpend: form.minSpend ? Number(form.minSpend) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      appliesTo: form.appliesTo,
      appliesToIds: form.appliesToIds
        ? form.appliesToIds.split(',').map((id) => id.trim()).filter(Boolean)
        : undefined,
      startAt: form.startAt ? `${form.startAt}T00:00:00` : null,
      endAt: form.endAt ? `${form.endAt}T23:59:59` : null,
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingDiscount ? '쿠폰 수정' : '쿠폰 추가'}
            </h3>
            <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-2 rounded">
              쿠폰 생성 후 관리자 승인이 필요합니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">코드 *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="WELCOME10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="신규 가입 10% 할인"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">타입 *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">할인 값 *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최소 구매액</label>
                  <input
                    type="number"
                    value={form.minSpend}
                    onChange={(e) => setForm({ ...form, minSpend: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">최대 할인액</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">적용 대상</label>
                <select
                  value={form.appliesTo}
                  onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  {APPLIES_TO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {form.appliesTo !== 'ALL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    적용 대상 ID (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={form.appliesToIds}
                    onChange={(e) => setForm({ ...form, appliesToIds: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="id1, id2, id3"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input
                    type="date"
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dabang-primary hover:bg-dabang-primary/90"
                >
                  {editingDiscount ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDiscountsPage;

