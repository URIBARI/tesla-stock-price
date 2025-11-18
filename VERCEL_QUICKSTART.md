# Vercel 배포 빠른 시작 가이드

5분 안에 Vercel에 배포하는 방법입니다.

## 🚀 빠른 배포 (5단계)

### 1️⃣ Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. "Sign Up" → GitHub 계정으로 로그인

### 2️⃣ 프로젝트 Import
1. Dashboard에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 선택
3. "Import" 클릭

### 3️⃣ 환경 변수 설정 ⚠️ 중요!
프로젝트 설정 페이지에서 "Environment Variables" 클릭하고 다음 추가:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
ALPHA_VANTAGE_API_KEY = your_api_key (선택적)
```

**각 환경 변수에 대해:**
- Production ✅
- Preview ✅
- Development (선택적)

### 4️⃣ 배포
1. "Deploy" 버튼 클릭
2. 배포 완료 대기 (2-3분)

### 5️⃣ 확인
1. 제공된 URL에서 사이트 확인
2. `/api/test/connection` 접속하여 연결 테스트

## ✅ 배포 체크리스트

- [ ] Vercel 계정 생성
- [ ] GitHub 저장소 import
- [ ] 환경 변수 설정
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ALPHA_VANTAGE_API_KEY` (선택적)
- [ ] 배포 완료
- [ ] 연결 테스트 성공

## 🔍 문제 해결

### 배포 실패
- 빌드 로그 확인
- 환경 변수 확인
- 로컬에서 `npm run build` 테스트

### 연결 오류
- `/api/test/connection`에서 오류 확인
- 환경 변수 값 확인
- Supabase 프로젝트 상태 확인

## 📚 상세 가이드

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 🎉 완료!

배포가 완료되면 사이트가 자동으로 업데이트됩니다!
- `main` 브랜치에 푸시 → Production 배포
- 다른 브랜치에 푸시 → Preview 배포

