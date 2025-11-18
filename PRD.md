# 테슬라 주가 분석 사이트 PRD (Product Requirements Document)

**Document Version:** 2.0  
**Last Updated:** 2025-11-16  
**Document Owner:** Development Team

---

## 1. Product Overview

### 1.1 제품 개요
테슬라(TSLA) 주가 분석 사이트는 개인 투자자들이 테슬라 주식에 대한 실시간 및 과거 데이터를 분석하고, 기술적 지표를 통해 투자 판단을 내릴 수 있도록 지원하는 웹 기반 플랫폼입니다.

### 1.2 목적
- 테슬라 주가 데이터의 실시간 모니터링 및 시각화
- 기술적 분석 도구를 통한 투자 의사결정 지원
- 직관적인 차트 및 지표 제공으로 복잡한 주가 데이터 이해 용이화
- 개인 투자자들의 데이터 기반 투자 판단 지원

### 1.3 가치 제안 (Value Proposition)
- **접근성**: 복잡한 금융 플랫폼 없이도 쉽게 접근 가능한 웹 기반 서비스
- **실시간성**: 최신 주가 데이터와 기술적 지표 제공
- **시각화**: 직관적인 차트와 그래프를 통한 데이터 이해
- **무료**: 기본적인 주가 분석 기능을 무료로 제공
- **전문성**: 전문 투자 도구 수준의 기술적 지표 제공

### 1.4 핵심 목표 (Project Goals)
1. 사용자가 테슬라 주가를 실시간으로 모니터링할 수 있다
2. 다양한 기술적 지표를 통해 주가 트렌드를 분석할 수 있다
3. 직관적인 차트를 통해 주가 데이터를 쉽게 이해할 수 있다
4. 데이터 기반 투자 판단을 내릴 수 있도록 지원한다
5. 반응형 디자인으로 다양한 디바이스에서 접근 가능하다

---

## 2. Reference Services

### 2.1 주가 분석 플랫폼
- **Yahoo Finance**: https://finance.yahoo.com/quote/TSLA
  - 실시간 주가 정보, 차트, 뉴스 통합 제공
  - 참고 포인트: 차트 인터랙션, 기술적 지표 표시 방법

- **TradingView**: https://www.tradingview.com/symbols/NASDAQ-TSLA/
  - 고급 차트 분석 도구, 다양한 기술적 지표
  - 참고 포인트: 차트 커스터마이징, 지표 오버레이 방식

- **Investing.com**: https://www.investing.com/equities/tesla-motors
  - 주가 차트, 기술적 분석, 뉴스 피드
  - 참고 포인트: 레이아웃 구조, 정보 계층화

### 2.2 데이터 제공 서비스
- **Alpha Vantage**: https://www.alphavantage.co/
  - 실제 사용할 API 제공자
  - 무료 플랜의 제한사항 이해 및 최적화 전략 수립

- **Supabase Dashboard**: https://app.supabase.com/
  - 데이터베이스 관리 및 모니터링
  - 실시간 데이터 구독 기능 활용

### 2.3 경쟁 서비스 단점 및 차별점
| 경쟁 서비스 | 한계 | 우리 서비스의 차별점 |
|-------------|------|---------------------|
| Yahoo Finance | 정보량은 많지만 감각적인 분석 UI 부족, TSLA 단일 집중 어려움 | TSLA 집중형 대시보드로 불필요한 정보 최소화 |
| TradingView | 고급 기능 위주로 초심자 진입 장벽 높음, 세팅 복잡 | 기본 지표/차트를 즉시 제공하고 버튼 한 번으로 데이터 동기화 |
| Investing.com | 광고/배너가 많아 몰입도 저하, 기술적 지표 구성이 제한적 | 광고 없는 미니멀 UI와 Bollinger/MACD/RSI 등 핵심 지표 제공 |
| 기타 금융 포털 | 실시간성 부족, 데이터 캐싱 전략 미흡 | Alpha Vantage + Supabase 캐시로 최신 데이터 우선 노출 |

---

## 3. Core Features

### 3.1 구현된 필수 기능 (Must Have, P0)

#### 3.1.1 실시간 주가 정보 대시보드 ✅
- **기능 설명**: 현재 주가, 변동률, 거래량 등 핵심 정보 표시
- **구현 상태**: 완료
- **데이터 소스**: Alpha Vantage API (GLOBAL_QUOTE) 또는 Supabase (최신 데이터 캐싱)
- **서버/클라이언트**: 서버 사이드에서 API 호출 후 클라이언트에 전달
- **구현 위치**: `src/app/page.tsx`
- **API Route**: `/api/stock/quote` (GET)
- **기능 상세**:
  - 현재가, 시가, 고가, 저가 표시
  - 전일 대비 변동률 및 변동액 표시
  - 상승/하락 색상 구분 (빨간색/파란색)
  - 30일 가격 트렌드 미리보기 차트

#### 3.1.2 주가 차트 시각화 ✅
- **기능 설명**: 일별 주가 데이터를 라인 차트로 표시
- **구현 상태**: 완료
- **데이터 소스**: Supabase (stock_prices 테이블)
- **서버/클라이언트**: 서버에서 데이터 조회, 클라이언트에서 차트 렌더링
- **구현 위치**: `src/app/chart/page.tsx`
- **API Route**: `/api/stock/price` (GET)
- **시간 범위**: 1개월, 3개월, 6개월, 1년, 전체
- **차트 타입**: 
  - 가격 차트: 종가 및 시가 라인 차트
  - 거래량 차트: 거래량 라인 차트
- **기능 상세**:
  - 시간 범위 선택 드롭다운
  - 인터랙티브 차트 (호버 툴팁)
  - 반응형 차트 렌더링

#### 3.1.3 기술적 지표 계산 및 표시 ✅
- **기능 설명**: RSI, MACD, Bollinger Bands 계산 및 차트 표시
- **구현 상태**: 완료 (클라이언트 사이드 계산)
- **데이터 소스**: 클라이언트에서 주가 데이터 기반 실시간 계산
- **서버/클라이언트**: 클라이언트에서 계산 및 표시
- **구현 위치**: `src/app/analysis/page.tsx`, `src/lib/alpha-vantage.ts`
- **지표 종류**:
  - **Bollinger Bands**: 20일 이동평균선과 상하 밴드
  - **MACD**: 12, 26, 9 파라미터로 MACD 및 Signal 라인
  - **RSI**: 14일 기간 상대강도지수 (과매수/과매도 기준선 포함)
- **기능 상세**:
  - 각 지표별 독립 차트
  - RSI 기준선 표시 (70, 30)
  - NaN 값 안전 처리

