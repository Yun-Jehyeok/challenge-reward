# 챌린지형 리워드 앱

사용자가 챌린지에 참여하고, 행동 인증을 통해 보상을 획득하는 플랫폼.

핵심 루프: 챌린지 참여 → 인증 업로드 → 참여자 승인 → 복권 지급 → 광고 시청 → 스크래치 → 포인트 적립

## 구조

```
challenge-reward/
├── backend/    # NestJS API 서버
├── frontend/   # Expo (React Native) 앱
└── shared/     # 공유 타입
```

## 시작하기

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npx expo start
```

## 기술 스택

| | 기술 |
|--|------|
| Backend | NestJS, TypeScript, TypeORM, PostgreSQL |
| Frontend | Expo (React Native), TypeScript, expo-router, TanStack Query, Zustand |
| Storage | AWS S3 + CloudFront |
| 광고 | Google AdMob |
| 푸시 | Firebase FCM |
