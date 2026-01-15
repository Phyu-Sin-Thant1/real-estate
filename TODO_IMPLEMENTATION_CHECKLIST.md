# 구현해야 할 작업 체크리스트

## 📋 개요
웹사이트에 이미 구현되어 있지만 Admin이나 Business Dashboard에서 관리할 수 없는 기능들을 우선순위별로 정리한 작업 목록입니다.

---

## 🔴 1단계: 최우선 작업 (High Priority)

### ✅ 작업 1: 이벤트 관리 시스템 구축
**현재 상태**: 
- 웹사이트에 `EventSection` 컴포넌트가 있음
- `homeMockData.events`에서 정적 데이터 사용
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/eventsStore.js` 생성
  - CRUD 함수 구현 (addEvent, updateEvent, deleteEvent, getActiveEvents)
  - localStorage 기반 저장
  - Mock 데이터 시드 함수 추가
- [ ] `src/pages/admin/AdminEventsPage.jsx` 생성
  - 이벤트 목록 표시
  - 이벤트 생성/수정/삭제 모달
  - 상태 관리 (ACTIVE/INACTIVE)
  - 날짜 범위 설정 (startAt, endAt)
- [ ] `src/router/AppRouter.jsx`에 라우트 추가
  - `/admin/content/events` → AdminEventsPage
- [ ] `src/components/home/EventSection.jsx` 수정
  - `homeMockData.events` 대신 `eventsStore.getActiveEvents()` 사용
- [ ] Admin 메뉴에 "이벤트 관리" 추가

**예상 소요 시간**: 4-6시간

---

### ✅ 작업 2: 인기 매물(Featured Listings) 관리 기능
**현재 상태**:
- 웹사이트에 "인기 매물" 섹션이 있음
- `trendingListings`에서 정적 데이터 사용
- Admin에서 특정 매물을 인기 매물로 지정 불가능

**해야 할 작업**:
- [ ] `src/store/realEstateListingsStore.js` 수정
  - `featured` 필드 추가 (boolean)
  - `featuredUntil` 필드 추가 (optional, 날짜)
  - `featuredPriority` 필드 추가 (number, 정렬용)
  - `getFeaturedListings()` 함수 추가
- [ ] `src/pages/admin/AdminRealEstateOversightPage.jsx` 수정
  - 매물 목록에 "인기 매물" 토글 버튼 추가
  - 인기 매물 우선순위 설정 기능
  - 인기 매물 기간 설정 (featuredUntil)
- [ ] `src/pages/business/real-estate/RealEstateListingsPage.jsx` 수정
  - 파트너도 자신의 매물을 인기 매물로 요청할 수 있는 기능 (선택사항)
- [ ] `src/pages/HomePage.jsx` 수정
  - `trendingListings` 대신 `getFeaturedListings()` 사용
  - 인기 매물만 필터링하여 표시

**예상 소요 시간**: 3-4시간

---

### ✅ 작업 3: 공지사항 배너 구현
**현재 상태**:
- `AnnouncementBanner` 컴포넌트가 있지만 비어있음 (placeholder)
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/bannersStore.js` 수정
  - `ANNOUNCEMENT_TOP` placement 타입 추가
  - 공지사항 배너 필터링 함수 추가
- [ ] `src/components/home/AnnouncementBanner.jsx` 구현
  - `bannersStore`에서 `ANNOUNCEMENT_TOP` 배너 가져오기
  - 배너 표시 로직 구현
  - 닫기 버튼 기능 (선택사항)
- [ ] `src/pages/admin/AdminBannersPage.jsx` 수정
  - Placement 옵션에 "공지사항 상단" 추가
  - 공지사항 배너 관리 UI 추가

**예상 소요 시간**: 2-3시간

---

## 🟡 2단계: 데이터 통합 작업 (Medium Priority)

### ✅ 작업 4: 리뷰 섹션 데이터 통합
**현재 상태**:
- 웹사이트에 `ReviewSection` 컴포넌트가 있음
- `homeMockData.reviews`에서 정적 데이터 사용
- Admin은 `reviewsStore`에서 리뷰 관리 가능하지만 웹사이트와 연결 안됨

**해야 할 작업**:
- [ ] `src/store/reviewsStore.js` 수정
  - `getPublicReviews()` 함수 추가 (홈페이지용)
  - 필터링 옵션 (평점, 서비스 타입, 최신순)
  - 최대 개수 제한 옵션
