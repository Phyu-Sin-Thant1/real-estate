// Mock API functions for authentication
export const authApi = {
  login: async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@tofu.com' && credentials.password === 'Admin123!') {
      return {
        success: true,
        user: {
          id: 1,
          email: credentials.email,
          name: 'TOFU Admin'
        },
        token: 'mock-jwt-token'
      };
    }
    
    return {
      success: false,
      error: '이메일 또는 비밀번호가 잘못되었습니다.'
    };
  },
  
  signUp: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: '회원가입이 완료되었습니다.'
    };
  },
  
  agentSignUp: async (agentData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: '중개사 가입 신청이 접수되었습니다. 검토 후 연락드리겠습니다.'
    };
  }
};