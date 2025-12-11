import React, { useState } from 'react';
import { officeInfo, accountInfo } from '../../../mock/realEstateData';

const RealEstateSettingsPage = () => {
  const [officeData, setOfficeData] = useState(officeInfo);
  const [accountData, setAccountData] = useState(accountInfo);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    kakao: false
  });

  const handleOfficeChange = (e) => {
    const { name, value } = e.target;
    setOfficeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (name) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSaveOfficeInfo = () => {
    console.log('Saving office info:', officeData);
    // In a real app, this would send data to the server
    alert('중개사무소 정보가 저장되었습니다.');
  };

  const handleSaveAccountInfo = () => {
    console.log('Saving account info:', accountData);
    // In a real app, this would send data to the server
    alert('계정 정보가 저장되었습니다.');
  };

  const handleChangePassword = () => {
    console.log('Changing password:', passwordData);
    // In a real app, this would send data to the server
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    alert('비밀번호가 변경되었습니다.');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
      </div>

      {/* Office Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">중개사무소 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상호명</label>
            <input
              type="text"
              name="businessName"
              value={officeData.businessName}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대표자</label>
            <input
              type="text"
              name="representative"
              value={officeData.representative}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">중개사 등록번호</label>
            <input
              type="text"
              name="registrationNumber"
              value={officeData.registrationNumber}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
            <input
              type="text"
              name="businessRegistrationNumber"
              value={officeData.businessRegistrationNumber}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
            <input
              type="text"
              name="address"
              value={officeData.address}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대표 연락처</label>
            <input
              type="text"
              name="contact"
              value={officeData.contact}
              onChange={handleOfficeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSaveOfficeInfo}
            className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이름</label>
            <input
              type="text"
              name="managerName"
              value={accountData.managerName}
              onChange={handleAccountChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              name="email"
              value={accountData.email}
              onChange={handleAccountChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleSaveAccountInfo}
            className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">비밀번호 변경</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 transition-colors"
          >
            변경하기
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">이메일 알림</p>
              <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notifications.email ? 'bg-dabang-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">카카오 알림</p>
              <p className="text-sm text-gray-500">카카오톡으로 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleNotificationChange('kakao')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notifications.kakao ? 'bg-dabang-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications.kakao ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateSettingsPage;