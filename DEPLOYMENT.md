# Vercel 배포 가이드

Tesla Stock Analysis 프로젝트를 Vercel에 배포하는 방법입니다.

## 📋 사전 요구사항

- [x] Git 저장소에 프로젝트 푸시 완료
- [x] Supabase 프로젝트 설정 완료
- [x] Alpha Vantage API 키 발급 (선택적)

## 🚀 배포 단계

### 1단계: Vercel 계정 생성 및 로그인

1. [Vercel](https://vercel.com) 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장)

### 2단계: 프로젝트 import

1. Vercel Dashboard에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (프로젝트 루트)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)

### 3단계: 환경 변수 설정

**중요**: 배포 전에 환경 변수를 설정해야 합니다!

1. 프로젝트 설정 페이지에서 "Environment Variables" 클릭
2. 다음 환경 변수 추가:

#### 필수 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL
= https://xxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY
= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 선택적 환경 변수

```
ALPHA_VANTAGE_API_KEY
= your_alpha_vantage_api_key

NEXT_PUBLIC_APP_URL
= https://your-project.vercel.app
```

3. 각 환경 변수에 대해 환경 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (선택적)

### 4단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인
3. 배포 완료 대기 (약 2-3분)

### 5단계: 배포 확인

1. 배포 완료 후 제공되는 URL 확인
2. 브라우저에서 사이트 접속
3. 연결 테스트: `https://your-project.vercel.app/api/test/connection`

## 🔧 환경 변수 설정 상세

### Vercel Dashboard에서 설정

1. 프로젝트 선택
2. "Settings" → "Environment Variables"
3. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 환경 변수 값
   - **Environment**: Production, Preview, Development 선택

### 환경 변수 목록

| 변수 이름 | 설명 | 필수 | 예시 |
|---------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | ✅ | `eyJhbGci...` |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API 키 | ❌ | `your_api_key` |
| `NEXT_PUBLIC_APP_URL` | 애플리케이션 URL | ❌ | `https://your-project.vercel.app` |

## 🔍 배포 후 확인 사항

### 1. 연결 테스트
```
https://your-project.vercel.app/api/test/connection
```

성공 응답:
```json
{
  "success": true,
  "message": "Supabase connection successful"
}
```

### 2. 홈 페이지 확인
```
https://your-project.vercel.app
```

### 3. 차트 페이지 확인
```
https://your-project.vercel.app/chart
```

### 4. 분석 페이지 확인
```
https://your-project.vercel.app/analysis
```

## 🔄 자동 배포 설정

### GitHub 연동
Vercel은 GitHub와 연동되어 자동으로 배포됩니다:

1. **Production 배포**: `main` 또는 `master` 브랜치에 푸시 시
2. **Preview 배포**: 다른 브랜치에 푸시 시
3. **Pull Request**: PR 생성 시 자동 Preview 배포

### 배포 설정 변경
1. 프로젝트 설정 → "Git"
2. 배포 브랜치 변경 가능
3. 자동 배포 활성화/비활성화 가능

## 🌍 커스텀 도메인 설정 (선택적)

### 도메인 추가
1. 프로젝트 설정 → "Domains"
2. 도메인 추가
3. DNS 설정 가이드 따르기

### 도메인 인증
1. DNS 레코드 추가 (가이드 제공)
2. 인증 완료 대기
3. SSL 인증서 자동 발급

## 🐛 문제 해결

### 배포 실패
**증상**: 배포가 실패함

**해결**:
1. 빌드 로그 확인
2. 환경 변수 확인
3. 의존성 문제 확인
4. Next.js 설정 확인

### 환경 변수 오류
**증상**: "Missing environment variables" 오류

**해결**:
1. Vercel Dashboard에서 환경 변수 확인
2. 환경 변수 이름 정확성 확인
3. 환경 변수 값 확인
4. 재배포

### Supabase 연결 오류
**증상**: 데이터를 불러올 수 없음

**해결**:
1. `/api/test/connection`에서 오류 확인
2. Supabase 프로젝트 활성 상태 확인
3. API 키 정확성 확인
4. RLS 정책 확인

### 빌드 오류
**증상**: 빌드 중 오류 발생

**해결**:
1. 로컬에서 빌드 테스트: `npm run build`
2. 빌드 로그 확인
3. TypeScript 오류 확인
4. 의존성 문제 확인

## 📊 배포 모니터링

### Analytics
1. 프로젝트 설정 → "Analytics"
2. Vercel Analytics 활성화 (선택적)
3. 사용자 행동 분석

### 로그 확인
1. 프로젝트 Dashboard → "Deployments"
2. 각 배포의 로그 확인
3. 런타임 로그 확인

## 🔐 보안 주의사항

### API 키 보안
- ⚠️ **service_role key는 절대 클라이언트에 노출하지 마세요**
- ⚠️ 환경 변수는 Vercel Dashboard에서만 관리
- ⚠️ GitHub에 환경 변수 커밋하지 마세요

### 환경 변수 관리
- Production과 Preview 환경 분리
- 민감한 정보는 Production에만 설정
- 정기적으로 환경 변수 검토

## 📝 배포 체크리스트

- [ ] Git 저장소에 프로젝트 푸시 완료
- [ ] Vercel 계정 생성 및 로그인
- [ ] 프로젝트 import 완료
- [ ] 환경 변수 설정 완료
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ALPHA_VANTAGE_API_KEY` (선택적)
- [ ] 배포 완료
- [ ] 연결 테스트 성공
- [ ] 홈 페이지 확인
- [ ] 차트 페이지 확인
- [ ] 분석 페이지 확인

## 🎉 배포 완료!

배포가 완료되면 다음을 확인하세요:

1. ✅ 사이트가 정상적으로 작동하는지 확인
2. ✅ Supabase 연결 확인
3. ✅ 데이터 동기화 테스트 (선택적)
4. ✅ 모든 페이지 정상 작동 확인

## 다음 단계

1. ✅ Vercel 배포 완료
2. 다음: 커스텀 도메인 설정 (선택적)
3. 다음: Analytics 설정 (선택적)
4. 다음: 모니터링 설정 (선택적)

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경 변수 가이드](https://vercel.com/docs/concepts/projects/environment-variables)

