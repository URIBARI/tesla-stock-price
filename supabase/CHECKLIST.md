# Supabase 설정 체크리스트

Supabase 데이터베이스 설정을 단계별로 확인하세요.

## ✅ 1. Supabase 프로젝트 생성

- [ ] Supabase 계정 생성
- [ ] 새 프로젝트 생성
- [ ] 프로젝트 이름: `tesla-stock-analysis` (또는 원하는 이름)
- [ ] 데이터베이스 비밀번호 설정 (기록해두기)
- [ ] 리전 선택: `Northeast Asia (Seoul)` (또는 가장 가까운 리전)
- [ ] 프로젝트 생성 완료 대기 (약 2분)

## ✅ 2. API 키 확인

- [ ] Settings → API 메뉴 접근
- [ ] Project URL 복사
- [ ] anon/public key 복사
- [ ] service_role key 복사 (⚠️ 비밀!)

## ✅ 3. 데이터베이스 스키마 설정

- [ ] SQL Editor 메뉴 접근
- [ ] "New query" 클릭
- [ ] `supabase/schema.sql` 파일 내용 복사
- [ ] SQL Editor에 붙여넣기
- [ ] "Run" 버튼 클릭
- [ ] 성공 메시지 확인

## ✅ 4. 테이블 확인

- [ ] Table Editor 메뉴 접근
- [ ] `stock_prices` 테이블 확인
- [ ] `technical_indicators` 테이블 확인
- [ ] `news` 테이블 확인

## ✅ 5. 인덱스 확인

- [ ] SQL Editor에서 다음 쿼리 실행:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```
- [ ] 다음 인덱스 확인:
  - [ ] `idx_stock_prices_symbol_date`
  - [ ] `idx_stock_prices_date`
  - [ ] `idx_technical_indicators_symbol_date`
  - [ ] `idx_news_symbol_published_at`

## ✅ 6. RLS 정책 확인

- [ ] Table Editor에서 각 테이블 클릭
- [ ] "Policies" 탭 확인
- [ ] `stock_prices` 테이블 정책 확인:
  - [ ] "Allow public read access on stock_prices"
- [ ] `technical_indicators` 테이블 정책 확인:
  - [ ] "Allow public read access on technical_indicators"
- [ ] `news` 테이블 정책 확인:
  - [ ] "Allow public read access on news"

## ✅ 7. 환경 변수 설정

- [ ] 프로젝트 루트에 `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 설정
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인

## ✅ 8. 연결 테스트

- [ ] 개발 서버 실행: `npm run dev`
- [ ] 브라우저에서 `/api/test/connection` 접속
- [ ] JSON 응답에서 `success: true` 확인
- [ ] 환경 변수 확인:
  - [ ] `supabaseUrl: "✓ Set"`
  - [ ] `supabaseAnonKey: "✓ Set"`
  - [ ] `supabaseServiceRoleKey: "✓ Set"`
- [ ] 데이터베이스 연결 확인:
  - [ ] `connected: true`

## ✅ 9. 데이터 동기화 테스트 (선택적)

- [ ] Alpha Vantage API 키 설정
- [ ] 홈 페이지에서 "Sync Data" 버튼 클릭
- [ ] 데이터 동기화 완료 대기
- [ ] Table Editor에서 `stock_prices` 테이블에 데이터 확인

## 🔍 문제 해결

### 환경 변수 오류
- [ ] `.env.local` 파일 존재 확인
- [ ] 환경 변수 이름 확인
- [ ] 개발 서버 재시작
- [ ] `/api/test/connection`에서 누락된 변수 확인

### 데이터베이스 연결 오류
- [ ] Supabase 프로젝트 활성 상태 확인
- [ ] API 키 정확성 확인
- [ ] RLS 정책 확인
- [ ] 네트워크 연결 확인

### RLS 정책 오류
- [ ] 정책 존재 확인
- [ ] 정책 재생성 (필요시)
- [ ] 서비스 역할 키 사용 확인 (서버 사이드)

## 📝 참고 사항

- **서비스 역할 키**: 절대 클라이언트에 노출하지 마세요
- **RLS 정책**: 공개 읽기 전용만 사용
- **쓰기 작업**: 서버 사이드에서만 수행
- **환경 변수**: `.gitignore`에 포함되어 있는지 확인

## ✅ 완료 체크

모든 항목을 완료했다면:
- [ ] 모든 체크리스트 항목 완료
- [ ] 연결 테스트 성공
- [ ] 데이터 동기화 테스트 완료 (선택적)
- [ ] 다음 단계: Alpha Vantage API 키 설정

## 다음 단계

1. ✅ Supabase 설정 완료
2. 다음: Alpha Vantage API 키 설정
3. 다음: 데이터 동기화 테스트
4. 다음: 차트 및 분석 기능 테스트

