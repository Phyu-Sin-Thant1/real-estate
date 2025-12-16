import React, { useMemo, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { addApplication } from '../store/partnerApplicationsStore';
import { addApproval } from '../store/approvalsStore';

const initialForm = {
  type: '',
  companyName: '',
  businessNumber: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  serviceArea: '',
  website: '',
  message: '',
  agree: false,
};

const PartnerApplyPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(
    () => ({
      type: (v) => Boolean(v),
      companyName: (v) => v.trim() !== '',
      contactName: (v) => v.trim() !== '',
      email: (v) => v.trim() !== '',
      phone: (v) => v.trim() !== '',
      address: (v) => v.trim() !== '',
      serviceArea: (v) => v.trim() !== '',
      agree: (v) => v === true,
    }),
    []
  );

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    Object.entries(validators).forEach(([field, fn]) => {
      if (!fn(form[field])) nextErrors[field] = '필수 입력 항목입니다.';
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    const now = new Date().toISOString();
    const applicationId = `partner-${Date.now()}`;

    const application = {
      id: applicationId,
      type: form.type,
      companyName: form.companyName,
      businessNumber: form.businessNumber,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      serviceArea: form.serviceArea,
      website: form.website,
      message: form.message,
      status: 'PENDING',
      createdAt: now,
    };

    // Save application
    addApplication(application);

    // Create approval request
    const approval = {
      id: `approval-${applicationId}`,
      type: 'PARTNER_APPLICATION',
      entityId: applicationId,
      entityType: 'PARTNER_APP',
      status: 'PENDING',
      submittedBy: form.email,
      submittedAt: now,
      meta: {
        partnerId: form.email,
        partnerName: form.companyName,
        summary: `${form.companyName} - ${form.type === 'REAL_ESTATE' ? 'Real Estate' : 'Delivery'} Partner Application`,
      },
    };

    // Save approval
    addApproval(approval);
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">신청이 접수되었습니다</h1>
            <p className="text-gray-600 mb-6">승인 후 이메일로 안내됩니다.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">파트너 신청</h1>
              <p className="text-gray-600 mt-2">파트너 유형을 선택하고 정보를 입력해주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">파트너 유형 *</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'REAL_ESTATE', label: '부동산 파트너', desc: '매물 등록 및 관리' },
                    { key: 'DELIVERY', label: '배송 파트너', desc: '이사/배송 운영' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => setForm((prev) => ({ ...prev, type: opt.key }))}
                      className={`text-left border rounded-lg p-4 hover:border-dabang-primary ${
                        form.type === opt.key ? 'border-dabang-primary bg-dabang-primary/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{opt.label}</p>
                          <p className="text-sm text-gray-600">{opt.desc}</p>
                        </div>
                        {form.type === opt.key && (
                          <span className="text-dabang-primary text-sm font-medium">선택됨</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사명 *</label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={onChange}
                    className={`w-full border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="예: TOFU Real Estate Co."
                  />
                  {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호 (선택)</label>
                  <input
                    name="businessNumber"
                    value={form.businessNumber}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="예: 123-45-67890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이름 *</label>
                  <input
                    name="contactName"
                    value={form.contactName}
                    onChange={onChange}
                    className={`w-full border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="담당자 이름"
                  />
                  {errors.contactName && <p className="text-sm text-red-600 mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자 이메일 *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="contact@company.com"
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">담당자 연락처 *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="010-1234-5678"
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사 주소 *</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="도로명 주소"
                  />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">서비스 지역 *</label>
                  <input
                    name="serviceArea"
                    value={form.serviceArea}
                    onChange={onChange}
                    className={`w-full border ${errors.serviceArea ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary`}
                    placeholder="예: 서울/경기"
                  />
                  {errors.serviceArea && <p className="text-sm text-red-600 mt-1">{errors.serviceArea}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">웹사이트 / SNS (선택)</label>
                  <input
                    name="website"
                    value={form.website}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">간단한 소개 / 요청 사항</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dabang-primary"
                  placeholder="파트너십 배경, 제공 가능한 서비스 등을 적어주세요."
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-1 h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                />
                <label className="text-sm text-gray-700">
                  약관에 동의합니다. (개인정보 수집 및 이용 포함)
                </label>
              </div>
              {errors.agree && <p className="text-sm text-red-600">{errors.agree}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-dabang-primary text-white rounded-lg hover:bg-dabang-primary/90 disabled:opacity-70"
                >
                  {submitting ? '제출 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnerApplyPage;

