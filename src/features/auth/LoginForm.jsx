import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginForm = ({ onLogin, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email && formData.password) {
        onLogin && onLogin(formData);
      } else {
        setError('이메일과 비밀번호를 입력해주세요.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
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
        {loading ? '로그인 중...' : '로그인'}
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-sm text-gray-600 hover:text-dabang-primary transition-colors"
        >
          계정이 없으신가요? 회원가입
        </button>
      </div>
    </form>
  );
};

export default LoginForm;