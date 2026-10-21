# LIZ CLINIC

가상 프리미엄 피부과의 전체 메인페이지입니다. 1차 Header, Hero, Digital Docent 디자인을 유지하며 진료 철학, 시그니처 프로그램, 진료 과정, 비교 데모, 공간, 상담·예약, 위치 및 정식 푸터를 확장했습니다. HTML5, CSS3, Vanilla JavaScript로 동작하며 빌드나 런타임 패키지 설치가 필요하지 않습니다.

## 실행

VS Code에서 이 폴더를 열고 `index.html`을 **Live Server → Open with Live Server**로 실행합니다. 파일을 브라우저에서 직접 열어도 기본 동작을 확인할 수 있습니다. 외부 CDN이나 API 없이 이미지와 폰트를 로컬에서 불러옵니다.

## 파일 구성

- `index.html`: 전체 섹션, 내비게이션, 모바일 고정 바, 네이티브 dialog 모달
- `css/reset.css`: 기본 스타일 초기화
- `css/variables.css`: 컬러, 폰트, 최대 너비, 여백 등 공통 디자인 토큰
- `css/common.css`: 로컬 폰트, 레이아웃, 버튼, 포커스 및 모션 감소 설정
- `css/style.css`: 데스크톱 섹션 및 모달 디자인
- `css/responsive.css`: 태블릿·모바일 레이아웃
- `js/main.js`: 4개 고민 카테고리와 12개 시술 예시, 탭·메뉴·모달, 프로그램 연결, 비교 슬라이더, 스크롤 등장 처리
- `images/hero/`: 광고 문구를 제외한 모델 크롭, 모바일/소형 이미지
- `images/treatments/`: 콜라주에서 분리한 장비별 WebP와 소형 이미지
- `images/model/`: 보관용 모델 정면·측면·클로즈업 크롭
- `images/editorial/`: 진료 철학, 프로그램, 비교 데모의 모델 이미지
- `images/space/`: 리셉션·상담·시술·대기 공간 콘셉트 크롭
- `assets/fonts/`: Cormorant Garamond, Pretendard 및 각각의 OFL 라이선스
- `scripts/prepare-images.cjs`: 선택적 이미지 전처리 도구. 사이트 실행에는 필요 없음
- `scripts/preview.cjs`, `scripts/verify.cjs`: 선택적 로컬 검증 서버와 브라우저 기능 검증
- `QA.md`: 검증 범위와 실제 운영 전 교체 항목

## 디자인 및 인터랙션

Cream White `#FDFBF7`, Warm Ivory `#F5F1EA`, Deep Charcoal `#22252A`를 중심으로 구성했습니다. Bronze `#C2A682`는 선택 표시와 강조에 사용하고, 작은 글씨에는 대비를 위한 진한 Bronze `#806446`를 사용합니다. 콘텐츠 최대 너비는 1280px입니다.

PC는 텍스트와 모델 사진을 나눈 에디토리얼 Hero, 3열 시술 콘텐츠, 비대칭 인물·프로그램·공간 레이아웃을 사용합니다. 1199px 이하에서는 겹침을 피하도록 드로어 메뉴로 전환하고, 태블릿의 진료 과정은 2열로 조정합니다. 767px 이하에서는 세로 Hero, 새 섹션의 1열 구성, 스크롤 스냅 카드 및 하단 상담·예약 고정 바를 제공합니다. 고정 바와 본문 여백에 `safe-area-inset-*`를 반영했습니다.

- Header: 스크롤 시 배경과 하단 경계 전환. 소개·의료진·탐색·비교·예약 섹션으로 이동
- Treatments/Hero CTA: Digital Docent로 이동
- 고민 탭: 클릭, Enter/Space, 좌우 방향키, Home/End 지원. ARIA tab/tabpanel 연결
- 카드: 상세 안내 및 상담 모달, 이미지 hover 확대, 모바일 터치 스와이프
- 프로그램 링크: 해당 피부 고민 탭을 선택한 뒤 Digital Docent로 이동
- 비교 데모: 동일 이미지의 컬러/흑백 표현을 포인터 드래그·터치·키보드로 비교. 실제 환자나 치료 결과를 표현하지 않음
- 전화·위치·개인정보·포트폴리오: 실제 운영 정보를 임의로 생성하지 않는 안내 모달
- 모달/메뉴: 배경 스크롤 잠금, 네이티브 포커스 제한, ESC 닫기, 호출 버튼으로 포커스 복귀
- 모션: 최초 등장, 탭 전환, 새 섹션의 1회 스크롤 등장. `prefers-reduced-motion` 및 실행 중 설정 변경 지원
- 이미지: WebP, `srcset`/`sizes`, 고정 크기, Hero 우선 로딩, 카드 지연 로딩

