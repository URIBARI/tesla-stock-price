# 빠른 시작 가이드 (Quick Start Guide)

Tesla Stock Analysis 프로젝트를 빠르게 설정하고 실행하는 방법입니다.

## 1단계: Supabase 프로젝트 생성

### 1.1 Supabase 가입 및 프로젝트 생성
1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub로 로그인 (또는 이메일 가입)
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - **Name**: `tesla-stock-analysis`
   - **Database Password**: 강력한 비밀번호 설정 (기록해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택
6. "Create new project" 클릭
7. 프로젝트 생성 완료 대기 (약 2분)

### 1.2 API 키 확인
1. Supabase Dashboard → "Settings" → "API"
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...`
   - **service_role key**: `eyJhbGci...` (⚠️ 비밀!)

## 2단계: 데이터베이스 스키마 설정

### 2.1 SQL Editor에서 스키마 실행
1. Supabase Dashboard → "SQL Editor"
2. "New query" 클릭
3. `supabase/schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)
6. 성공 메시지 확인

### 2.2 테이블 확인
1. "Table Editor" 클릭
2. 다음 테이블 확인:
   - ✅ `stock_prices`
   - ✅ `technical_indicators`
   - ✅ `news`

## 3단계: 환경 변수 설정

### 3.1 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일 생성:

```bash
touch .env.local
```

### 3.2 환경 변수 입력
`.env.local` 파일에 다음 내용 추가 (실제 값으로 변경):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Alpha Vantage API (선택적, 나중에 설정 가능)
ALPHA_VANTAGE_API_KEY=your_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4단계: 의존성 설치 및 실행

### 4.1 의존성 설치
```bash
cd PROJECT/tesla-stock-analysis
npm install
```

### 4.2 개발 서버 실행
```bash
npm run dev
```

### 4.3 브라우저에서 확인
[http://localhost:3000](http://localhost:3000) 접속

## 5단계: Alpha Vantage API 키 설정 (선택적)

### 5.1 API 키 발급
1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key) 접속
2. 무료 API 키 발급
3. `.env.local` 파일에 `ALPHA_VANTAGE_API_KEY` 추가

### 5.2 데이터 동기화
1. 홈 페이지에서 "Sync Data" 버튼 클릭
2. 데이터 동기화 완료 대기
3. 차트 페이지에서 데이터 확인

## 연결 테스트

### API를 통한 연결 테스트
개발 서버가 실행 중일 때:
1. 브라우저에서 [http://localhost:3000/api/test/connection](http://localhost:3000/api/test/connection) 접속
2. JSON 응답 확인:
   - `success: true` → 연결 성공
   - `success: false` → 연결 실패 (에러 메시지 확인)

## 문제 해결

### 환경 변수 오류
**증상**: "Missing Supabase environment variables" 오류

**해결**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 정확한지 확인
3. 개발 서버 재시작: `npm run dev`
4. `/api/test/connection`에서 누락된 환경 변수 확인

### 데이터베이스 연결 오류
**증상**: 데이터를 불러올 수 없음

**해결**:
1. Supabase Dashboard에서 프로젝트가 활성 상태인지 확인
2. API 키가 올바른지 확인
3. RLS 정책이 제대로 설정되었는지 확인 (SQL Editor에서)
4. `/api/test/connection`에서 구체적인 오류 메시지 확인

### RLS 정책 오류
**증상**: "permission denied" 오류

**해결**:
1. SQL Editor에서 다음 쿼리 실행:
```sql
-- 정책 재생성
DROP POLICY IF EXISTS "Allow public read access on stock_prices" ON stock_prices;
CREATE POLICY "Allow public read access on stock_prices" ON stock_prices
    FOR SELECT USING (true);
```
2. 다른 테이블도 동일하게 확인:
```sql
-- technical_indicators
DROP POLICY IF EXISTS "Allow public read access on technical_indicators" ON technical_indicators;
CREATE POLICY "Allow public read access on technical_indicators" ON technical_indicators
    FOR SELECT USING (true);

-- news
DROP POLICY IF EXISTS "Allow public read access on news" ON news;
CREATE POLICY "Allow public read access on news" ON news
    FOR SELECT USING (true);
```

## 다음 단계

1. ✅ Supabase 설정 완료
2. ✅ 환경 변수 설정 완료
3. ✅ 개발 서버 실행 완료
4. 다음: Alpha Vantage API 키 설정
5. 다음: 데이터 동기화 및 테스트

## 추가 자료

- [상세 설정 가이드](./supabase/SETUP.md)
- [PRD 문서](./PRD.md)
- [README](./README.md)

