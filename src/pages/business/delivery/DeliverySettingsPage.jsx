import React, { useState } from 'react';
import { loadDeliverySettings, saveDeliverySettings } from '../../../mock/deliverySettingsData';
import Toast from '../../../components/delivery/Toast';

const DeliverySettingsPage = () => {
  const initialSettings = loadDeliverySettings();
  
  // State for each section
  const [companyProfile, setCompanyProfile] = useState(initialSettings.companyProfile);
  const [settlementPreferences, setSettlementPreferences] = useState(initialSettings.settlementPreferences);
  const [notificationSettings, setNotificationSettings] = useState(initialSettings.notificationSettings);
  const [operationSettings, setOperationSettings] = useState(initialSettings.operationSettings);
  
  // Password change modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Toast state
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  
  // Handle company profile changes
  const handleCompanyProfileChange = (field, value) => {
    setCompanyProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle settlement preferences changes
  const handleSettlementPreferencesChange = (field, value) => {
    setSettlementPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle notification settings changes
  const handleNotificationSettingChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle notification channel changes
  const handleNotificationChannelChange = (channel) => {
    setNotificationSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
  };
  
  // Handle operation settings changes
  const handleOperationSettingsChange = (field, value) => {
    setOperationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle password field changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save company profile
  const handleSaveCompanyProfile = () => {
    if (!companyProfile.companyName || !companyProfile.contact || !companyProfile.businessAddress) {
      showToast('업체명, 연락처, 사업장 주소는 필수 입력 항목입니다.', 'error');
      return;
    }
    
    const allSettings = {
      companyProfile,
      settlementPreferences,
      notificationSettings,
      operationSettings
    };
    
    saveDeliverySettings(allSettings);
    showToast('업체 정보가 저장되었습니다.');
  };
  
  // Reset company profile
  const handleResetCompanyProfile = () => {
    setCompanyProfile(loadDeliverySettings().companyProfile);
    showToast('업체 정보가 초기화되었습니다.');
  };
  
  // Save settlement preferences
  const handleSaveSettlementPreferences = () => {
    // Validation for bank transfer
    if (settlementPreferences.settlementMethod === '계좌이체') {
      if (!settlementPreferences.bankName || !settlementPreferences.accountNumber || !settlementPreferences.accountHolder) {
        showToast('계좌이체 선택 시 은행명, 계좌번호, 예금주는 필수 입력 항목입니다.', 'error');
        return;
      }
    }
    
    const allSettings = {
      companyProfile,
      settlementPreferences,
      notificationSettings,
      operationSettings
    };
    
    saveDeliverySettings(allSettings);
    showToast('정산 정보가 저장되었습니다.');
  };
  
  // Save notification settings
  const handleSaveNotificationSettings = () => {
    const allSettings = {
      companyProfile,
      settlementPreferences,
      notificationSettings,
      operationSettings
    };
    
    saveDeliverySettings(allSettings);
    showToast('알림 설정이 저장되었습니다.');
  };
  
  // Save operation settings
  const handleSaveOperationSettings = () => {
    const allSettings = {
      companyProfile,
      settlementPreferences,
      notificationSettings,
      operationSettings
    };
    
    saveDeliverySettings(allSettings);
    showToast('운영 설정이 저장되었습니다.');
  };
  
  // Handle password change
  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('모든 비밀번호 필드를 입력해주세요.', 'error');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showToast('비밀번호는 최소 6자 이상이어야 합니다.', 'error');
      return;
    }
    
    // In a real app, this would call an API to change the password
    console.log('Changing password:', passwordData);
    showToast('비밀번호가 변경되었습니다.');
    
    // Reset password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Close modal
    setIsPasswordModalOpen(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    // In a real app, this would clear the auth state and redirect to login
    console.log('Logging out...');
    showToast('로그아웃 되었습니다. 로그인 페이지로 이동합니다.');
    // Simulate redirect after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
  };
  
  // Close toast
  const closeToast = () => {
    setIsToastVisible(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-1">배송 파트너 설정을 관리합니다.</p>
      </div>

      {/* A) 업체 정보 (Company Profile) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">업체 정보</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업체명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyProfile.companyName}
                onChange={(e) => handleCompanyProfileChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="업체명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대표자명
              </label>
              <input
                type="text"
                value={companyProfile.representativeName}
                onChange={(e) => handleCompanyProfileChange('representativeName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="대표자명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyProfile.contact}
                onChange={(e) => handleCompanyProfileChange('contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="연락처를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                value={companyProfile.email}
                onChange={(e) => handleCompanyProfileChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="이메일을 입력하세요"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사업장 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyProfile.businessAddress}
                onChange={(e) => handleCompanyProfileChange('businessAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                placeholder="사업장 주소를 입력하세요"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSaveCompanyProfile}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 font-medium"
            >
              저장
            </button>
            <button
              onClick={handleResetCompanyProfile}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* B) 정산 정보 (Settlement Preferences) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">정산 정보</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정산 방식
              </label>
              <select
                value={settlementPreferences.settlementMethod}
                onChange={(e) => handleSettlementPreferencesChange('settlementMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="계좌이체">계좌이체</option>
                <option value="카드정산">카드정산</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정산 주기
              </label>
              <select
                value={settlementPreferences.settlementCycle}
                onChange={(e) => handleSettlementPreferencesChange('settlementCycle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="주간">주간</option>
                <option value="월간">월간</option>
              </select>
            </div>
            
            {settlementPreferences.settlementMethod === '계좌이체' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    은행명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settlementPreferences.bankName}
                    onChange={(e) => handleSettlementPreferencesChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="은행명을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    계좌번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settlementPreferences.accountNumber}
                    onChange={(e) => handleSettlementPreferencesChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="계좌번호를 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    예금주 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settlementPreferences.accountHolder}
                    onChange={(e) => handleSettlementPreferencesChange('accountHolder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="예금주를 입력하세요"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                세금계산서 발행 여부
              </label>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleSettlementPreferencesChange('taxInvoiceIssuance', !settlementPreferences.taxInvoiceIssuance)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:ring-offset-2 ${
                    settlementPreferences.taxInvoiceIssuance ? 'bg-dabang-primary' : 'bg-gray-200'
                  }`}
                  role="switch"
                >
                  <span
                    className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settlementPreferences.taxInvoiceIssuance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        settlementPreferences.taxInvoiceIssuance ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                      }`}
                    >
                      <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        settlementPreferences.taxInvoiceIssuance ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                      }`}
                    >
                      <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                      </svg>
                    </span>
                  </span>
                </button>
                <span className="ml-3 text-sm text-gray-700">
                  {settlementPreferences.taxInvoiceIssuance ? '발행' : '미발행'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSaveSettlementPreferences}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 font-medium"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* C) 알림 설정 (Notifications) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">알림 설정</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">신규 주문 알림</h3>
              </div>
              <button
                onClick={() => handleNotificationSettingChange('newOrderAlert', !notificationSettings.newOrderAlert)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:ring-offset-2 ${
                  notificationSettings.newOrderAlert ? 'bg-dabang-primary' : 'bg-gray-200'
                }`}
                role="switch"
              >
                <span
                  className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.newOrderAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.newOrderAlert ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                    }`}
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.newOrderAlert ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                    }`}
                  >
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">배차 요청 알림</h3>
              </div>
              <button
                onClick={() => handleNotificationSettingChange('dispatchRequestAlert', !notificationSettings.dispatchRequestAlert)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:ring-offset-2 ${
                  notificationSettings.dispatchRequestAlert ? 'bg-dabang-primary' : 'bg-gray-200'
                }`}
                role="switch"
              >
                <span
                  className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.dispatchRequestAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.dispatchRequestAlert ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                    }`}
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.dispatchRequestAlert ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                    }`}
                  >
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">배송 지연 알림</h3>
              </div>
              <button
                onClick={() => handleNotificationSettingChange('deliveryDelayAlert', !notificationSettings.deliveryDelayAlert)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:ring-offset-2 ${
                  notificationSettings.deliveryDelayAlert ? 'bg-dabang-primary' : 'bg-gray-200'
                }`}
                role="switch"
              >
                <span
                  className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.deliveryDelayAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.deliveryDelayAlert ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                    }`}
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.deliveryDelayAlert ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                    }`}
                  >
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">정산 완료 알림</h3>
              </div>
              <button
                onClick={() => handleNotificationSettingChange('settlementCompleteAlert', !notificationSettings.settlementCompleteAlert)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:ring-offset-2 ${
                  notificationSettings.settlementCompleteAlert ? 'bg-dabang-primary' : 'bg-gray-200'
                }`}
                role="switch"
              >
                <span
                  className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.settlementCompleteAlert ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.settlementCompleteAlert ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                    }`}
                  >
                    <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                      notificationSettings.settlementCompleteAlert ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                    }`}
                  >
                    <svg className="h-3 w-3 text-dabang-primary" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                    </svg>
                  </span>
                </span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">알림 채널</h3>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.channels.email}
                  onChange={() => handleNotificationChannelChange('email')}
                  className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                />
                <span className="ml-2 text-sm text-gray-700">이메일</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.channels.sms}
                  onChange={() => handleNotificationChannelChange('sms')}
                  className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                />
                <span className="ml-2 text-sm text-gray-700">SMS</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.channels.appNotification}
                  onChange={() => handleNotificationChannelChange('appNotification')}
                  className="rounded border-gray-300 text-dabang-primary focus:ring-dabang-primary"
                />
                <span className="ml-2 text-sm text-gray-700">앱 알림</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSaveNotificationSettings}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 font-medium"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* D) 운영 설정 (Operations) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">운영 설정</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 배차 방식
              </label>
              <select
                value={operationSettings.defaultDispatchMode}
                onChange={(e) => handleOperationSettingsChange('defaultDispatchMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              >
                <option value="자동">자동</option>
                <option value="수동">수동</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지연 기준(분)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={operationSettings.delayThreshold}
                onChange={(e) => handleOperationSettingsChange('delayThreshold', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                근무 시작 시간
              </label>
              <input
                type="time"
                value={operationSettings.workingHours.startTime}
                onChange={(e) => handleOperationSettingsChange('workingHours', {
                  ...operationSettings.workingHours,
                  startTime: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                근무 종료 시간
              </label>
              <input
                type="time"
                value={operationSettings.workingHours.endTime}
                onChange={(e) => handleOperationSettingsChange('workingHours', {
                  ...operationSettings.workingHours,
                  endTime: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleSaveOperationSettings}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 font-medium"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* E) 계정 (Account) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">계정</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              로그아웃
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-dabang-primary text-white rounded-md hover:bg-dabang-primary/90 font-medium"
            >
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              aria-hidden="true"
              onClick={() => setIsPasswordModalOpen(false)}
            ></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal panel */}
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    비밀번호 변경
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      현재 비밀번호
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="새 비밀번호를 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      새 비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                      placeholder="새 비밀번호를 다시 입력하세요"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleChangePassword}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-dabang-primary text-base font-medium text-white hover:bg-dabang-primary/90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  변경하기
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={isToastVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default DeliverySettingsPage;