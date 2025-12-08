import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const SignUpForm = ({ onSignUp, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.agreeTerms || !formData.agreePrivacy) {
        setError('이용약관과 개인정보 처리방침에 동의해주세요.');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSignUp && onSignUp(formData);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="이메일 주소"
        id="email"
        name="email"
        type="email"
        placeholder="이메일을 입력하세요"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      
      <Input
        label="비밀번호"
        id="password"
        name="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      
      <Input
        label="비밀번호 확인"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="비밀번호를 다시 입력하세요"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
      />
      
      <Input
        label="이름"
        id="name"
        name="name"
        type="text"
        placeholder="이름을 입력하세요"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
      
      <Input
        label="휴대폰 번호"
        id="phone"
        name="phone"
        type="tel"
        placeholder="휴대폰 번호를 입력하세요"
        value={formData.phone}
        onChange={handleInputChange}
        required
      />
      
      <div className="space-y-3 pt-4">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            <span className="text-red-500">*</span> 이용약관에 동의합니다. {' '}
            <a href="#" className="text-dabang-primary hover:underline">
              [보기]
            </a>
          </span>
        </label>
        
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-dabang-primary focus:ring-dabang-primary border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다. {' '}
            <a href="#" className="text-dabang-primary hover:underline">
              [보기]
            </a>
          </span>
        </label>
      </div>
      
      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-200">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={loading || !formData.agreeTerms || !formData.agreePrivacy}
        className="w-full"
      >
        {loading ? '처리 중...' : '회원가입 완료'}
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-gray-600 hover:text-dabang-primary transition-colors"
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;