#### 3.1.4 데이터 동기화 기능 ✅
- **기능 설명**: Alpha Vantage API에서 최신 데이터를 가져와 Supabase에 저장
- **구현 상태**: 완료
- **데이터 소스**: Alpha Vantage API → Supabase
- **서버/클라이언트**: 서버 사이드에서만 실행 (API Route)
- **구현 위치**: `src/app/api/stock/sync/route.ts`
- **API Route**: `/api/stock/sync` (GET, POST)
- **기능 상세**:
  - Alpha Vantage TIME_SERIES_DAILY API 호출
  - Supabase에 upsert (중복 방지)
  - 동기화 결과 반환 (저장된 레코드 수)

#### 3.1.5 반응형 레이아웃 ✅
- **기능 설명**: 모바일, 태블릿, 데스크톱 환경 지원
- **구현 상태**: 기본 반응형 구현 완료
- **서버/클라이언트**: 클라이언트 사이드 반응형 처리
- **구현 위치**: Tailwind CSS 기반 전역 스타일
- **기능 상세**:
  - Tailwind 반응형 브레이크포인트 활용
  - 모바일 퍼스트 디자인
  - 컨테이너 및 그리드 레이아웃 반응형

### 3.2 구현된 중요 기능 (Should Have, P1)

#### 3.2.1 거래량 분석 ✅
- **기능 설명**: 거래량 차트 표시
- **구현 상태**: 완료
- **데이터 소스**: Supabase (stock_prices 테이블)
- **구현 위치**: `src/app/chart/page.tsx`
- **기능 상세**: 거래량 라인 차트 (별도 카드)

#### 3.2.2 기술적 지표 상세 분석 페이지 ✅
- **기능 설명**: 기술적 지표 차트 및 시각화
- **구현 상태**: 완료
- **데이터 소스**: 클라이언트에서 실시간 계산
- **구현 위치**: `src/app/analysis/page.tsx`
- **기능 상세**: 
  - Bollinger Bands 차트
  - MACD 차트 (MACD, Signal 라인)
  - RSI 차트 (과매수/과매도 기준선)

### 3.3 미구현 기능 (Future Enhancements)

#### 3.3.1 뉴스 피드
- **기능 설명**: 테슬라 관련 뉴스 표시
- **구현 상태**: 데이터베이스 스키마만 존재, 기능 미구현
- **데이터 소스**: Alpha Vantage NEWS_SENTIMENT API (선택적)

#### 3.3.2 캔들스틱 차트
- **기능 설명**: 캔들스틱 차트 표시
- **구현 상태**: 미구현 (현재 라인 차트만 사용)

#### 3.3.3 기술적 지표 데이터베이스 저장
- **기능 설명**: 계산된 지표를 데이터베이스에 저장하여 캐싱
- **구현 상태**: 함수는 존재하나 실제 저장 로직 미구현 (클라이언트 계산만 사용)

#### 3.3.4 자동 데이터 동기화
- **기능 설명**: Cron Job을 통한 정기적 데이터 동기화
- **구현 상태**: 수동 동기화만 구현 (버튼 클릭)

---

## 4. Target Users

### 4.1 주요 사용자 그룹

#### 4.1.1 개인 투자자 (Primary)
- **인구통계**: 25-55세, 중산층 이상
- **행동 특성**:
  - 주식 투자에 관심이 있으나 전문 지식은 제한적
  - 테슬라 주식 투자를 고려하거나 이미 보유 중
  - 모바일 및 데스크톱 모두에서 접근
- **니즈**:
  - 쉬운 주가 확인 및 트렌드 파악
  - 기술적 분석을 통한 매수/매도 시점 판단
  - 신뢰할 수 있는 데이터 기반 의사결정

#### 4.1.2 주식 트레이더 (Secondary)
- **인구통계**: 30-50세, 금융 관련 직종 또는 전문 트레이더
- **행동 특성**:
  - 기술적 분석에 익숙함
  - 빠른 데이터 접근 및 분석 도구 필요
  - 데스크톱 중심 사용
- **니즈**:
  - 정확한 기술적 지표
  - 다양한 시간대 분석
  - 실시간 데이터 업데이트

#### 4.1.3 테슬라 관심 사용자 (Tertiary)
- **인구통계**: 20-40세, 테크 관심층
- **행동 특성**:
  - 테슬라에 대한 일반적 관심
  - 투자보다는 정보 확인 목적
  - 모바일 중심 사용
- **니즈**:
  - 간단한 주가 확인
  - 트렌드 파악
  - 접근하기 쉬운 인터페이스

---

## 5. Target Platforms

### 5.1 웹 플랫폼 (Primary)

#### 5.1.1 데스크톱 웹
- **브라우저 지원**: Chrome, Safari, Firefox, Edge (최신 2개 버전)
- **해상도**: 1920x1080 이상 권장, 1366x768 최소
- **기능**: 전체 기능 제공, 고해상도 차트 표시

#### 5.1.2 태블릿 웹
- **기기**: iPad, Android 태블릿
- **해상도**: 768px 이상
- **기능**: 데스크톱과 유사한 기능, 터치 최적화

#### 5.1.3 모바일 웹
- **기기**: iPhone, Android 스마트폰
- **해상도**: 375px 이상
- **기능**: 핵심 기능 제공, 간소화된 UI

### 5.2 플랫폼별 최적화 전략
- **반응형 디자인**: Tailwind CSS를 활용한 모바일 퍼스트 접근
- **성능 최적화**: 모바일에서 이미지 및 데이터 최적화

---

## 6. Data Storage Method

### 6.1 데이터베이스 구조

#### 6.1.1 주 데이터베이스: Supabase (PostgreSQL)
- **용도**: 주가 데이터 저장
- **위치**: Supabase Cloud (PostgreSQL)
- **백업**: Supabase 자동 백업 활용
- **보안**: Row Level Security (RLS) 정책 적용

#### 6.1.2 데이터 테이블

**stock_prices 테이블** ✅
- **용도**: 일별 주가 데이터 저장
- **데이터 소스**: Alpha Vantage API (TIME_SERIES_DAILY)
- **업데이트 주기**: 수동 동기화 (사용자 버튼 클릭)
- **보관 기간**: 무제한
- **스키마**: `supabase/schema.sql`
- **필드**:
  - `id` (UUID, Primary Key)
  - `symbol` (VARCHAR, 기본값 'TSLA')
  - `date` (DATE)
  - `open`, `high`, `low`, `close` (DECIMAL)
  - `volume` (BIGINT)
  - `adjusted_close` (DECIMAL, 선택적)
  - `created_at`, `updated_at` (TIMESTAMP)

**technical_indicators 테이블** ⚠️
- **용도**: 계산된 기술적 지표 저장 (스키마만 존재)
- **현재 상태**: 데이터베이스 스키마는 존재하나 실제 저장 로직 미구현
- **현재 구현**: 클라이언트 사이드에서 실시간 계산
- **스키마**: `supabase/schema.sql`
- **필드**: sma_5, sma_20, sma_50, sma_200, ema_12, ema_26, rsi, macd, macd_signal, macd_histogram, bollinger_upper, bollinger_middle, bollinger_lower