## 이미지 출처 및 표시

사용자가 제공한 PNG 원본과 일치하는 로컬 파일에서 크롭했습니다. 원본은 수정하지 않았습니다.

| 에셋 | 사용한 제공 원본 |
| --- | --- |
| Hero | `a_high_end_soft_lit_minimalist_beauty_clinic_adv.png`의 모델 영역 |
| 장비 4종 | `a_clean_professional_high_end_medical_dermatolog.png`의 각 열, 하단 광고 문구와 구분선 제외 |
| 보관 모델 3종 | `a_large_collage_portfolio_style_editorial_photo_gr.png`의 독립 사진 영역 |
| 철학·프로그램 모델 | 위 모델 콜라주의 개별 사진 영역 |
| 비교 데모 | Hero와 같은 원본 크롭을 양쪽에 사용. CSS 흑백 표시만 적용 |
| 리셉션·상담·대기 공간 | `a_high_end_editorial_minimal_collage_board_layou.png`의 개별 공간 영역 |
| 시술 공간 | `wide_clean_professional_medical_aesthetics_clini.png`의 하단 왼쪽 공간 |

가로 이미지와 큰 이미지에서 같은 원본 이상의 디테일이 생성되지는 않습니다. 실제 서비스에서 더 큰 화면의 선명도를 높이려면 고해상도 원본으로 교체하세요. 모델 이미지는 PC/모바일 별도 파일을 통해 향후 크롭을 독립적으로 교체할 수 있습니다.

의료기기 이미지는 AI 콘셉트 비주얼입니다. 공식 제조사 이미지가 아니며, 카드별 장비 사용을 확정하지 않습니다. 관련 고지를 이미지와 탐색 영역 하단에 표시했습니다. 실제 공개 서비스에 사용할 때는 원본 이미지의 이용 권한 및 장비 이미지의 정확성을 별도로 확인해야 합니다.

## 검증

로컬 Edge(Chromium)에서 360, 390, 768, 1024, 1440, 1920px 화면을 검증했습니다.

- 전체 페이지 가로 넘침 없음
- 4개 탭, 12개 시술 콘텐츠 및 모든 연결 이미지 정상 로딩
- 방향키 및 Home/End 탭 조작 정상
- 상세 → 상담 모달 전환, ESC 닫기, 포커스 제한·복귀 정상
- 모바일 메뉴, 메뉴 링크 이동, 배경 스크롤 잠금 정상
- 모바일 카드 터치 스와이프 정상
- 비교 슬라이더의 마우스 드래그, 모바일 터치, 키보드 방향키 및 Home/End 정상
- 프로그램에서 관련 고민 탭으로 이동, 전화·개인정보·포트폴리오·위치 모달 정상
- 모바일 하단 바 위치 및 푸터 링크 가림 없음
- 390×640의 짧은 화면에서 메뉴 하단 링크 접근 및 닫힘 정상
- JS 오류 및 HTTP 4xx/5xx 없음
- 로컬 폰트 로딩 및 모션 감소 설정 정상

검증은 로컬 Edge(Chromium)의 화면 크기·터치 에뮬레이션으로 수행했습니다. 실제 iOS Safari/Android 기기, 노치가 있는 기기의 Safe Area는 미검증입니다. 상세 범위는 `QA.md`에 기록했습니다.

선택적 검증 재현:

```text
npm install --prefix .tools --no-audit --no-fund playwright sharp
node scripts/preview.cjs
```

다른 터미널에서 `node scripts/verify.cjs`를 실행하면 `.qa/v2/`에 화면 캡처와 결과 JSON을 저장합니다. 이 개발 도구는 사이트 실행에 필요하지 않습니다.

## 향후 확장

시술 콘텐츠는 `js/main.js`의 `treatments`와 `categories`에서 관리합니다. 실제 서비스 연결 시 `[data-consult]`, `[data-phone]`, `[data-location]` 핸들러와 모달 내용을 교체하세요. 이후 섹션은 `main` 내부에 공통 `.container`, `.section-space`, `.section-title` 및 디자인 토큰을 재사용해 추가할 수 있습니다.

현재는 개인정보를 수집하지 않는 데모이며, 모든 시술 안내는 일반적인 예시입니다. 실제 의료진 프로필·검증된 약력, 병원 주소·전화·진료시간·교통·주차, 고해상도 촬영 이미지와 정식 개인정보 처리방침 및 예약 연결은 실제 운영 전 확정해야 합니다.