- [ ] `src/components/home/ReviewSection.jsx` 수정
  - `homeMockData.reviews` 대신 `reviewsStore.getPublicReviews()` 사용
  - 평점 4점 이상만 표시 (선택사항)
  - 최신 리뷰 6개만 표시

**예상 소요 시간**: 1-2시간

---

### ✅ 작업 5: 뉴스 섹션 데이터 통합
**현재 상태**:
- 웹사이트에 `NewsPanel` 컴포넌트가 있음
- `homeMockData.marketNews`에서 정적 데이터 사용
- Admin은 별도의 뉴스 스토어에서 관리

**해야 할 작업**:
- [ ] 뉴스 스토어 확인 및 통합
  - Admin이 관리하는 뉴스 스토어 경로 확인
  - `getPublicNews()` 또는 유사 함수 확인
- [ ] `src/components/home/NewsPanel.jsx` 수정
  - `homeMockData.marketNews` 대신 뉴스 스토어 사용
  - 최신 뉴스 4개만 표시
- [ ] 데이터 소스 통일
  - `homeMockData.marketNews` 제거 또는 deprecated 표시

**예상 소요 시간**: 1-2시간

---

### ✅ 작업 6: KPI/신뢰 지표 관리 시스템
**현재 상태**:
- 웹사이트에 `TrustBand` 컴포넌트가 있음
- `homeMockData.platformKPIs`에서 정적 데이터 사용
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/kpisStore.js` 생성
  - KPI 데이터 구조 정의
  - CRUD 함수 구현
  - 실제 데이터 계산 함수 (가능한 경우)
- [ ] `src/pages/admin/AdminSettingsPage.jsx` 수정
  - "KPI 관리" 탭 추가
  - KPI 수동 업데이트 기능
  - 자동 계산 옵션 (실제 데이터 기반)
- [ ] `src/components/home/TrustBand.jsx` 수정
  - `homeMockData.platformKPIs` 대신 `kpisStore.getKPIs()` 사용
- [ ] 실제 데이터 계산 로직 추가 (선택사항)
  - 총 사용자 수: users store에서 계산
  - 총 매물 수: listings store에서 계산
  - 총 파트너 수: businessAccounts store에서 계산

**예상 소요 시간**: 3-4시간

---

## 🟢 3단계: 개선 작업 (Low Priority)

### ✅ 작업 7: 이사 서비스 지표 대시보드
**현재 상태**:
- 웹사이트에 이사 서비스 섹션이 있음
- `homeMockData.movingMetrics`에서 정적 데이터 사용
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/movingMetricsStore.js` 생성
  - 실제 주문 데이터에서 지표 계산
  - 평균 응답 시간 계산
  - 평균 평점 계산
  - 완료된 이사 건수 계산
- [ ] `src/pages/admin/AdminDeliveryOversightPage.jsx` 수정
  - 지표 대시보드 섹션 추가
  - 실시간 지표 표시
- [ ] `src/pages/HomePage.jsx` 수정
  - `homeMockData.movingMetrics` 대신 `movingMetricsStore.getMetrics()` 사용

**예상 소요 시간**: 2-3시간

---