**news 테이블** ⚠️
- **용도**: 테슬라 관련 뉴스 저장 (스키마만 존재)
- **현재 상태**: 데이터베이스 스키마만 존재, 기능 미구현

### 6.2 데이터 흐름

```
Alpha Vantage API
    ↓
Next.js API Route (서버 사이드)
    ↓
Supabase Database (stock_prices)
    ↓
Next.js API Route (서버 사이드)
    ↓
클라이언트 컴포넌트 (클라이언트 사이드)
    ↓
사용자 인터페이스
```

### 6.3 데이터 동기화 전략

#### 6.3.1 수동 동기화 ✅
- **방법**: 사용자가 "Sync Data" 버튼 클릭
- **구현**: `/api/stock/sync` API Route
- **로직**: Alpha Vantage API에서 전체 데이터 수집 후 Supabase에 upsert

#### 6.3.2 실시간 주가 조회 ✅
- **방법**: Alpha Vantage GLOBAL_QUOTE API 또는 Supabase 캐시
- **구현**: `/api/stock/quote` API Route
- **캐싱 전략**: 오늘 날짜의 데이터가 있으면 데이터베이스에서 반환, 없으면 API 호출

#### 6.3.3 자동 동기화 ⚠️
- **현재 상태**: 미구현
- **계획**: Vercel Cron Job 또는 Supabase Edge Functions 활용

### 6.4 데이터 보안

#### 6.4.1 API 키 보안 ✅
- **저장 위치**: 환경 변수 (.env.local, Vercel Environment Variables)
- **접근 제어**: 서버 사이드에서만 접근
- **노출 방지**: 클라이언트 번들에 포함되지 않도록 설정

#### 6.4.2 데이터베이스 보안 ✅
- **Row Level Security (RLS)**: 공개 읽기 전용 정책
- **서비스 역할 키**: 서버 사이드에서만 사용 (`supabaseAdmin`)
- **익명 키**: 클라이언트에서 읽기 전용 접근 (현재 미사용)

#### 6.4.3 데이터 검증 ✅
- **입력 검증**: Alpha Vantage API 응답 데이터 검증
- **SQL Injection 방지**: Supabase 클라이언트의 파라미터화된 쿼리
- **XSS 방지**: React의 자동 이스케이프

---

## 7. Technology Stack

### 7.1 프론트엔드

#### 7.1.1 핵심 프레임워크
- **Next.js 15.1.0** (App Router) ✅
  - **용도**: 풀스택 React 프레임워크
  - **이유**: 서버 사이드 렌더링, API Routes, 최적화 기능
  - **구현**: App Router 사용, 서버 컴포넌트 및 클라이언트 컴포넌트 분리

- **React 19.0.0** ✅
  - **용도**: UI 컴포넌트 개발
  - **이유**: 컴포넌트 기반 개발, 풍부한 생태계

- **TypeScript 5** ✅
  - **용도**: 타입 안정성 보장
  - **이유**: 개발 시 오류 감소, 코드 품질 향상

#### 7.1.2 스타일링
- **Tailwind CSS 3.4.1** ✅
  - **용도**: 유틸리티 기반 CSS 프레임워크
  - **이유**: 빠른 개발, 일관된 디자인, 반응형 디자인
  - **구현**: `tailwind.config.ts` 설정

- **shadcn/ui** ✅
  - **용도**: 재사용 가능한 UI 컴포넌트
  - **이유**: 접근성, 커스터마이징, 타입 안정성
  - **구현된 컴포넌트**: Button, Card, Select, Input, Label, Textarea, Toast, Separator, Sheet, Dropdown Menu, Accordion, Avatar, Badge, Checkbox, Form, File Upload
  - **위치**: `src/components/ui/`

#### 7.1.3 차트 라이브러리
- **Recharts 2.15.4** ✅
  - **용도**: 주가 차트 시각화
  - **이유**: React 네이티브, 반응형, 커스터마이징 가능
  - **차트 타입**: Line Chart (현재 구현)
  - **구현 위치**: 
    - `src/app/page.tsx` (30일 트렌드)
    - `src/app/chart/page.tsx` (가격 및 거래량)
    - `src/app/analysis/page.tsx` (기술적 지표)

#### 7.1.4 상태 관리
- **Zustand 4** ✅
  - **용도**: 클라이언트 상태 관리
  - **이유**: 가벼움, 간단한 API, TypeScript 지원
  - **현재 사용**: 의존성에 포함되어 있으나 실제 사용은 제한적 (주로 React useState 사용)

- **React Query (TanStack Query) 5** ✅
  - **용도**: 서버 상태 관리, 데이터 페칭
  - **이유**: 캐싱, 자동 리프레시, 에러 핸들링
  - **현재 사용**: 의존성에 포함되어 있으나 실제 사용은 제한적 (주로 axios 직접 사용)

#### 7.1.5 유틸리티 라이브러리
- **date-fns 4** ✅
  - **용도**: 날짜 포맷팅 및 조작
  - **이유**: 가벼움, 함수형 API, 타입스크립트 지원

- **axios 1.7.9** ✅
  - **용도**: HTTP 클라이언트
  - **이유**: 인터셉터, 자동 JSON 변환, 에러 핸들링
  - **구현**: 모든 API 호출에서 사용

- **zod 3** ✅
  - **용도**: 스키마 검증
  - **이유**: TypeScript 통합, 런타임 검증
  - **현재 사용**: 의존성에 포함되어 있으나 실제 검증 로직은 제한적

- **lucide-react 0.469.0** ✅
  - **용도**: 아이콘 라이브러리
  - **구현**: Header, 페이지 아이콘 등에서 사용

### 7.2 백엔드

#### 7.2.1 데이터베이스
- **Supabase (PostgreSQL)** ✅
  - **용도**: 주가 데이터 저장
  - **이유**: 서버리스, 실시간 기능, 자동 백업
  - **구현**: `src/lib/supabase/` 디렉토리

#### 7.2.2 데이터베이스 클라이언트
- **@supabase/supabase-js 2.39.0** ✅
  - **용도**: Supabase 클라이언트
  - **이유**: 타입 안정성, 자동 생성된 타입
  - **구현**:
    - `src/lib/supabase/client.ts` (클라이언트 사이드, 현재 미사용)
    - `src/lib/supabase/server.ts` (서버 사이드, `supabaseAdmin` 사용)
    - `src/lib/supabase/stock.ts` (주가 데이터 CRUD 함수)

### 7.3 외부 API

#### 7.3.1 주가 데이터 API
- **Alpha Vantage API** ✅
  - **용도**: 주가 데이터, 실시간 주가 정보
  - **구현**: `src/lib/alpha-vantage.ts`
  - **엔드포인트**: 
    - `TIME_SERIES_DAILY`: 일별 주가 데이터 (무료 플랜)
    - `GLOBAL_QUOTE`: 실시간 주가 정보
  - **제한사항**: 5 calls/minute, 500 calls/day (무료 플랜)
  - **에러 핸들링**: Rate limit, Invalid symbol, No data 등 처리

