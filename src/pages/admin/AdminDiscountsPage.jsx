import React, { useEffect, useState, useMemo } from 'react';
import { loadDiscounts, addDiscount, updateDiscount, deleteDiscount, getDiscountById, seedMockDiscounts } from '../../store/discountsStore';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

const SERVICE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'REAL_ESTATE', label: '부동산' },
  { value: 'DELIVERY', label: '배달' },
];

const TYPE_OPTIONS = [
  { value: 'PERCENT', label: '퍼센트 할인' },
  { value: 'FIXED', label: '고정 금액 할인' },
  { value: 'FREE_DELIVERY', label: '무료 배송' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'SCHEDULED', label: '예정' },
  { value: 'EXPIRED', label: '만료' },
  { value: 'DISABLED', label: '비활성' },
  { value: 'PENDING', label: '대기중' },
];

const APPLIES_TO_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'CATEGORY', label: '카테고리' },
  { value: 'LISTING', label: '매물' },
  { value: 'ORDER', label: '주문' },
];

const AdminDiscountsPage = () => {
  const { user } = useUnifiedAuth();
  const [discounts, setDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    service: 'ALL',
    search: '',
  });
  const [form, setForm] = useState({
    code: '',
    name: '',
    service: 'ALL',
    type: 'PERCENT',
    value: 0,
    minSpend: '',
    maxDiscount: '',
    appliesTo: 'ALL',
    appliesToIds: '',
    startAt: '',
    endAt: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    // Seed mock data on first load
    seedMockDiscounts();
    setDiscounts(loadDiscounts());
  }, []);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      if (filters.status !== 'ALL' && discount.status !== filters.status) return false;
      if (filters.type !== 'ALL' && discount.type !== filters.type) return false;
      if (filters.service !== 'ALL' && discount.service !== filters.service) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !discount.code.toLowerCase().includes(searchLower) &&
          !discount.name.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [discounts, filters]);

  const kpiStats = useMemo(() => {
    const now = new Date();
    return {
      active: discounts.filter((d) => {
        if (d.status !== 'ACTIVE') return false;
        const startAt = d.startAt ? new Date(d.startAt) : null;
        const endAt = d.endAt ? new Date(d.endAt) : null;
        if (startAt && now < startAt) return false;
        if (endAt && now > endAt) return false;
        return true;
      }).length,
      scheduled: discounts.filter((d) => {
        if (d.status !== 'SCHEDULED') return false;
        const startAt = d.startAt ? new Date(d.startAt) : null;
        return startAt && now < startAt;
      }).length,
      expired: discounts.filter((d) => {
        if (d.status === 'EXPIRED') return true;
        const endAt = d.endAt ? new Date(d.endAt) : null;
        return endAt && now > endAt;
      }).length,
      totalRedemptions: 0, // Mock - would come from redemption tracking
    };
  }, [discounts]);

  const handleOpenModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setForm({
        code: discount.code || '',
        name: discount.name || '',
        service: discount.service || 'ALL',
        type: discount.type || 'PERCENT',
        value: discount.value || 0,
        minSpend: discount.minSpend || '',
        maxDiscount: discount.maxDiscount || '',
        appliesTo: discount.appliesTo || 'ALL',
        appliesToIds: discount.appliesToIds ? discount.appliesToIds.join(', ') : '',
        startAt: discount.startAt ? discount.startAt.split('T')[0] : '',
        endAt: discount.endAt ? discount.endAt.split('T')[0] : '',
        status: discount.status || 'ACTIVE',
      });
    } else {
      setEditingDiscount(null);
      setForm({
        code: '',
        name: '',
        service: 'ALL',
        type: 'PERCENT',
        value: 0,
        minSpend: '',
        maxDiscount: '',
        appliesTo: 'ALL',
        appliesToIds: '',
        startAt: '',
        endAt: '',
        status: 'ACTIVE',
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
      service: 'ALL',
      type: 'PERCENT',
      value: 0,
      minSpend: '',
      maxDiscount: '',
      appliesTo: 'ALL',
      appliesToIds: '',
      startAt: '',
      endAt: '',
      status: 'ACTIVE',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const discountData = {
      code: form.code.toUpperCase().trim(),
      name: form.name.trim(),
      service: form.service,
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
      status: form.status,
      createdBy: user?.email || 'admin@tofu.com',
    };

    if (editingDiscount) {
      updateDiscount(editingDiscount.id, discountData);
    } else {
      addDiscount(discountData);
    }

    setDiscounts(loadDiscounts());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 이 쿠폰을 삭제하시겠습니까?')) {
      deleteDiscount(id);
      setDiscounts(loadDiscounts());
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    updateDiscount(id, { status: newStatus });
    setDiscounts(loadDiscounts());
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
      PENDING: '대기중',
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

  const getServiceLabel = (service) => {
    const found = SERVICE_OPTIONS.find((s) => s.value === service);
    return found ? found.label : service;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">할인/쿠폰 관리</h1>
          <p className="text-gray-600 mt-1">할인 쿠폰을 생성하고 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          쿠폰 추가
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">활성 쿠폰</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{kpiStats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">예정된 쿠폰</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{kpiStats.scheduled}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">만료된 쿠폰</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{kpiStats.expired}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">총 사용 횟수</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{kpiStats.totalRedemptions}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">타입</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              <option value="ALL">전체</option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">서비스</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="코드 또는 이름 검색"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
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
                  서비스
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  적용 대상
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    쿠폰이 없습니다
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((discount) => (
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
                      {getServiceLabel(discount.service)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.appliesTo === 'ALL' ? '전체' : discount.appliesTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateRange(discount.startAt, discount.endAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(discount.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.createdBy || discount.partnerId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleOpenModal(discount)}
                        className="text-dabang-primary hover:text-dabang-primary/80"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleToggleStatus(discount.id, discount.status)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {discount.status === 'DISABLED' ? '활성화' : '비활성화'}
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스 *</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    required
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>
              <div className="grid grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  {STATUS_OPTIONS.filter((opt) => opt.value !== 'ALL').map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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

export default AdminDiscountsPage;