### ✅ 작업 8: 파트너 혜택 관리
**현재 상태**:
- 웹사이트에 파트너 전환 섹션이 있음
- `homeMockData.partnerBenefits`에서 정적 데이터 사용
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/partnerBenefitsStore.js` 생성
  - 부동산 파트너 혜택 관리
  - 이사/배송 파트너 혜택 관리
  - 다국어 지원 (ko, en)
- [ ] `src/pages/admin/AdminSettingsPage.jsx` 수정
  - "파트너 혜택" 탭 추가
  - 혜택 텍스트 편집 기능
- [ ] `src/pages/HomePage.jsx` 수정
  - `homeMockData.partnerBenefits` 대신 스토어 사용

**예상 소요 시간**: 2-3시간

---

### ✅ 작업 9: 시장 신호(Market Signals) 관리
**현재 상태**:
- 웹사이트에 시장 인사이트 섹션이 있음
- `homeMockData.marketSignals`에서 정적 데이터 사용
- Admin에서 관리 불가능

**해야 할 작업**:
- [ ] `src/store/marketSignalsStore.js` 생성
  - 시장 신호 데이터 구조 정의
  - CRUD 함수 구현
- [ ] `src/pages/admin/AdminContentPage.jsx` 생성 또는 수정
  - "시장 신호 관리" 섹션 추가
  - 시장 데이터 입력/수정 기능
- [ ] `src/pages/HomePage.jsx` 수정
  - `homeMockData.marketSignals` 대신 스토어 사용

**예상 소요 시간**: 2-3시간

---

## 📊 작업 진행 상황 체크리스트

### 1단계: 최우선 작업
- [ ] 작업 1: 이벤트 관리 시스템 구축
- [ ] 작업 2: 인기 매물 관리 기능
- [ ] 작업 3: 공지사항 배너 구현

### 2단계: 데이터 통합 작업
- [ ] 작업 4: 리뷰 섹션 데이터 통합
- [ ] 작업 5: 뉴스 섹션 데이터 통합
- [ ] 작업 6: KPI/신뢰 지표 관리 시스템

### 3단계: 개선 작업
- [ ] 작업 7: 이사 서비스 지표 대시보드
- [ ] 작업 8: 파트너 혜택 관리
- [ ] 작업 9: 시장 신호 관리

---

## 🎯 우선순위별 작업 요약

### 즉시 시작해야 할 작업 (이번 주)
1. **이벤트 관리 시스템** - 웹사이트에 이미 표시되고 있지만 관리 불가능
2. **인기 매물 관리** - 핵심 기능, 사용자 경험에 직접 영향

### 다음 주 작업
3. **공지사항 배너** - 빠르게 구현 가능
4. **리뷰/뉴스 통합** - 데이터 소스 통일

### 이후 작업
5. **KPI 관리** - 설정 페이지에 추가
6. **지표 대시보드** - 실제 데이터 계산 로직 필요
7. **파트너 혜택/시장 신호** - 낮은 우선순위

---

## 📝 작업 시 주의사항

### 공통 작업 패턴
1. **Store 생성/수정**
   - localStorage 기반 저장
   - Mock 데이터 시드 함수 포함
   - CRUD 함수 구현

2. **Admin 페이지 생성/수정**
   - 목록 표시
   - 생성/수정/삭제 모달
   - 상태 관리 (ACTIVE/INACTIVE)

3. **웹사이트 컴포넌트 수정**
   - `homeMockData` 대신 Store 사용
   - 필터링 및 정렬 로직 추가

4. **라우트 추가**
   - `AppRouter.jsx`에 새 라우트 추가
   - Admin 메뉴에 항목 추가

### 데이터 마이그레이션
- 기존 `homeMockData`의 데이터를 새 Store로 마이그레이션
- 기존 데이터 유지하면서 점진적 전환

### 테스트 체크리스트
- [ ] Admin에서 데이터 생성/수정/삭제 가능
- [ ] 웹사이트에 변경사항 즉시 반영
- [ ] Mock 데이터가 올바르게 시드됨
- [ ] 필터링 및 정렬 작동
- [ ] 다국어 지원 (해당되는 경우)

---

## 🔄 작업 순서 추천

### Week 1
1. 작업 1: 이벤트 관리 시스템 (4-6시간)
2. 작업 2: 인기 매물 관리 (3-4시간)

### Week 2
3. 작업 3: 공지사항 배너 (2-3시간)
4. 작업 4: 리뷰 섹션 통합 (1-2시간)
5. 작업 5: 뉴스 섹션 통합 (1-2시간)

### Week 3
6. 작업 6: KPI 관리 시스템 (3-4시간)
7. 작업 7: 이사 서비스 지표 (2-3시간)

### Week 4
8. 작업 8: 파트너 혜택 관리 (2-3시간)
9. 작업 9: 시장 신호 관리 (2-3시간)

**총 예상 소요 시간**: 약 22-30시간

---

## ✅ 완료 체크리스트

각 작업 완료 후 체크:
- [ ] 코드 작성 완료
- [ ] 테스트 완료
- [ ] 문서 업데이트
- [ ] Admin 메뉴에 추가됨
- [ ] 웹사이트에 반영됨
- [ ] Mock 데이터 시드됨

---

**마지막 업데이트**: 2024
**상태**: 작업 대기 중













