/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dabang-primary': '#1A237E',
        'dabang-secondary': '#FF6F00',
        'dabang-accent': '#00BCD4',
        'dabang-background': '#F5F5F5',
        'dabang-muted': '#616161',
        'dabang-dark-muted': '#424242',
        'admin-primary': '#0075C9',
        'admin-primary-hover': '#006CA6',
        'admin-accent': '#E2E8F0',
        'admin-success': '#16A34A',
        'admin-warning': '#F59E0B',
        'admin-danger': '#DC2626',
        'admin-surface': '#FFFFFF',
        'admin-muted': '#64748B',
        'admin-border': '#CBD5E1',
        'admin-background': '#F8FAFC',
      },
      fontFamily: {
        'sans': ['Pretendard', 'Spoqa Han Sans', 'Noto Sans KR', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Spoqa Han Sans', 'Pretendard', 'system-ui', 'sans-serif'],
        'body': ['Nanum Gothic', 'Noto Sans KR', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      boxShadow: {
        'admin-card': '0 10px 30px -15px rgba(15, 23, 42, 0.35)',
        'admin-soft': '0 20px 45px -25px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}