### 7.4 개발 도구

#### 7.4.1 빌드 도구
- **Turbopack** (Next.js 내장) ✅
  - **용도**: 빠른 개발 서버 및 빌드
  - **이유**: 웹팩 대비 빠른 속도
  - **구현**: `npm run dev --turbopack`

#### 7.4.2 코드 품질
- **ESLint 9** ✅
  - **용도**: 코드 린팅
  - **설정**: `eslint.config.mjs`, next/core-web-vitals

- **TypeScript 5** ✅
  - **용도**: 타입 체킹
  - **설정**: `tsconfig.json`

#### 7.4.3 스타일링 도구
- **PostCSS 8** ✅
  - **용도**: CSS 처리
  - **플러그인**: autoprefixer, tailwindcss
  - **설정**: `postcss.config.mjs`

- **Autoprefixer 10.4.20** ✅
  - **용도**: 벤더 프리픽스 자동 추가

### 7.5 배포 및 호스팅

#### 7.5.1 프론트엔드 배포
- **Vercel** ✅
  - **용도**: Next.js 애플리케이션 호스팅
  - **이유**: Next.js 최적화, 자동 배포, Edge Functions
  - **설정**: `vercel.json`
  - **문서**: `DEPLOYMENT.md`, `VERCEL_QUICKSTART.md`

#### 7.5.2 데이터베이스 호스팅
- **Supabase Cloud** ✅
  - **용도**: PostgreSQL 데이터베이스 호스팅
  - **이유**: 서버리스, 자동 스케일링, 백업

#### 7.5.3 환경 변수 관리
- **Vercel Environment Variables** ✅
  - **용도**: API 키, 데이터베이스 연결 정보
  - **보안**: 암호화 저장, 환경별 분리
  - **문서**: `scripts/vercel-env-setup.md`

### 7.6 UI/UX Guidelines

#### 7.6.1 Responsive Layout Principles
- **Mobile-First Design**: Tailwind CSS의 모바일 퍼스트 접근 방식 채택
- **Breakpoints**: 
  - 모바일: 기본 (기본 스타일)
  - 태블릿: `md:` (768px 이상)
  - 데스크톱: `lg:` (1024px 이상)
- **Container**: `container` 클래스 사용으로 최대 너비 제한 및 중앙 정렬
- **Grid System**: `grid` 및 `flex` 레이아웃으로 반응형 그리드 구현

#### 7.6.2 Component Design System
- **Base System**: shadcn/ui 컴포넌트를 기본 UI 시스템으로 사용
- **컴포넌트 위치**: `src/components/ui/` 디렉토리
- **주요 컴포넌트**: Button, Card, Select, Input, Label, Textarea, Toast 등
- **커스터마이징**: Tailwind CSS 클래스를 통한 스타일 오버라이드
- **일관성**: shadcn/ui의 디자인 토큰 및 변수 활용

#### 7.6.3 Color Conventions
- **Primary Colors**: 
  - 주가 상승: 빨간색 계열 (`text-red-600`, `text-red-500`)
  - 주가 하락: 파란색 계열 (`text-blue-600`, `text-blue-500`)
- **Neutral Colors**: 
  - 배경: `bg-background`, `bg-card`
  - 텍스트: `text-foreground`, `text-muted-foreground`
- **Chart Colors**: 
  - 가격 라인: `#2563eb` (파란색)
  - 시가 라인: `#82ca9d` (초록색)
  - 거래량: `#ffc658` (노란색)
  - 기술적 지표: 각 지표별 구분 색상

#### 7.6.4 Spacing Conventions
- **일관된 간격**: Tailwind의 spacing scale 사용
  - 작은 간격: `gap-2`, `p-2`, `space-y-2`
  - 기본 간격: `gap-4`, `p-4`, `space-y-4`
  - 큰 간격: `gap-6`, `p-6`, `space-y-6`, `gap-8`, `p-8`
  - 섹션 간격: `mb-8`, `mb-10`, `py-8`, `py-10`
- **컨테이너 패딩**: `container py-8`, `container py-10` 사용

#### 7.6.5 Typography Conventions
- **폰트**: Geist Sans (본문), Geist Mono (코드)
- **계층 구조**: Tailwind typography 클래스 사용
  - 제목: `text-4xl font-bold`, `text-2xl font-semibold`, `text-lg font-semibold`
  - 본문: `text-sm`, `text-base`
  - 작은 텍스트: `text-xs text-muted-foreground`
- **가독성**: `tracking-tight` (제목), `leading-loose` (본문) 활용

#### 7.6.6 Chart Interaction Guidelines
- **Touch-Friendly**: 모바일에서 차트 인터랙션이 터치 친화적으로 동작
- **Tooltip**: Recharts의 기본 Tooltip 컴포넌트 사용
- **Responsive Charts**: `ResponsiveContainer`로 차트 크기 자동 조정
- **Accessibility**: 차트에 적절한 레이블 및 범례 제공

### 7.7 UI Mockup (Text Wireframe)

**Home (/)**
```
┌──────────────────────────────────────────────┐
│ Header: Logo | Home | Chart | Analysis       │
├──────────────────────────────────────────────┤
│ Hero: Title + Sync Button + Analysis CTA     │
├──────────────────────────────────────────────┤
│ Error/Status Banner (optional)               │
├──────────────────────────────────────────────┤
│ Metrics Grid (4 cards: Price, Open, High, Low)│
├──────────────────────────────────────────────┤
│ Mini Trend Chart (30-day line chart)         │
├──────────────────────────────────────────────┤
│ Footer: Tech stack note                      │
└──────────────────────────────────────────────┘
```

**Chart (/chart)**
```
┌──────────────────────────────────────────────┐
│ Header + Title + Range Selector              │
├──────────────────────────────────────────────┤
│ Price Chart Card (Line chart)                │
├──────────────────────────────────────────────┤
│ Volume Chart Card (Line chart)               │
└──────────────────────────────────────────────┘
```

**Analysis (/analysis)**
```
┌──────────────────────────────────────────────┐
│ Header + Title                               │
├──────────────────────────────────────────────┤
│ Bollinger Bands Card                         │
├──────────────────────────────────────────────┤
│ MACD Card                                    │
├──────────────────────────────────────────────┤
│ RSI Card                                     │
└──────────────────────────────────────────────┘
```

### 7.8 Accessibility Considerations
- **색 대비**: Tailwind 컬러 토큰 중 WCAG 대비 비율을 충족하는 색상 사용 (예: `text-gray-700` 이상)
- **포커스 상태**: shadcn/ui 기본 포커스 링 유지 (`focus:ring-2 focus:ring-ring`)
- **키보드 네비게이션**: 버튼/링크에 `Button` 컴포넌트 사용으로 접근성 속성 자동 부여
- **차트 설명**: 제목, 범례, Tooltip을 통해 데이터 의미 전달
- **ARIA 라벨**: 동기화 버튼, 에러 배너에 적절한 역할/라벨 부여 (필요 시 추가)
- **반응형 폰트**: Tailwind typography를 사용해 작은 화면에서도 읽기 쉬운 크기 유지
- **애니메이션 배려**: 로딩 스피너 외 과도한 애니메이션 사용 자제

