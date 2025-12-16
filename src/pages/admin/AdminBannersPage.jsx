import React, { useEffect, useState } from 'react';
import { loadBanners, addBanner, updateBanner, deleteBanner, getBannerById } from '../../store/bannersStore';

const PLACEMENTS = [
  { value: 'HOME_TOP', label: '홈 상단' },
  { value: 'HOME_SIDEBAR', label: '홈 사이드바' },
  { value: 'HOME_BOTTOM', label: '홈 하단' },
];

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    placement: 'HOME_TOP',
    startAt: '',
    endAt: '',
    status: 'ACTIVE',
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
        placement: banner.placement || 'HOME_TOP',
        startAt: banner.startAt ? banner.startAt.split('T')[0] : '',
        endAt: banner.endAt ? banner.endAt.split('T')[0] : '',
        status: banner.status || 'ACTIVE',
      });
    } else {
      setEditingBanner(null);
      setForm({
        title: '',
        imageUrl: '',
        linkUrl: '',
        placement: 'HOME_TOP',
        startAt: '',
        endAt: '',
        status: 'ACTIVE',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setForm({
      title: '',
      imageUrl: '',
      linkUrl: '',
      placement: 'HOME_TOP',
      startAt: '',
      endAt: '',
      status: 'ACTIVE',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bannerData = {
      title: form.title,
      imageUrl: form.imageUrl,
      linkUrl: form.linkUrl,
      placement: form.placement,
      startAt: form.startAt ? `${form.startAt}T00:00:00` : null,
      endAt: form.endAt ? `${form.endAt}T23:59:59` : null,
      status: form.status,
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
    return status === 'ACTIVE' ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        활성
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        비활성
      </span>
    );
  };

  const getPlacementLabel = (placement) => {
    const found = PLACEMENTS.find((p) => p.value === placement);
    return found ? found.label : placement;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <p className="text-sm text-gray-600">비활성 배너</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {banners.filter((b) => b.status !== 'ACTIVE').length}
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
                  배치
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
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
                      {getPlacementLabel(banner.placement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(banner.status)}</td>
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingBanner ? '배너 수정' : '배너 추가'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배치</label>
                <select
                  value={form.placement}
                  onChange={(e) => setForm({ ...form, placement: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                >
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
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
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.status === 'ACTIVE'}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })
                    }
                    className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">활성화</span>
                </label>
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
                  {editingBanner ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;

