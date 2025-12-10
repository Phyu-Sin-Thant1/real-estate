import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MovingRequestForm from '../features/moving/MovingRequestForm';

const MovingRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-r from-dabang-primary to-blue-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              이사 / 배달 서비스 신청
            </h1>
            <p className="text-lg md:text-xl text-center text-blue-100 max-w-2xl mx-auto">
              상세한 정보를 입력해주시면 정확한 견적을 제공해드립니다.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 bg-dabang-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <MovingRequestForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovingRegistrationPage;