---

## 8. 프로젝트 구조 (Folder Structure)

### 8.1 디렉토리 구조

```
tesla-stock-analysis/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── stock/
│   │   │   │   ├── price/
│   │   │   │   │   └── route.ts      # GET /api/stock/price
│   │   │   │   ├── quote/
│   │   │   │   │   └── route.ts      # GET /api/stock/quote
│   │   │   │   └── sync/
│   │   │   │       └── route.ts      # GET, POST /api/stock/sync
│   │   │   └── test/
│   │   │       └── connection/
│   │   │           └── route.ts      # GET /api/test/connection
│   │   ├── analysis/
│   │   │   └── page.tsx              # 기술적 지표 분석 페이지
│   │   ├── chart/
│   │   │   └── page.tsx              # 주가 차트 페이지
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── page.tsx                  # 홈 페이지 (대시보드)
│   │   ├── providers.tsx             # React Providers
│   │   ├── globals.css               # 전역 스타일
│   │   └── favicon.ico
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx            # 헤더 컴포넌트
│   │   │   └── footer.tsx            # 푸터 컴포넌트
│   │   └── ui/                       # shadcn/ui 컴포넌트
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── select.tsx
│   │       ├── input.tsx
│   │       └── ... (기타 UI 컴포넌트)
│   ├── lib/
│   │   ├── alpha-vantage.ts          # Alpha Vantage API 클라이언트
│   │   ├── supabase/
│   │   │   ├── client.ts             # 클라이언트 사이드 Supabase
│   │   │   ├── server.ts             # 서버 사이드 Supabase
│   │   │   └── stock.ts              # 주가 데이터 CRUD 함수
│   │   └── utils.ts                  # 유틸리티 함수
│   ├── types/
│   │   └── stock.ts                  # TypeScript 타입 정의
│   └── hooks/
│       └── use-toast.ts              # Toast 훅
├── supabase/
│   ├── schema.sql                    # 데이터베이스 스키마
│   ├── SETUP.md                      # Supabase 설정 가이드
│   ├── CHECKLIST.md                  # 설정 체크리스트
│   └── README.md                     # Supabase 개요
├── scripts/
│   ├── setup-supabase.sql            # 설정용 SQL 스크립트
│   ├── test-supabase.ts              # 연결 테스트 스크립트
│   └── vercel-env-setup.md           # Vercel 환경 변수 가이드
├── public/                            # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── vercel.json
├── PRD.md                            # 이 문서
├── README.md
├── DEPLOYMENT.md
├── QUICKSTART.md
└── VERCEL_QUICKSTART.md
```

### 8.2 주요 파일 설명

#### 8.2.1 페이지 파일
- **`src/app/page.tsx`**: 홈 페이지 - 실시간 주가 정보 및 30일 트렌드 차트
- **`src/app/chart/page.tsx`**: 차트 페이지 - 시간 범위별 주가 및 거래량 차트
- **`src/app/analysis/page.tsx`**: 분석 페이지 - 기술적 지표 (RSI, MACD, Bollinger Bands) 차트

#### 8.2.2 API Routes
- **`src/app/api/stock/price/route.ts`**: 주가 데이터 조회 (GET)
- **`src/app/api/stock/quote/route.ts`**: 실시간 주가 정보 조회 (GET, 캐싱 포함)
- **`src/app/api/stock/sync/route.ts`**: 데이터 동기화 (GET, POST)
- **`src/app/api/test/connection/route.ts`**: Supabase 연결 테스트 (GET)

#### 8.2.3 라이브러리 파일
- **`src/lib/alpha-vantage.ts`**: Alpha Vantage API 클라이언트 및 기술적 지표 계산 함수
- **`src/lib/supabase/stock.ts`**: Supabase 주가 데이터 CRUD 함수
- **`src/types/stock.ts`**: TypeScript 인터페이스 정의

---

## 9. API Routes 상세

### 9.1 `/api/stock/price` (GET)
- **용도**: 주가 데이터 조회
- **파라미터**:
  - `symbol` (optional): 주식 심볼 (기본값: 'TSLA')
  - `limit` (optional): 조회할 데이터 개수 (기본값: 100)
  - `startDate` (optional): 시작 날짜
  - `endDate` (optional): 종료 날짜
- **응답**: `{ data: StockPrice[] }`
- **구현**: `src/app/api/stock/price/route.ts`
- **데이터 소스**: Supabase `stock_prices` 테이블

### 9.2 `/api/stock/quote` (GET)
- **용도**: 실시간 주가 정보 조회
- **파라미터**:
  - `symbol` (optional): 주식 심볼 (기본값: 'TSLA')
  - `useCache` (optional): 캐시 사용 여부 (기본값: true)
- **응답**: `{ data: StockQuote, source: 'database' | 'api' }`
- **구현**: `src/app/api/stock/quote/route.ts`
- **데이터 소스**: 
  1. Supabase 캐시 (오늘 날짜 데이터가 있으면)
  2. Alpha Vantage GLOBAL_QUOTE API (캐시가 없으면)
- **에러 핸들링**: Rate limit, Invalid symbol, No data, Missing API key 등

### 9.3 `/api/stock/sync` (GET, POST)
- **용도**: Alpha Vantage API에서 데이터 동기화
- **파라미터**:
  - `symbol` (optional): 주식 심볼 (기본값: 'TSLA')
- **응답**: `{ message: string, count: number, symbol: string }`
- **구현**: `src/app/api/stock/sync/route.ts`
- **데이터 소스**: Alpha Vantage TIME_SERIES_DAILY → Supabase `stock_prices` 테이블
- **기능**: 전체 데이터 수집 후 upsert

### 9.4 `/api/test/connection` (GET)
- **용도**: Supabase 연결 테스트
- **응답**: `{ success: boolean, message?: string, environment?: object, database?: object }`
- **구현**: `src/app/api/test/connection/route.ts`
- **기능**: 환경 변수 확인 및 데이터베이스 연결 테스트

---

## 10. 페이지별 데이터 소스 및 서버/클라이언트 경계

### 10.1 홈 페이지 (`/`)

#### 10.1.1 데이터 소스
- **실시간 주가 정보**: `/api/stock/quote` (Alpha Vantage API 또는 Supabase 캐시)
- **30일 차트 데이터**: `/api/stock/price?limit=30` (Supabase)

#### 10.1.2 서버/클라이언트 경계
- **서버 사이드 (API Route)**: 
  - `/api/stock/quote`: Alpha Vantage API 호출 또는 Supabase 조회
  - `/api/stock/price`: Supabase에서 데이터 조회
  - `/api/stock/sync`: Alpha Vantage API에서 데이터 동기화
