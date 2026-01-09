import React, { useEffect, useState } from 'react';
import { loadBanners, addBanner, updateBanner, deleteBanner, getBannerById } from '../../store/bannersStore';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Modal from '../../components/common/Modal';

const PAGE_SCOPES = [
  { value: 'ALL_PAGES', label: '모든 페이지' },
  { value: 'HOME', label: '홈' },
  { value: 'MAP_SEARCH', label: '지도 검색' },
  { value: 'PROPERTY_LIST', label: '매물 목록' },
  { value: 'PROPERTY_DETAIL', label: '매물 상세' },
  { value: 'DELIVERY', label: '배송 서비스' },
  { value: 'MOVING', label: '이사 서비스' },
  { value: 'COMMUNITY', label: '커뮤니티' },
  { value: 'CHECKOUT', label: '결제' },
  { value: 'PAYMENT', label: '결제 페이지' },
];

const SLOTS = [
  { value: 'GLOBAL_TOP', label: '전역 상단' },
  { value: 'PAGE_TOP', label: '페이지 상단' },
  { value: 'INLINE_1', label: '인라인 1' },
  { value: 'SIDEBAR', label: '사이드바' },
  { value: 'PAGE_BOTTOM', label: '페이지 하단' },
];

const STATUSES = [
  { value: 'DRAFT', label: '초안' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'PAUSED', label: '일시정지' },
];

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    surface: 'USER_WEB',
    pageScope: 'HOME',
    slot: 'PAGE_TOP',
    status: 'DRAFT',
    priority: 0,
    startAt: '',
    endAt: '',
    targeting: {
      domain: 'ALL',
      device: 'ALL',
      language: 'ALL',
      region: [],
    },
  });

  useEffect(() => {
    setBanners(loadBanners());
  }, []);

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setForm({
        title: banner.title || '',
        imageUrl: banner.imageUrl || '',
        linkUrl: banner.linkUrl || '',
        surface: banner.surface || 'USER_WEB',
        pageScope: banner.pageScope || 'HOME',
        slot: banner.slot || 'PAGE_TOP',
        status: banner.status || 'DRAFT',
        priority: banner.priority || 0,
        startAt: banner.startAt ? banner.startAt.split('T')[0] : '',
        endAt: banner.endAt ? banner.endAt.split('T')[0] : '',
        targeting: banner.targeting || {
          domain: 'ALL',
          device: 'ALL',
          language: 'ALL',
          region: [],
        },
      });
    } else {
      setEditingBanner(null);
      setForm({
        title: '',
        imageUrl: '',
        linkUrl: '',
        surface: 'USER_WEB',
        pageScope: 'HOME',
        slot: 'PAGE_TOP',
        status: 'DRAFT',
        priority: 0,
        startAt: '',
        endAt: '',
        targeting: {
          domain: 'ALL',
          device: 'ALL',
          language: 'ALL',
          region: [],
        },
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bannerData = {
      title: form.title,
      imageUrl: form.imageUrl,
      linkUrl: form.linkUrl,
      surface: form.surface,
      pageScope: form.pageScope,
      slot: form.slot,
      status: form.status,
      priority: parseInt(form.priority) || 0,
      startAt: form.startAt ? `${form.startAt}T00:00:00` : null,
      endAt: form.endAt ? `${form.endAt}T23:59:59` : null,
      targeting: form.targeting,
    };

    if (editingBanner) {
      updateBanner(editingBanner.id, bannerData);
    } else {
      addBanner(bannerData);
    }

    setBanners(loadBanners());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 이 배너를 삭제하시겠습니까?')) {
      deleteBanner(id);
      setBanners(loadBanners());
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">활성</span>;
      case 'PAUSED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">일시정지</span>;
      case 'DRAFT':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">초안</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDateRange = (startAt, endAt) => {
    if (!startAt && !endAt) return '무제한';
    const start = startAt ? new Date(startAt).toLocaleDateString('ko-KR') : '시작일 없음';
    const end = endAt ? new Date(endAt).toLocaleDateString('ko-KR') : '종료일 없음';
    return `${start} ~ ${end}`;
  };

  const getPageScopeLabel = (pageScope) => {
    const found = PAGE_SCOPES.find((p) => p.value === pageScope);
    return found ? found.label : pageScope;
  };

  const getSlotLabel = (slot) => {
    const found = SLOTS.find((s) => s.value === slot);
    return found ? found.label : slot;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">배너 관리</h1>
          <p className="text-gray-600 mt-1">홈페이지 배너를 생성하고 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
        >
          배너 추가
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">전체 배너</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{banners.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">활성 배너</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {banners.filter((b) => b.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">일시정지</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {banners.filter((b) => b.status === 'PAUSED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">초안</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {banners.filter((b) => b.status === 'DRAFT').length}
          </p>
        </div>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  페이지 / 슬롯
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  우선순위
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일정
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    배너가 없습니다
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{getPageScopeLabel(banner.pageScope || banner.placement || 'HOME')}</div>
                      <div className="text-xs text-gray-400">{getSlotLabel(banner.slot || banner.placement || 'PAGE_TOP')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(banner.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {banner.priority || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateRange(banner.startAt, banner.endAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleOpenModal(banner)}
                        className="text-dabang-primary hover:text-dabang-primary/80"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
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
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBanner ? '배너 수정' : '배너 추가'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <Input
            id="imageUrl"
            label="이미지 URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />

          <Input
            id="linkUrl"
            label="링크 URL"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            placeholder="https://example.com"
          />

          <Select
            id="pageScope"
            label="페이지 범위"
            value={form.pageScope}
            onChange={(e) => setForm({ ...form, pageScope: e.target.value })}
            options={PAGE_SCOPES}
            required
          />

          <Select
            id="slot"
            label="슬롯"
            value={form.slot}
            onChange={(e) => setForm({ ...form, slot: e.target.value })}
            options={SLOTS}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startAt"
              label="시작일"
              type="date"
              value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            />
            <Input
              id="endAt"
              label="종료일"
              type="date"
              value={form.endAt}
              onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="status"
              label="상태"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUSES}
              required
            />
            <Input
              id="priority"
              label="우선순위"
              type="number"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">타겟팅 (선택사항)</h4>
            <div className="space-y-3">
              <Select
                id="targetingDomain"
                label="도메인"
                value={form.targeting.domain}
                onChange={(e) => setForm({
                  ...form,
                  targeting: { ...form.targeting, domain: e.target.value }
                })}
                options={[
                  { value: 'ALL', label: '전체' },
                  { value: 'REAL_ESTATE', label: '부동산' },
                  { value: 'DELIVERY', label: '배송' },
                ]}
              />
              <Select
                id="targetingDevice"
                label="기기"
                value={form.targeting.device}
                onChange={(e) => setForm({
                  ...form,
                  targeting: { ...form.targeting, device: e.target.value }
                })}
                options={[
                  { value: 'ALL', label: '전체' },
                  { value: 'DESKTOP', label: '데스크톱' },
                  { value: 'MOBILE', label: '모바일' },
                ]}
              />
              <Select
                id="targetingLanguage"
                label="언어"
                value={form.targeting.language}
                onChange={(e) => setForm({
                  ...form,
                  targeting: { ...form.targeting, language: e.target.value }
                })}
                options={[
                  { value: 'ALL', label: '전체' },
                  { value: 'KO', label: '한국어' },
                  { value: 'EN', label: '영어' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              {editingBanner ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBannersPage;
