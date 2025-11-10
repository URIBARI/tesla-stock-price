# Supabase 데이터베이스 설정 가이드

이 문서는 Tesla Stock Analysis 프로젝트의 Supabase 데이터베이스 설정 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성
1. [Supabase](https://supabase.com)에 접속
2. "Start your project" 버튼 클릭
3. GitHub 계정으로 로그인 (또는 이메일로 가입)

### 1.2 새 프로젝트 생성
1. Dashboard에서 "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: `tesla-stock-analysis` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요!)
   - **Region**: 가장 가까운 리전 선택 (예: `Northeast Asia (Seoul)`)
   - **Pricing Plan**: Free tier 선택
3. "Create new project" 클릭
4. 프로젝트 생성 완료까지 약 2분 대기

## 2. 데이터베이스 스키마 설정

### 2.1 SQL Editor 접근
1. Supabase Dashboard에서 왼쪽 메뉴의 "SQL Editor" 클릭
2. "New query" 버튼 클릭

### 2.2 스키마 실행
1. `supabase/schema.sql` 파일의 전체 내용을 복사
2. SQL Editor에 붙여넣기
3. "Run" 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)
4. 성공 메시지 확인

### 2.3 테이블 확인
1. 왼쪽 메뉴에서 "Table Editor" 클릭
2. 다음 테이블이 생성되었는지 확인:
   - `stock_prices`
   - `technical_indicators`
   - `news`

## 3. 환경 변수 설정

### 3.1 API 키 확인
1. Supabase Dashboard에서 "Settings" → "API" 클릭
2. 다음 정보를 확인:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ 비밀!)

### 3.2 로컬 환경 변수 설정
1. 프로젝트 루트에 `.env.local` 파일 생성
2. 다음 내용을 입력 (실제 값으로 변경):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Alpha Vantage API
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 환경 변수 확인
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ 절대 공개하지 마세요!)

## 4. Row Level Security (RLS) 정책 확인

### 4.1 RLS 활성화 확인
1. "Table Editor"에서 각 테이블 클릭
2. "Policies" 탭에서 RLS가 활성화되어 있는지 확인

### 4.2 정책 확인
각 테이블에 다음 정책이 있는지 확인:
- **stock_prices**: "Allow public read access on stock_prices"
- **technical_indicators**: "Allow public read access on technical_indicators"
- **news**: "Allow public read access on news"

## 5. 연결 테스트

### 5.1 개발 서버 실행
```bash
npm run dev
```

### 5.2 테스트 스크립트 실행 (선택적)
테스트용 스크립트를 만들어 연결을 확인할 수 있습니다.

## 6. 문제 해결

### 6.1 환경 변수 오류
**문제**: "Missing Supabase environment variables" 오류
**해결**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름이 정확한지 확인
3. 개발 서버를 재시작

### 6.2 RLS 정책 오류
**문제**: 데이터를 읽을 수 없음
**해결**:
1. SQL Editor에서 정책이 제대로 생성되었는지 확인
2. 정책을 다시 생성:
```sql
-- 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Allow public read access on stock_prices" ON stock_prices;
CREATE POLICY "Allow public read access on stock_prices" ON stock_prices
    FOR SELECT USING (true);
```

### 6.3 권한 오류
**문제**: 데이터를 삽입/수정할 수 없음
**해결**:
1. `SUPABASE_SERVICE_ROLE_KEY`가 올바른지 확인
2. 서버 사이드 코드에서 `supabaseAdmin`을 사용하는지 확인

## 7. 보안 주의사항

### 7.1 API 키 보안
- ⚠️ **service_role key는 절대 클라이언트에 노출하지 마세요**
- ⚠️ `.env.local` 파일은 `.gitignore`에 포함되어 있는지 확인
- ⚠️ GitHub에 API 키를 커밋하지 마세요

### 7.2 RLS 정책
- 공개 읽기 전용 정책만 사용 (쓰기는 서버 사이드에서만)
- 서비스 역할 키는 서버 사이드에서만 사용

## 8. 다음 단계

1. ✅ Supabase 프로젝트 생성 완료
2. ✅ 데이터베이스 스키마 설정 완료
3. ✅ 환경 변수 설정 완료
4. 다음: Alpha Vantage API 키 설정
5. 다음: 데이터 동기화 테스트

## 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API 문서](https://supabase.com/docs/reference/javascript/introduction)