- **클라이언트 사이드**: 
  - 주가 정보 표시 (Card 컴포넌트)
  - 30일 트렌드 차트 렌더링 (Recharts)
  - 동기화 버튼 클릭 이벤트
  - 로딩 상태 관리
  - 에러 처리 및 표시

#### 10.1.3 데이터 흐름
```
클라이언트 (페이지 로드)
    ↓
서버 (API Route: /api/stock/quote)
    ↓
Supabase (최신 데이터 조회) 또는 Alpha Vantage API
    ↓
서버 (데이터 반환)
    ↓
클라이언트 (UI 렌더링)
```

### 10.2 차트 페이지 (`/chart`)

#### 10.2.1 데이터 소스
- **주가 데이터**: `/api/stock/price` (Supabase `stock_prices` 테이블)
- **필터링**: 시간 범위에 따른 데이터 조회

#### 10.2.2 서버/클라이언트 경계
- **서버 사이드 (API Route)**: 
  - `/api/stock/price`: Supabase에서 기간별 데이터 조회
  - 쿼리 파라미터: `limit` (시간 범위에 따라 계산)
- **클라이언트 사이드**: 
  - 시간 범위 선택 (Select 컴포넌트)
  - 차트 렌더링 (Recharts)
  - 차트 인터랙션 (호버 툴팁)
  - 데이터 포맷팅 (날짜, 숫자)

#### 10.2.3 데이터 흐름
```
클라이언트 (시간 범위 선택)
    ↓
서버 (API Route: /api/stock/price?limit=365)
    ↓
Supabase (stock_prices 테이블 조회)
    ↓
서버 (데이터 반환)
    ↓
클라이언트 (차트 렌더링)
```

### 10.3 분석 페이지 (`/analysis`)

#### 10.3.1 데이터 소스
- **주가 데이터**: `/api/stock/price?limit=90` (Supabase)
- **기술적 지표**: 클라이언트에서 실시간 계산

#### 10.3.2 서버/클라이언트 경계
- **서버 사이드 (API Route)**: 
  - `/api/stock/price`: 주가 데이터 조회
- **클라이언트 사이드**: 
  - 기술적 지표 계산 (`calculateRSI`, `calculateMACD`, `calculateBollingerBands`)
  - 지표 차트 렌더링 (Recharts)
  - NaN 값 안전 처리

#### 10.3.3 데이터 흐름
```
클라이언트 (분석 페이지 로드)
    ↓
서버 (API Route: /api/stock/price?limit=90)
    ↓
Supabase (stock_prices 테이블 조회)
    ↓
서버 (주가 데이터 반환)
    ↓
클라이언트 (기술적 지표 계산 및 차트 렌더링)
```

### 10.4 데이터 동기화 (`/api/stock/sync`)

#### 10.4.1 데이터 소스
- **외부 API**: Alpha Vantage API (TIME_SERIES_DAILY)
- **저장소**: Supabase (stock_prices 테이블)

#### 10.4.2 서버/클라이언트 경계
- **서버 사이드 (API Route)**: 
  - Alpha Vantage API 호출
  - 데이터 변환 및 검증
  - Supabase에 저장 (upsert)
  - 동기화 결과 반환
- **클라이언트 사이드**: 
  - 동기화 버튼 클릭
  - 로딩 상태 표시
  - 완료/에러 메시지 표시

#### 10.4.3 데이터 흐름
```
클라이언트 (동기화 버튼 클릭)
    ↓
서버 (API Route: /api/stock/sync)
    ↓
Alpha Vantage API (주가 데이터 요청)
    ↓
서버 (데이터 변환 및 검증)
    ↓
Supabase (stock_prices 테이블에 저장)
    ↓
서버 (동기화 결과 반환)
    ↓
클라이언트 (완료 메시지 표시)
```

### 10.5 서버/클라이언트 경계 원칙

#### 10.5.1 서버 사이드에서 처리해야 할 항목
- **API 키 관리**: 환경 변수로 관리, 클라이언트에 노출 금지
- **데이터베이스 접근**: Supabase 클라이언트를 서버에서만 사용 (`supabaseAdmin`)
- **데이터 변환**: API 응답 데이터를 데이터베이스 스키마에 맞게 변환
- **에러 핸들링**: API 호출 실패, 데이터베이스 오류 처리

#### 10.5.2 클라이언트 사이드에서 처리해야 할 항목
- **UI 렌더링**: React 컴포넌트 렌더링
- **사용자 인터랙션**: 버튼 클릭, 폼 입력, 차트 인터랙션
- **상태 관리**: 로딩 상태, 에러 상태, 사용자 입력 상태 (React useState)
- **데이터 포맷팅**: 날짜 포맷, 숫자 포맷, 통화 포맷
- **차트 렌더링**: Recharts를 통한 차트 시각화
- **기술적 지표 계산**: 클라이언트에서 실시간 계산

#### 10.5.3 보안 고려사항
- **API 키**: 서버 사이드에서만 접근 가능하도록 설정
- **데이터베이스**: Row Level Security (RLS) 정책으로 읽기 전용 접근 제어
- **입력 검증**: Alpha Vantage API 응답 데이터 검증
- **에러 메시지**: 민감한 정보가 포함되지 않도록 주의

---

## 11. 개발 범위 정의

### 11.1 완료된 기능 (Phase 1-2)

#### 11.1.1 기초 설정 및 인프라 ✅
- [x] Next.js 프로젝트 생성 및 설정
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [x] shadcn/ui 컴포넌트 설치
- [x] 기본 의존성 설치
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 정의 및 생성
- [x] Row Level Security (RLS) 정책 설정
- [x] Supabase 클라이언트 설정 (서버/클라이언트)
- [x] Alpha Vantage API 클라이언트 구현
- [x] 환경 변수 설정
- [x] API 호출 함수 구현
- [x] 에러 핸들링
- [x] Header 컴포넌트
- [x] Footer 컴포넌트
- [x] 레이아웃 구조 설정
- [x] 네비게이션 구조

#### 11.1.2 핵심 기능 개발 ✅
- [x] API Route 구현 (`/api/stock/price`)
- [x] API Route 구현 (`/api/stock/quote`)
- [x] API Route 구현 (`/api/stock/sync`)
- [x] 데이터베이스 CRUD 함수 구현
- [x] 홈 페이지 개발
  - [x] 실시간 주가 정보 표시
  - [x] 주가 카드 컴포넌트
  - [x] 30일 트렌드 차트
  - [x] 데이터 동기화 버튼
  - [x] 기본 로딩 상태 처리
  - [x] 기본 에러 상태 처리
- [x] 차트 페이지 개발
  - [x] 차트 페이지 기본 구조
  - [x] Recharts 라이브러리 연동
  - [x] 시간 범위 선택 기능
  - [x] 가격 차트 구현
  - [x] 거래량 차트 구현
