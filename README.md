# Tesla Stock Analysis

테슬라(TSLA) 주가 분석 사이트 - 실시간 주가 데이터 시각화 및 기술적 분석 도구

## 개요

이 프로젝트는 테슬라 주식의 실시간 및 과거 데이터를 분석하고 시각화하는 웹 애플리케이션입니다. 개인 투자자들이 기술적 지표를 통해 투자 판단을 내릴 수 있도록 지원합니다.

## 주요 기능

- ✅ 실시간 주가 정보 대시보드
- ✅ 주가 차트 시각화 (라인 차트, 캔들스틱 차트)
- ✅ 기술적 지표 계산 및 표시 (SMA, EMA, RSI, MACD, Bollinger Bands)
- ✅ 데이터 동기화 기능 (Alpha Vantage API → Supabase)
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **API**: Alpha Vantage API
- **Deployment**: Vercel

## 시작하기

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn
- Supabase 계정
- Alpha Vantage API 키

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd tesla-stock-analysis
```

2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Alpha Vantage API
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 파일의 내용을 실행하여 테이블 생성
3. Row Level Security (RLS) 정책이 자동으로 설정됩니다

### Alpha Vantage API 키 발급

1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)에서 무료 API 키 발급
2. 무료 플랜 제한사항: 5 calls/minute, 500 calls/day

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
tesla-stock-analysis/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── stock/
│   │   │       ├── price/
│   │   │       ├── quote/
│   │   │       └── sync/
│   │   ├── chart/
│   │   ├── analysis/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── alpha-vantage.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── stock.ts
│   │   └── utils.ts
│   └── types/
│       └── stock.ts
├── supabase/
│   └── schema.sql
├── PRD.md
└── README.md
```

## API Routes

### `/api/stock/price`
주가 데이터 조회
- **Method**: GET
- **Parameters**: 
  - `symbol` (optional): 주식 심볼 (기본값: TSLA)
  - `limit` (optional): 조회할 데이터 개수 (기본값: 100)
  - `startDate` (optional): 시작 날짜
  - `endDate` (optional): 종료 날짜

### `/api/stock/quote`
실시간 주가 정보 조회
- **Method**: GET
- **Parameters**: 
  - `symbol` (optional): 주식 심볼 (기본값: TSLA)
  - `useCache` (optional): 캐시 사용 여부 (기본값: true)

### `/api/stock/sync`
Alpha Vantage API에서 데이터 동기화
- **Method**: GET 또는 POST
- **Parameters**: 
  - `symbol` (optional): 주식 심볼 (기본값: TSLA)

## 데이터베이스 스키마

### stock_prices
일별 주가 데이터를 저장하는 테이블

### technical_indicators
계산된 기술적 지표를 저장하는 테이블

### news
뉴스 데이터를 저장하는 테이블 (선택적)

자세한 스키마는 `supabase/schema.sql` 파일을 참고하세요.

## 개발 가이드

### 데이터 동기화

1. 홈 페이지에서 "Sync Data" 버튼 클릭
2. 또는 API Route 직접 호출: `GET /api/stock/sync`

### 기술적 지표 계산

기술적 지표는 서버 사이드에서 계산됩니다:
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands

계산 함수는 `src/lib/alpha-vantage.ts`에 정의되어 있습니다.

## 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 환경 변수 설정 (Vercel)

Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALPHA_VANTAGE_API_KEY`

## 주의사항

### Alpha Vantage API 제한
- 무료 플랜: 5 calls/minute, 500 calls/day
- 데이터 동기화는 적절한 간격으로 수행하세요
- 필요시 유료 플랜 고려

### 데이터 보안
- API 키는 절대 클라이언트에 노출하지 마세요
- 서버 사이드에서만 API 키 사용
- 환경 변수를 통해 안전하게 관리

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 참고 자료

- [PRD 문서](./PRD.md) - 상세한 제품 요구사항 문서
- [Alpha Vantage API 문서](https://www.alphavantage.co/documentation/)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [Recharts 문서](https://recharts.org/)

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
