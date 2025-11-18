# Supabase 데이터베이스 설정

Tesla Stock Analysis 프로젝트의 Supabase 데이터베이스 설정 가이드입니다.

## 📚 문서 목록

1. **[QUICKSTART.md](../QUICKSTART.md)** - 빠른 시작 가이드 (추천)
2. **[SETUP.md](./SETUP.md)** - 상세한 설정 가이드
3. **[CHECKLIST.md](./CHECKLIST.md)** - 설정 체크리스트
4. **[schema.sql](./schema.sql)** - 데이터베이스 스키마 SQL 파일

## 🚀 빠른 시작 (5분)

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력 후 생성

### 2. 데이터베이스 스키마 설정
1. Supabase Dashboard → "SQL Editor"
2. `schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 후 실행

### 3. API 키 확인
1. Settings → API
2. Project URL, anon key, service_role key 복사

### 4. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 5. 연결 테스트
```bash
npm run dev
# 브라우저에서 http://localhost:3000/api/test/connection 접속
```

## 📋 데이터베이스 스키마

### 테이블 구조

#### stock_prices
주가 데이터를 저장하는 테이블
- `symbol`: 주식 심볼 (TSLA)
- `date`: 날짜
- `open`, `high`, `low`, `close`: 주가 정보
- `volume`: 거래량
- `adjusted_close`: 조정 종가

#### technical_indicators
기술적 지표를 저장하는 테이블
- `sma_5`, `sma_20`, `sma_50`, `sma_200`: 이동평균선
- `ema_12`, `ema_26`: 지수 이동평균선
- `rsi`: 상대강도지수
- `macd`, `macd_signal`, `macd_histogram`: MACD 지표
- `bollinger_upper`, `bollinger_middle`, `bollinger_lower`: 볼린저 밴드

#### news
뉴스 데이터를 저장하는 테이블 (선택적)
- `title`: 뉴스 제목
- `url`: 뉴스 URL
- `source`: 뉴스 출처
- `published_at`: 발행일

## 🔒 보안 설정

### Row Level Security (RLS)
- 모든 테이블에 RLS 활성화
- 공개 읽기 전용 정책 적용
- 쓰기 작업은 서버 사이드에서만 수행 (service_role key 사용)

### API 키 보안
- ⚠️ **service_role key는 절대 클라이언트에 노출하지 마세요**
- 서버 사이드에서만 사용
- `.env.local` 파일은 `.gitignore`에 포함

## 🔍 문제 해결

### 환경 변수 오류
- `.env.local` 파일 확인
- 환경 변수 이름 확인
- 개발 서버 재시작

### 연결 오류
- Supabase 프로젝트 활성 상태 확인
- API 키 정확성 확인
- `/api/test/connection`에서 오류 메시지 확인

### RLS 정책 오류
- SQL Editor에서 정책 확인
- 정책 재생성 (필요시)

## 📖 추가 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [API 문서](https://supabase.com/docs/reference/javascript/introduction)

## ✅ 다음 단계

1. ✅ Supabase 설정 완료
2. 다음: Alpha Vantage API 키 설정
3. 다음: 데이터 동기화 테스트
4. 다음: 애플리케이션 테스트