- [x] 기술적 지표 계산 함수
  - [x] RSI 계산 함수
  - [x] MACD 계산 함수
  - [x] Bollinger Bands 계산 함수
- [x] 분석 페이지 개발
  - [x] 분석 페이지 기본 구조
  - [x] 기술적 지표 차트 표시 (RSI, MACD, Bollinger Bands)
  - [x] 클라이언트 사이드 지표 계산

### 11.2 미구현 기능 (Future Enhancements)

#### 11.2.1 고급 기능
- [ ] 캔들스틱 차트 구현
- [ ] 차트 인터랙션 (줌, 팬)
- [ ] 기술적 지표 데이터베이스 저장
- [ ] 서버 사이드 지표 계산 및 저장
- [ ] 데이터 동기화 스케줄링 (Cron Job)
- [ ] 이동평균선 (SMA, EMA) 차트 표시
- [ ] 기술적 지표 오버레이 (주가 차트에 지표 함께 표시)

#### 11.2.2 사용자 경험 개선
- [ ] 로딩 스켈레톤
- [ ] 에러 메시지 개선 (더 상세한 안내)
- [ ] 토스트 알림 (toast 컴포넌트는 있으나 미사용)
- [ ] 접근성 개선 (a11y)
- [ ] 모바일 레이아웃 최적화
- [ ] 태블릿 레이아웃 최적화
- [ ] 터치 제스처 지원

#### 11.2.3 성능 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 데이터 캐싱 전략 (React Query 활용)
- [ ] ISR (Incremental Static Regeneration) 활용
- [ ] API 응답 시간 최적화

#### 11.2.4 추가 기능
- [ ] 뉴스 피드 (데이터베이스 스키마만 존재)
- [ ] 여러 주식 지원 (현재 TSLA만 지원)
- [ ] 사용자 인증 및 개인화
- [ ] 포트폴리오 관리 기능
- [ ] 알림 시스템

### 11.3 QA / 테스트 계획

| 영역 | 테스트 항목 | 방법 | 주기 |
|------|-------------|------|------|
| API | `/api/stock/price`, `/api/stock/quote`, `/api/stock/sync` 응답 상태 코드·payload 검증 | 호출 후 Jest/Thunder Client 검증, rate limit 가짜 데이터로 모킹 | 배포 전/후 |
| UI | 홈/차트/분석 페이지 로딩, 버튼/셀렉트 인터랙션, 반응형 레이아웃 확인 | Cypress 또는 수동 브라우저 테스트 (Chrome, Safari, 모바일) | 기능 릴리스 시 |
| 데이터 | Supabase 레코드 upsert 정확성, 중복 여부, 최신 날짜 유효성 검증 | `scripts/test-supabase.ts` 및 SQL 쿼리로 데이터 무결성 확인 | 동기화 후 |
| 에러 상태 | API 실패 시 에러 배너/메시지 노출, 로딩 스피너 동작 | 네트워크 차단/Mock 에러 후 UI 확인 | 주요 변경 시 |
| 퍼포먼스 | Lighthouse 측정 (LCP, TTI), 차트 렌더링 시간 | Lighthouse CI 또는 Chrome DevTools | 배포 버전마다 |

---

## 12. Milestones

| Phase | Task | Expected Date | Status |
|-------|------|---------------|--------|
| 1 | Project setup & DB schema | 2025-11-10 | ✅ Completed |
| 2 | API + Core features | 2025-11-10 | ✅ Completed |
| 3 | Chart + Analysis UI | 2025-11-10 | ✅ Completed |
| 4 | Final polish + Documentation | 2025-11-16 | ✅ Completed |

### Phase 1: Project Setup & DB Schema
- Next.js 프로젝트 초기화
- TypeScript 및 Tailwind CSS 설정
- Supabase 프로젝트 생성 및 데이터베이스 스키마 설정
- 환경 변수 설정

### Phase 2: API + Core Features
- Alpha Vantage API 연동
- Supabase 데이터베이스 CRUD 함수 구현
- API Routes 구현 (`/api/stock/price`, `/api/stock/quote`, `/api/stock/sync`)
- 홈 페이지 실시간 주가 정보 표시

### Phase 3: Chart + Analysis UI
- 차트 페이지 개발 (시간 범위 선택, 가격 및 거래량 차트)
- 분석 페이지 개발 (기술적 지표 계산 및 차트 표시)
- Recharts 라이브러리 통합
- 반응형 레이아웃 구현

### Phase 4: Final Polish + Documentation
- 에러 핸들링 개선
- UI/UX 개선
- PRD 문서 작성 및 업데이트
- 배포 가이드 작성
- Supabase 설정 가이드 작성

---

## 13. 사용자 Use Case

### Use Case 1: 실시간 주가 확인 ✅

**액터**: 개인 투자자 (김투자)  
**전제 조건**: 웹 브라우저 접근 가능  
**목표**: 테슬라 현재 주가 및 변동률 확인

**시나리오**:
1. 사용자가 웹사이트에 접속
2. 홈 페이지에서 현재 주가 정보 확인
3. 주가, 변동률, 거래량 등 핵심 정보 확인
4. 상승/하락 여부를 색상으로 구분하여 확인
5. 30일 트렌드 차트 확인

**데이터 소스**: 
- 서버: `/api/stock/quote` (Alpha Vantage API 또는 Supabase 캐시)
- 클라이언트: 서버에서 받은 데이터를 UI에 표시

**성공 조건**: 
- 현재 주가가 정확하게 표시됨
- 변동률이 정확하게 계산되어 표시됨
- 로딩 시간이 3초 이내

**예외 상황**:
- API 호출 실패 시 에러 메시지 표시
- 데이터가 없을 경우 안내 메시지 표시

---

### Use Case 2: 주가 차트 분석 ✅

**액터**: 주식 트레이더 (박트레이더)  
**전제 조건**: 웹 브라우저 접근 가능, 차트 페이지 접근  
**목표**: 과거 주가 트렌드 분석을 통한 투자 판단

**시나리오**:
1. 사용자가 "Chart" 페이지로 이동
2. 시간 범위 선택 (1개월, 3개월, 6개월, 1년, 전체)
3. 주가 차트 확인 (라인 차트)
4. 거래량 차트 확인
5. 트렌드를 분석하여 매수/매도 시점 판단

**데이터 소스**: 
- 서버: `/api/stock/price` (Supabase `stock_prices` 테이블)
- 클라이언트: 서버에서 받은 데이터를 Recharts로 시각화

**성공 조건**: 
- 선택한 시간 범위의 차트가 정확하게 표시됨
- 차트가 인터랙티브하게 동작 (호버 툴팁)
- 로딩 시간이 2초 이내

**예외 상황**:
- 데이터가 부족할 경우 안내 메시지 표시
- 차트 렌더링 실패 시 에러 메시지 표시

---

### Use Case 3: 기술적 지표 분석 ✅

