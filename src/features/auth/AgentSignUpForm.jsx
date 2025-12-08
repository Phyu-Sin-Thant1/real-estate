import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const AgentSignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    representativeName: '',
    businessRegistrationNumber: '',
    phone: '',
    email: '',
    address: '',
    region: '',
    experience: '',
    licenseNumber: '',
    introduction: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit && onSubmit(formData);
    } catch (err) {
      setError('중개사 가입 신청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  const regionOptions = [
    { value: 'SEOUL', label: '서울특별시' },
    { value: 'BUSAN', label: '부산광역시' },
    { value: 'DAEGU', label: '대구광역시' },
    { value: 'INCHEON', label: '인천광역시' },
    { value: 'GWANGJU', label: '광주광역시' },
    { value: 'DAEJEON', label: '대전광역시' },
    { value: 'ULSAN', label: '울산광역시' },
    { value: 'SEJONG', label: '세종특별자치시' },
    { value: 'GYEONGGI', label: '경기도' },
    { value: 'GANGWON', label: '강원도' },
    { value: 'CHUNGBUK', label: '충청북도' },
    { value: 'CHUNGNAM', label: '충청남도' },
    { value: 'JEONBUK', label: '전라북도' },
    { value: 'JEONNAM', label: '전라남도' },
    { value: 'GYEONGBUK', label: '경상북도' },
    { value: 'GYEONGNAM', label: '경상남도' },
    { value: 'JEJU', label: '제주특별자치도' }
  ];
  
  const experienceOptions = [
    { value: '0-1', label: '1년 미만' },
    { value: '1-3', label: '1-3년' },
    { value: '3-5', label: '3-5년' },
    { value: '5-10', label: '5-10년' },
    { value: '10+', label: '10년 이상' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="상호명"
          id="businessName"
          name="businessName"
          placeholder="사업자 상호명을 입력하세요"
          value={formData.businessName}
          onChange={handleInputChange}
          required
        />
        
        <Input
          label="대표자명"
          id="representativeName"
          name="representativeName"
          placeholder="대표자 성함을 입력하세요"
          value={formData.representativeName}
          onChange={handleInputChange}
          required
        />
        
        <Input
          label="사업자등록번호"
          id="businessRegistrationNumber"
          name="businessRegistrationNumber"
          placeholder="'-' 없이 숫자만 입력"
          value={formData.businessRegistrationNumber}
          onChange={handleInputChange}
          required
        />
        
        <Input
          label="휴대폰 번호"
          id="phone"
          name="phone"
          type="tel"
          placeholder="'-' 없이 숫자만 입력"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        
        <Input
          label="이메일"
          id="email"
          name="email"
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        
        <Input
          label="사무소 주소"
          id="address"
          name="address"
          placeholder="사무소 주소를 입력하세요"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        
        <Select
          label="활동 지역"
          id="region"
          name="region"
          options={regionOptions}
          value={formData.region}
          onChange={handleInputChange}
          placeholder="활동 지역을 선택하세요"
          required
        />
        
        <Select
          label="중개 경험"
          id="experience"
          name="experience"
          options={experienceOptions}
          value={formData.experience}
          onChange={handleInputChange}
          placeholder="중개 경험을 선택하세요"
          required
        />
        
        <Input
          label="공인중개사 자격증 번호"
          id="licenseNumber"
          name="licenseNumber"
          placeholder="'-' 없이 숫자만 입력"
          value={formData.licenseNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
          자기소개
        </label>
        <textarea
          id="introduction"
          name="introduction"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dabang-primary focus:border-transparent"
          placeholder="고객들에게 보여줄 자기소개를 입력하세요"
          value={formData.introduction}
          onChange={handleInputChange}
        />
      </div>
      
      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-200">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? '신청 중...' : '중개사 가입 신청'}
      </Button>
    </form>
  );
};

export default AgentSignUpForm;