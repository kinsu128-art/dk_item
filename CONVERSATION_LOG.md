# DK-Lok Product Catalog 개발 대화 기록

## 프로젝트 개요
- **목적**: DK-Lok 제품 카탈로그 검색 웹사이트 개발
- **회사**: DK-Lok (dklok.com)
- **제품**: Fittings, Valves

---

## 대화 내용

### 1. 프로젝트 초기화 요청
**User**: product catalog website 들려고해. 제품코드에 대한 정보는 .env.local 파일에 데이터베이스에 담겨져 있어. 고객이 들어와서 제품코드를 검색하는 사이트를 만들고 싶어. 제품은 Fittings 와 Valves 야. 우리 회사는 dklok 이란 회사야. 홈페이지 dklok.com을 참고하면 되.

**Assistant**: MSSQL 데이터베이스 연결 정보 확인 후 Next.js 14 + TypeScript + Tailwind CSS 프로젝트 생성

---

### 2. 데이터베이스 테이블 구조 확인
**User**: 테이블 구조 확인해줘

**Assistant**: 테이블 구조 확인:
- `BK_ProductGroup` (502건) - 제품 시리즈
- `B_ThreadType` (1,244건) - 나사 타입 정보

---

### 3. Connection 선택 기능 추가
**User**: 검색결과에서 나온 ProdSeries에해당하는 BK_ProductGroup 에서 읽은 EndNum 만큼 ConnectionType을 선택할 수 있게 만들어줘. 해당 ConnetionType은 a_ConnectionType table을 참조해줘. ConnectionType 선택 후에는 아래에 ConnectionType 선택한 값에 따라 ConnectionSpec을 보여주고 선택하게 할거야 ConnectionSpec 을 참조하는 테이블을 a_connectionSpec table 이야 ConnectionSpec이 선택되면 ConnectionSize를 선택하게 해줘. 참조 테이블은 a_connectionSize 테이블이야.

**Assistant**: 3단계 선택 구현 (ConnectionType → ThreadSpec → ThreadSize)

---

### 4. 4단계 선택으로 변경
**User**: Connection Type 선택 ( Table : a_connctionType) -> Thread Type 선택 ( table : a_treadType ) -> Thread Spec 선택 ( table : a_threadSpec ) -> Thread Size 선택 ( table : a_threadSize ) 이걸로 버꿔줘.

**Assistant**: 4단계 선택으로 변경:
```
A_ConnectionType (14건)
    ↓ connectionTypeCode
A_ThreadType (37건)
    ↓ threadTypeCode
A_ThreadSpec (240건)
    ↓ threadSpecCode
A_ThreadSize (1,837건)
```

---

### 5. End Connection 레이블 변경
**User**: End1 End2 를 End Connection으로 수정해줘.

**Assistant**: "End 1" → "End Connection 1" 로 변경

---

### 6. 재질 선택 추가
**User**: Connection 설정 전에 재질 선택하는 항목을 넣고 싶어. 해당 테이블을 b_MaterialGroup 을 사용할거야.

**Assistant**: MaterialSelector 컴포넌트 추가, `b_MaterialGroup` 테이블 (12건) 연동

---

### 7. 제품코드 생성 기능
**User**: 모든 선택이 끝났을 경우 ProdSeriesName 옆에 {ProdSeriesName}-{degignator}-{materialGroup_cd} 형태의 제품코드를 크게 보여줘.

**Assistant**: ProductConfigurator 컴포넌트 생성, 모든 선택 완료 시 제품코드 표시
예: `DMC-4N-8N-S`

---

### 8. 서브 페이지 분리
**User**: prodSeries를 선택했을때 이후의 작업은 서브 페이지로 이동하여 이뤄졌으면 해. 바꿔줘.

**Assistant**: `/product/[productCode]` 서브 페이지 생성, 메인 페이지에서 클릭 시 이동

---

### 9. 로고 추가
**User**: 헤더에 로고 추가해줘

**Assistant**: SVG 로고 컴포넌트 생성

**User**: 로고는 dklok.com에 있는 로고를 사용해줘.

**Assistant**: dklok.com에서 공식 로고 다운로드 후 적용 (`/public/images/dklok_logo.png`)

---

### 10. 푸터 위치 고정
**User**: © 2026 DK-Lok Corporation. All rights reserved. 이부분은 데이터가 없어도 항상 페이지 푸터에 있도록 위치해줘.

**Assistant**: Flexbox 레이아웃으로 변경하여 푸터가 항상 하단에 위치하도록 수정

---

## 최종 프로젝트 구조

```
DKproducts/
├── public/
│   └── images/
│       └── dklok_logo.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/route.ts
│   │   │   ├── materials/route.ts
│   │   │   ├── connection-types/route.ts
│   │   │   ├── thread-types/route.ts
│   │   │   ├── thread-specs/route.ts
│   │   │   └── thread-sizes/route.ts
│   │   ├── product/
│   │   │   └── [productCode]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ProductConfigurator.tsx
│   │   ├── MaterialSelector.tsx
│   │   └── EndConnectionSelector.tsx
│   ├── lib/
│   │   └── db.ts
│   └── types/
│       └── product.ts
├── .env.local
├── CLAUDE.md
├── package.json
└── ...config files
```

## 주요 명령어

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
```

## 데이터베이스 테이블 관계

```
BK_ProductGroup (502건) - 제품 시리즈
  └─ EndNum: Connection 선택기 개수

b_MaterialGroup (12건) - 재질

A_ConnectionType (14건)
    ↓ connectionTypeCode
A_ThreadType (37건)
    ↓ threadTypeCode
A_ThreadSpec (240건)
    ↓ threadSpecCode
A_ThreadSize (1,837건)
```

## 제품코드 형식

`{ProdSeries}-{End1 degignator}-{End2 degignator}-...-{MaterialGroup_cd}`

예시:
- 2 End 제품: `DMC-4N-8N-S`
- 3 End 제품: `DTT-4N-6N-8N-SS`