**액터**: 주식 트레이더 (박트레이더)  
**전제 조건**: 웹 브라우저 접근 가능, 분석 페이지 접근  
**목표**: 기술적 지표를 통한 상세 분석

**시나리오**:
1. 사용자가 "Analysis" 페이지로 이동
2. 기술적 지표 차트 확인 (RSI, MACD, Bollinger Bands)
3. 각 지표의 현재 값 확인
4. 지표 해석을 통한 투자 신호 확인

**데이터 소스**: 
- 서버: `/api/stock/price?limit=90` (Supabase)
- 클라이언트: 서버에서 받은 주가 데이터를 기반으로 기술적 지표 실시간 계산

**성공 조건**: 
- 기술적 지표가 정확하게 계산되어 표시됨
- 지표 차트가 명확하게 표시됨
- RSI 기준선이 표시됨 (70, 30)

**예외 상황**:
- 지표 계산 실패 시 에러 메시지 표시
- 데이터가 부족하여 지표 계산이 불가능한 경우 안내 메시지 표시

---

### Use Case 4: 데이터 동기화 ✅

**액터**: 시스템 관리자 또는 사용자  
**전제 조건**: 웹 브라우저 접근 가능, 동기화 권한  
**목표**: Alpha Vantage API에서 최신 데이터를 가져와 데이터베이스에 저장

**시나리오**:
1. 사용자가 홈 페이지에서 "Sync Data" 버튼 클릭
2. 시스템이 Alpha Vantage API에 요청
3. 최신 주가 데이터 수신
4. Supabase 데이터베이스에 저장 (upsert)
5. 동기화 완료 메시지 표시

**데이터 소스**: 
- 서버: Alpha Vantage API → Supabase (stock_prices 테이블)
- 클라이언트: 동기화 상태만 표시 (로딩, 완료, 에러)

**성공 조건**: 
- 최신 데이터가 성공적으로 수신됨
- 데이터베이스에 정확하게 저장됨
- 동기화 완료 메시지가 표시됨

**예외 상황**:
- API 호출 한도 초과 시 에러 메시지 표시
- 네트워크 오류 시 재시도 옵션 제공
- 데이터베이스 저장 실패 시 에러 메시지 표시

---

## 14. 성공 지표 (Success Metrics)

### 14.1 기술적 지표
- **페이지 로딩 시간**: 초기 로딩 < 3초
- **API 응답 시간**: 평균 < 2초
- **차트 렌더링 시간**: < 1초
- **에러율**: < 1%
- **가동 시간**: 99% 이상

### 14.2 사용자 경험 지표
- **페이지 체류 시간**: 평균 3분 이상
- **재방문률**: 주당 30% 이상
- **사용자 만족도**: 설문 조사를 통한 측정 (선택적)
- **모바일 사용률**: 전체 사용자의 40% 이상

### 14.3 비즈니스 지표 (향후)
- **일일 활성 사용자 (DAU)**: 목표 설정
- **월간 활성 사용자 (MAU)**: 목표 설정
- **사용자 유지율**: 목표 설정

### 14.4 Measurable KPIs
| 항목 | KPI | 측정 도구 | 목표 |
|------|-----|-----------|------|
| 데이터 동기화 성공률 | `/api/stock/sync` 성공 응답 비율 ≥ 95% | 서버 로그 / Supabase function | 95%+ |
| 실시간 주가 조회 성공률 | `/api/stock/quote` 200 응답 비율 ≥ 98% | API 모니터링 | 98%+ |
| 홈 페이지 LCP | Lighthouse Largest Contentful Paint | 2.5s 이하 |
| 차트 페이지 렌더링 | `/chart`에서 완료까지 2s 이하 | Performance API | 2s 이하 |
| 분석 지표 정확도 | RSI/MACD 동기화 값 ±1% 오차 | 자동 비교 스크립트 | ±1% |
| 오류 보고 수 | 사용자 에러 신고 < 5건/주 | Issue Tracker | <5/주 |
| Supabase 레코드 무결성 | 중복 레코드 0건 | 쿼리 검증 | 0건 |

---

## 15. 리스크 및 대응 방안

### 15.1 기술적 리스크

#### 15.1.1 Alpha Vantage API 제한
- **리스크**: 무료 플랜의 API 호출 제한 (5 calls/minute, 500 calls/day)
- **대응 방안**: 
  - 데이터 캐싱 전략 수립 (Supabase 캐시 활용)
  - 수동 동기화로 API 호출 최소화
  - 필요시 유료 플랜 고려

#### 15.1.2 데이터베이스 비용
- **리스크**: 데이터 증가로 인한 Supabase 비용 증가
- **대응 방안**: 
  - 데이터 보관 기간 제한
  - 오래된 데이터 아카이빙
  - 필요시 데이터베이스 최적화

#### 15.1.3 성능 이슈
- **리스크**: 대량 데이터 조회 시 성능 저하
- **대응 방안**: 
  - 인덱스 최적화 (이미 구현됨)
  - 페이지네이션 구현 (향후)
  - 데이터 캐싱

---

## 16. 향후 확장 계획

### 16.1 단기 확장 (3-6개월)
- 캔들스틱 차트 구현
- 기술적 지표 데이터베이스 저장
- 자동 데이터 동기화 (Cron Job)
- 모바일 레이아웃 최적화
- 다크 모드 지원

### 16.2 중기 확장 (6-12개월)
- 여러 주식 지원 (AAPL, MSFT 등)
- 사용자 인증 및 개인화
- 포트폴리오 관리 기능
- 알림 시스템 (이메일, 푸시)
- 뉴스 피드 통합

### 16.3 장기 확장 (12개월 이상)
- 모바일 네이티브 앱 (React Native)
- AI 기반 주가 예측
- 소셜 기능 (공유, 코멘트)
- 프리미엄 기능 (고급 분석 도구)

---

## 17. 부록

### 17.1 용어 정의
- **SMA (Simple Moving Average)**: 단순 이동평균
- **EMA (Exponential Moving Average)**: 지수 이동평균
- **RSI (Relative Strength Index)**: 상대강도지수
- **MACD (Moving Average Convergence Divergence)**: 이동평균 수렴 확산
- **Bollinger Bands**: 볼린저 밴드

### 17.2 참고 자료
- Alpha Vantage API 문서: https://www.alphavantage.co/documentation/
- Supabase 문서: https://supabase.com/docs
- Next.js 문서: https://nextjs.org/docs
- Recharts 문서: https://recharts.org/

### 17.3 프로젝트 문서
- **README.md**: 프로젝트 개요 및 시작 가이드
- **DEPLOYMENT.md**: Vercel 배포 가이드
- **QUICKSTART.md**: 빠른 시작 가이드
- **VERCEL_QUICKSTART.md**: Vercel 배포 빠른 시작
- **supabase/SETUP.md**: Supabase 설정 가이드
- **supabase/CHECKLIST.md**: Supabase 설정 체크리스트

---

**문서 끝**
