import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';
import { getListingsByPartner, seedMockListings } from '../../../store/realEstateListingsStore';
import { getContractsByPartner, seedMockContracts } from '../../../store/realEstateContractsStore';
import { getCustomersByPartner, seedMockCustomers } from '../../../store/realEstateCustomersStore';
import KPICard from '../../../components/real-estate/KPICard';
import ActivityItem from '../../../components/real-estate/ActivityItem';

const RealEstateDashboardOverview = () => {
  const { user } = useUnifiedAuth();
  const navigate = useNavigate();
  
  // Get partner's data
  const partnerListings = useMemo(() => {
    seedMockListings();
    if (!user?.email) return [];
    return getListingsByPartner(user.email);
  }, [user?.email]);

  const partnerContracts = useMemo(() => {
    seedMockContracts();
    if (!user?.email) return [];
    return getContractsByPartner(user.email);
  }, [user?.email]);

  const partnerCustomers = useMemo(() => {
    seedMockCustomers();
    if (!user?.email) return [];
    return getCustomersByPartner(user.email);
  }, [user?.email]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalProperties = partnerListings.length;
    const publishedProperties = partnerListings.filter(l => l.status === 'LIVE').length;
    const underReview = partnerListings.filter(l => l.status === 'PENDING').length;
    const completedContracts = partnerContracts.filter(c => c.status === 'Completed' || c.status === '완료').length;
    
    return {
      totalProperties,
      publishedProperties,
      underReview,
      completedContracts
    };
  }, [partnerListings, partnerContracts]);

  // Get recent activities grouped by type
  const recentActivities = useMemo(() => {
    const activities = [];
    
    // Property activities
    partnerListings.slice(0, 3).forEach(listing => {
      let title = '';
      let description = listing.title || '매물';
      
      switch (listing.status) {
        case 'PENDING':
          title = '매물 심사 대기 중';
          break;
        case 'LIVE':
          title = '매물 노출됨';
          break;
        case 'REJECTED':
          title = '매물 반려됨';
          break;
        case 'COMPLETED':
          title = '매물 거래 완료';
          break;
        case 'HIDDEN':
          title = '매물 비노출 처리';
          break;
        default:
          title = '매물 업데이트';
      }
      
      activities.push({
        type: 'property',
        title,
        description,
        timestamp: listing.updatedAt || listing.createdAt,
        href: `/business/real-estate/listings/${listing.id}`
      });
    });
    
    // Contract activities
    partnerContracts.slice(0, 2).forEach(contract => {
      let title = '';
      switch (contract.status) {
        case 'Drafted':
          title = '계약 초안 작성됨';
          break;
        case 'Reviewed':
          title = '계약 검토 완료';
          break;
        case 'Signed':
          title = '계약 서명 완료';
          break;
        case 'Completed':
          title = '계약 완료';
          break;
        default:
          title = '계약 업데이트';
      }
      
      activities.push({
        type: 'contract',
        title,
        description: `${contract.customer?.name || '고객'} - ${contract.listing?.title || '매물'}`,
        timestamp: contract.updatedAt || contract.createdAt,
        href: `/business/real-estate/contracts/${contract.id}`
      });
    });
    
    // Customer activities
    partnerCustomers.slice(0, 2).forEach(customer => {
      activities.push({
        type: 'customer',
        title: '고객 등록됨',
        description: customer.name,
        timestamp: customer.createdAt,
        href: `/business/real-estate/customers/${customer.id}`
      });
    });
    
    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    }).slice(0, 8);
  }, [partnerListings, partnerContracts, partnerCustomers]);

  const hasData = partnerListings.length > 0 || partnerContracts.length > 0 || partnerCustomers.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
          대시보드 개요
        </h1>
        <p className="text-gray-600 mt-2 font-medium">전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 매물 수"
          value={kpis.totalProperties}
          icon="🏠"
          iconColor="text-blue-600"
          bgGradient="from-blue-50 to-blue-100"
          href="/business/real-estate/listings"
        />
        <KPICard
          title="노출 중인 매물"
          value={kpis.publishedProperties}
          icon="✅"
          iconColor="text-green-600"
          bgGradient="from-green-50 to-green-100"
          href="/business/real-estate/listings?status=LIVE"
        />
        <KPICard
          title="심사 대기"
          value={kpis.underReview}
          icon="⏳"
          iconColor="text-amber-600"
          bgGradient="from-amber-50 to-amber-100"
          href="/business/real-estate/listings?status=PENDING"
        />
        <KPICard
          title="완료된 계약"
          value={kpis.completedContracts}
          icon="📄"
          iconColor="text-purple-600"
          bgGradient="from-purple-50 to-purple-100"
          href="/business/real-estate/contracts?status=Completed"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">최근 활동</h2>
          <button
            onClick={() => navigate('/business/real-estate/listings')}
            className="text-sm font-medium text-dabang-primary hover:text-dabang-primary/80"
          >
            전체 보기 →
          </button>
        </div>
        
        {hasData && recentActivities.length > 0 ? (
          <div className="space-y-3">
            {/* Group by type */}
            {['property', 'contract', 'customer'].map(type => {
              const typeActivities = recentActivities.filter(a => a.type === type);
              if (typeActivities.length === 0) return null;
              
              return (
                <div key={type} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    {type === 'property' && '🏠 매물'}
                    {type === 'contract' && '📄 계약'}
                    {type === 'customer' && '👤 고객'}
                  </h3>
                  {typeActivities.map((activity, idx) => (
                    <ActivityItem
                      key={`${type}-${idx}`}
                      type={activity.type}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                      href={activity.href}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">활동 내역이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500 mb-4">새로운 매물을 등록하면 활동 내역이 표시됩니다.</p>
            <button
              onClick={() => navigate('/business/real-estate/listings/create')}
              className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors text-sm font-medium"
            >
              첫 매물 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateDashboardOverview;