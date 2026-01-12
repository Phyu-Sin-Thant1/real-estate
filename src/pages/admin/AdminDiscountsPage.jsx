import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import {
  getPlatformCampaigns,
  createPlatformCampaign,
  updatePlatformCampaign,
  deletePlatformCampaign,
  setCampaignStatus,
  seedPlatformCampaigns,
} from '../../store/platformCampaignsStore';
import {
  getPartnerDiscounts,
  approvePartnerDiscount,
  rejectPartnerDiscount,
} from '../../store/partnerDiscountsStore';
import DiscountCampaignForm from '../../components/discounts/DiscountCampaignForm';
import Modal from '../../components/common/Modal';
import { convertLegacyToCampaign, convertCampaignToLegacy } from '../../lib/types/discountCampaign';
import Toast from '../../components/delivery/Toast';

const AdminDiscountsPage = () => {
  const { t } = useI18n();
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [partnerDiscounts, setPartnerDiscounts] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [filters, setFilters] = useState({
    status: 'ALL',
    scope: 'ALL',
    targetMode: 'ALL',
    search: '',
  });

  useEffect(() => {
    seedPlatformCampaigns();
    loadData();
  }, []);

  const loadData = () => {
    setCampaigns(getPlatformCampaigns());
    setPartnerDiscounts(getPartnerDiscounts());
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (filters.status !== 'ALL' && campaign.status !== filters.status) return false;
      if (filters.scope !== 'ALL' && campaign.scope !== filters.scope) return false;
      if (filters.targetMode !== 'ALL' && campaign.targetMode !== filters.targetMode) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!campaign.title.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [campaigns, filters]);

  const filteredPartnerDiscounts = useMemo(() => {
    return partnerDiscounts.filter((discount) => {
      if (filters.scope !== 'ALL' && discount.scope !== filters.scope) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!discount.title.toLowerCase().includes(searchLower) && !discount.partnerName.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [partnerDiscounts, filters]);

  const kpiStats = useMemo(() => {
    const now = new Date();
    return {
      live: campaigns.filter((c) => {
        if (c.status !== 'ACTIVE' && c.status !== 'LIVE') return false;
        const startAt = c.startAt ? new Date(c.startAt) : null;
        const endAt = c.endAt ? new Date(c.endAt) : null;
        if (startAt && now < startAt) return false;
        if (endAt && now > endAt) return false;
        return true;
      }).length,
      draft: campaigns.filter((c) => c.status === 'DRAFT').length,
      paused: campaigns.filter((c) => c.status === 'PAUSED').length,
      endingSoon: campaigns.filter((c) => {
        if (c.status !== 'ACTIVE' && c.status !== 'LIVE') return false;
        const endAt = c.endAt ? new Date(c.endAt) : null;
        if (!endAt) return false;
        const daysUntilEnd = (endAt - now) / (1000 * 60 * 60 * 24);
        return daysUntilEnd > 0 && daysUntilEnd <= 7;
      }).length,
      submittedDiscounts: partnerDiscounts.filter((d) => d.status === 'SUBMITTED').length,
    };
  }, [campaigns, partnerDiscounts]);

  const handleOpenDrawer = (item = null) => {
    setEditingItem(item);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingItem(null);
  };

  const handleSaveCampaign = (data) => {
    try {
      // Convert new schema to legacy format for store
      const legacyData = convertCampaignToLegacy(data);
      if (editingItem) {
        updatePlatformCampaign(editingItem.id, { ...legacyData, createdBy: user?.email || 'admin@tofu.com' });
        setToast({
          isVisible: true,
          message: '캠페인이 성공적으로 수정되었습니다.',
          type: 'success'
        });
      } else {
        createPlatformCampaign({ ...legacyData, createdBy: user?.email || 'admin@tofu.com' });
        setToast({
          isVisible: true,
          message: '캠페인이 성공적으로 생성되었습니다.',
          type: 'success'
        });
      }
      loadData();
      handleCloseDrawer();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setToast({
        isVisible: true,
        message: '캠페인 저장 중 오류가 발생했습니다.',
        type: 'error'
      });
    }
  };

  const handleDeleteCampaign = (id) => {
    if (window.confirm(t('discounts.confirmDelete'))) {
      deletePlatformCampaign(id);
      loadData();
    }
  };

  const handleSetStatus = (id, status) => {
    setCampaignStatus(id, status);
    loadData();
  };

  const handleEndCampaign = (id) => {
    if (window.confirm(t('discounts.confirmEnd'))) {
      setCampaignStatus(id, 'ENDED');
      loadData();
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      LIVE: 'bg-green-100 text-green-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      ENDED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || badges.DRAFT}`}>
        {t(`discounts.${status.toLowerCase()}`)}
      </span>
    );
  };

  const formatValue = (type, value) => {
    if (type === 'PERCENT') return `${value}%`;
    if (type === 'FIXED') return `₩${value.toLocaleString()}`;
    return value;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
            {t('discounts.title')}
          </h1>
          <p className="text-gray-600 mt-2 font-medium">{t('discounts.subtitle')}</p>
        </div>
        {activeTab === 'campaigns' && (
          <button
            onClick={() => handleOpenDrawer()}
            className="px-5 py-2.5 bg-gradient-to-r from-dabang-primary to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-dabang-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('discounts.createCampaign')}
          </button>
        )}
      </div>

      {/* Premium Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-1">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'campaigns'
                ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg shadow-dabang-primary/30'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('discounts.platformCampaigns')}
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex-1 whitespace-nowrap py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'partner'
                ? 'bg-gradient-to-r from-dabang-primary to-indigo-600 text-white shadow-lg shadow-dabang-primary/30'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t('discounts.partnerDiscounts')} {t('discounts.readOnly')}
          </button>
        </nav>
      </div>

      {/* Premium KPI Cards */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('discounts.totalLive')}</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{kpiStats.live}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('discounts.totalDraft')}</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{kpiStats.draft}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('discounts.totalPaused')}</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{kpiStats.paused}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{t('discounts.endingSoon')}</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{kpiStats.endingSoon}</p>
          </div>
        </div>
      )}
      {activeTab === 'partner' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">승인 대기</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{kpiStats.submittedDiscounts}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">활성 할인</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {partnerDiscounts.filter((d) => d.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">초안</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">
              {partnerDiscounts.filter((d) => d.status === 'DRAFT').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity" />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">거부됨</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {partnerDiscounts.filter((d) => d.status === 'REJECTED').length}
            </p>
          </div>
        </div>
      )}

      {/* Premium Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeTab === 'campaigns' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('discounts.form.status')}</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="ALL">전체</option>
                  <option value="ACTIVE">{t('discounts.active')}</option>
                  <option value="LIVE">{t('discounts.live')}</option>
                  <option value="DRAFT">{t('discounts.draft')}</option>
                  <option value="PAUSED">{t('discounts.paused')}</option>
                  <option value="ENDED">{t('discounts.ended')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('discounts.form.targetMode')}</label>
                <select
                  value={filters.targetMode}
                  onChange={(e) => setFilters({ ...filters, targetMode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="ALL">전체</option>
                  <option value="ALL">{t('discounts.targetModes.ALL')}</option>
                  <option value="PARTNER_IDS">{t('discounts.targetModes.PARTNER_IDS')}</option>
                  <option value="CATEGORY">{t('discounts.targetModes.CATEGORY')}</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discounts.form.scope')}</label>
            <select
              value={filters.scope}
              onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="ALL">전체</option>
              <option value="REAL_ESTATE">{t('discounts.scopes.REAL_ESTATE')}</option>
              <option value="DELIVERY">{t('discounts.scopes.DELIVERY')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.search')}</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder={t('common.search')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">소유자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.scope')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.discountType')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.value')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.targetMode')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      {t('discounts.noCampaigns')}
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => {
                    const owner = campaign.owner || 'PLATFORM';
                    return (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                        {campaign.description && (
                          <div className="text-xs text-gray-500">{campaign.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          owner === 'PLATFORM' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {owner === 'PLATFORM' ? '플랫폼' : '파트너'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.scopes.${campaign.scope}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.types.${campaign.discountType}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(campaign.discountType, campaign.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.targetModes.${campaign.targetMode}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(campaign.startAt)} ~ {formatDate(campaign.endAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleOpenDrawer(campaign)}
                          className="text-dabang-primary hover:text-dabang-primary/80"
                        >
                          {t('discounts.edit')}
                        </button>
                        {(campaign.status === 'ACTIVE' || campaign.status === 'LIVE') && (
                          <button
                            onClick={() => handleSetStatus(campaign.id, 'PAUSED')}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            {t('discounts.pause')}
                          </button>
                        )}
                        {campaign.status === 'PAUSED' && (
                          <button
                            onClick={() => handleSetStatus(campaign.id, 'ACTIVE')}
                            className="text-green-600 hover:text-green-800"
                          >
                            {t('discounts.resume')}
                          </button>
                        )}
                        {(campaign.status === 'ACTIVE' || campaign.status === 'LIVE') && (
                          <button
                            onClick={() => handleEndCampaign(campaign.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            {t('discounts.end')}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {t('discounts.delete')}
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner Discounts Table (Read-only) */}
      {activeTab === 'partner' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.title')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.partnerName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.scope')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.discountType')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.value')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('discounts.form.relatedEntityType')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPartnerDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      {t('discounts.noDiscounts')}
                    </td>
                  </tr>
                ) : (
                  filteredPartnerDiscounts.map((discount) => (
                    <tr key={discount.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{discount.title}</div>
                        {discount.description && (
                          <div className="text-xs text-gray-500">{discount.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {discount.partnerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.scopes.${discount.scope}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.types.${discount.discountType}`)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(discount.discountType, discount.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t(`discounts.entityTypes.${discount.relatedEntityType}`)}
                        {discount.relatedEntityId && ` (${discount.relatedEntityId})`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(discount.startAt)} ~ {formatDate(discount.endAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          discount.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          discount.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                          discount.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          discount.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          discount.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {discount.status === 'DRAFT' ? '초안' :
                           discount.status === 'SUBMITTED' ? '승인 대기' :
                           discount.status === 'ACTIVE' ? '활성' :
                           discount.status === 'REJECTED' ? '거부됨' :
                           discount.isActive ? t('discounts.active') : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {discount.status === 'SUBMITTED' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm('이 할인을 승인하시겠습니까?')) {
                                  approvePartnerDiscount(discount.id);
                                  loadData();
                                }
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => {
                                const adminNote = prompt('거부 사유를 입력하세요:');
                                if (adminNote) {
                                  rejectPartnerDiscount(discount.id, adminNote);
                                  loadData();
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              거부
                            </button>
                          </div>
                        )}
                        {discount.status === 'REJECTED' && discount.adminNote && (
                          <span className="text-xs text-red-600" title={discount.adminNote}>
                            거부됨
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seed Data Button (Dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <button
            onClick={() => {
              seedPlatformCampaigns();
              loadData();
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {t('discounts.seedData')}
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showDrawer && activeTab === 'campaigns' && (
        <Modal
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          title={editingItem ? '캠페인 수정' : '캠페인 생성'}
          size="large"
        >
          <DiscountCampaignForm
            mode={editingItem ? 'edit' : 'create'}
            initialValue={editingItem ? convertLegacyToCampaign(editingItem) : {}}
            onSubmit={handleSaveCampaign}
            onCancel={handleCloseDrawer}
            showStatus={true}
          />
        </Modal>
      )}

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AdminDiscountsPage;


