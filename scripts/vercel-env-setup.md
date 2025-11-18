# Vercel 환경 변수 설정 가이드

Vercel Dashboard에서 환경 변수를 설정하는 방법입니다.

## 📋 환경 변수 목록

### 필수 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 선택적 환경 변수

```bash
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

## 🔧 Vercel Dashboard에서 설정 방법

### 1단계: 프로젝트 설정 접근

1. Vercel Dashboard에서 프로젝트 선택
2. "Settings" 탭 클릭
3. "Environment Variables" 메뉴 클릭

### 2단계: 환경 변수 추가

각 환경 변수를 추가합니다:

1. "Add New" 버튼 클릭
2. **Key** 입력 (예: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value** 입력 (실제 값)
4. **Environment** 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (선택적)
5. "Save" 버튼 클릭

### 3단계: 환경 변수 확인

모든 환경 변수가 추가되었는지 확인:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ALPHA_VANTAGE_API_KEY` (선택적)
- [ ] `NEXT_PUBLIC_APP_URL` (선택적)

## 🔄 환경 변수 업데이트 후 재배포

환경 변수를 추가하거나 수정한 후:

1. "Redeploy" 버튼 클릭
2. 또는 새로운 커밋 푸시
3. 배포 완료 대기

## 🔍 환경 변수 확인

### 배포 후 확인

배포 완료 후 다음 URL에서 확인:

```
https://your-project.vercel.app/api/test/connection
```

성공 응답:
```json
{
  "success": true,
  "environment": {
    "supabaseUrl": "✓ Set",
    "supabaseAnonKey": "✓ Set",
    "supabaseServiceRoleKey": "✓ Set"
  }
}
```

## ⚠️ 주의사항

### 보안
- ⚠️ **service_role key는 절대 공개하지 마세요**
- ⚠️ 환경 변수는 Vercel Dashboard에서만 관리
- ⚠️ GitHub에 환경 변수 커밋하지 마세요

### 환경 분리
- Production과 Preview 환경을 분리하여 관리
- 민감한 정보는 Production에만 설정 (선택적)
- 개발 환경 변수는 Development에만 설정 (선택적)

## 📝 체크리스트

- [ ] 모든 필수 환경 변수 추가
- [ ] 환경 변수 값 정확성 확인
- [ ] Production 환경 선택
- [ ] Preview 환경 선택 (선택적)
- [ ] 재배포 완료
- [ ] 연결 테스트 성공

## 🆘 문제 해결

### 환경 변수가 적용되지 않음
- 환경 변수 추가 후 재배포 필요
- 환경 변수 이름 정확성 확인
- 대소문자 구분 확인

### 연결 오류
- `/api/test/connection`에서 오류 메시지 확인
- 환경 변수 값 정확성 확인
- Supabase 프로젝트 활성 상태 확인

## 참고 자료

- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [배포 가이드](./DEPLOYMENT.md)

