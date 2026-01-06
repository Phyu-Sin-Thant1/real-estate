import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { deliveryServiceTypes, getMinPriceForServiceType } from '../mock/deliveryServices';

const DeliveryServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Page Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-dabang-primary/5 via-transparent to-dabang-primary/5 blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-dabang-primary to-indigo-600 mb-6 shadow-2xl shadow-dabang-primary/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
                Premium Delivery Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Experience excellence with our curated selection of professional delivery and moving services
              </p>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Verified Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Insured Services</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Service Type Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {deliveryServiceTypes.map((serviceType, index) => (
              <div
                key={serviceType.id}
                onClick={() => navigate(`/delivery-services/${serviceType.id}`)}
                className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Premium Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${serviceType.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${serviceType.color} flex items-center justify-center text-4xl shadow-2xl shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <span className="relative z-10 filter drop-shadow-lg">{serviceType.icon}</span>
                  </div>
                </div>
                
                {/* Service Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-dabang-primary transition-colors duration-300 relative z-10">
                  {serviceType.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[3rem] relative z-10">
                  {serviceType.description}
                </p>
                
                {/* Starting Price */}
                {(() => {
                  const minPrice = getMinPriceForServiceType(serviceType.id);
                  return minPrice ? (
                    <div className="mb-6 relative z-10">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-extrabold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
                          ₩{minPrice >= 10000 ? `${(minPrice / 10000).toFixed(0)}만` : minPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
                
                {/* Premium CTA Button */}
                <button className="w-full px-6 py-3.5 bg-gradient-to-r from-dabang-primary to-indigo-600 hover:from-dabang-primary/90 hover:to-indigo-600/90 text-white rounded-xl font-semibold transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg shadow-dabang-primary/30 hover:shadow-xl hover:shadow-dabang-primary/40 group-hover:scale-105 relative z-10">
                  <span>Explore Services</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-dabang-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          {/* Premium Additional Info Section */}
          <div className="relative mt-20 overflow-hidden">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-dabang-primary/10 via-indigo-50/50 to-purple-50 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
            
            <div className="relative max-w-6xl mx-auto p-12 md:p-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  Why Choose Our <span className="bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">Premium Services</span>?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience the difference with our carefully curated network of professional delivery partners
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Agencies</h3>
                  <p className="text-gray-600 leading-relaxed">Verified and reliable delivery partners with proven track records</p>
                </div>
                
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">Quick and efficient delivery options with real-time tracking</p>
                </div>
                
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
                  <p className="text-gray-600 leading-relaxed">Fair and competitive rates with no hidden fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeliveryServicesPage;

