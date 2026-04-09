# All-in-One 단위 변환기

기존 Python Tkinter 기준본의 입력 처리 방식과 결과 표 구조를 유지하면서, 휴대폰 브라우저에서 바로 쓸 수 있도록 포팅한 정적 웹앱입니다.

## 파일 구성

```text
계산기 홈페이지 ver/
├─ index.html
├─ style.css
├─ app.js
├─ manifest.webmanifest
├─ sw.js
├─ README.md
└─ icons/
   ├─ icon.svg
   ├─ icon-192.png
   ├─ icon-512.png
   └─ icon-maskable-512.png
```

## 포함 기능

- 길이 변환: `mil ↔ mm`
- 열저항 변환: `kcm2/w ↔ kin2/w`
- 압력 변환: `psi ↔ kpa`
- 점도 변환:
  - `dPa·s ↔ cP`
  - `cP ↔ Pa·s`
  - `dPa·s ↔ Pa·s`
- 공백, 쉼표, 줄바꿈 붙여넣기 입력 지원
- 숫자 오류 표시
- 결과 표 전체 복사
- 결과 지우기
- 단위 자동 반대 선택
- 단위 스왑
- 홈화면 추가 가능한 PWA 셸 포함

## GitHub Pages에 올리는 방법

### 1. 저장소 만들기

1. GitHub에서 새 저장소를 생성합니다.
2. 저장소 이름은 원하는 이름으로 정하면 됩니다. 예: `unit-converter`
3. 이 폴더 안의 파일들을 저장소 루트에 그대로 업로드합니다.

즉, 업로드 후 GitHub 저장소 루트가 아래처럼 보여야 합니다.

```text
unit-converter/
├─ index.html
├─ style.css
├─ app.js
├─ manifest.webmanifest
├─ sw.js
├─ README.md
└─ icons/
```

### 2. GitHub에 업로드하기

터미널을 쓰는 경우:

```bash
git init
git add .
git commit -m "Add static unit converter web app"
git branch -M main
git remote add origin https://github.com/사용자이름/저장소이름.git
git push -u origin main
```

직접 업로드하는 경우:

1. GitHub 저장소 페이지로 이동합니다.
2. `Add file` → `Upload files`를 누릅니다.
3. 이 폴더 안의 모든 파일과 `icons` 폴더를 업로드합니다.
4. `Commit changes`를 눌러 저장합니다.

### 3. GitHub Pages 배포 켜기

1. 저장소의 `Settings`로 이동합니다.
2. 왼쪽 메뉴에서 `Pages`를 클릭합니다.
3. `Build and deployment`에서 `Source`를 `Deploy from a branch`로 선택합니다.
4. 브랜치는 `main`, 폴더는 `/ (root)`를 선택합니다.
5. 저장하면 잠시 후 배포 주소가 생성됩니다.

예시:

```text
https://사용자이름.github.io/저장소이름/
```

이 주소로 접속하면 PC가 꺼져 있어도, 같은 Wi-Fi가 아니어도 휴대폰에서 바로 사용할 수 있습니다.

## 모바일 홈화면에 추가하는 방법

### Android Chrome

1. 배포된 GitHub Pages 주소를 엽니다.
2. 브라우저 메뉴를 엽니다.
3. `홈 화면에 추가` 또는 `앱 설치`를 선택합니다.
4. 홈화면에 아이콘이 생기면 일반 앱처럼 실행할 수 있습니다.

### iPhone Safari

1. 배포된 GitHub Pages 주소를 엽니다.
2. 하단 공유 버튼을 누릅니다.
3. `홈 화면에 추가`를 선택합니다.
4. 이름을 확인한 뒤 추가하면 홈 화면에서 앱처럼 열 수 있습니다.

## 로컬에서 테스트하는 방법

브라우저에서 `index.html`만 바로 열어도 기본 계산은 확인할 수 있습니다. 다만 PWA 설치와 서비스 워커까지 테스트하려면 정적 서버로 여는 것이 좋습니다.

### 방법 1. Python 내장 서버

```bash
python -m http.server 8000
```

그 뒤 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:8000/
```

### 방법 2. VS Code Live Server

1. VS Code로 폴더를 엽니다.
2. `Live Server` 확장을 사용해 현재 폴더를 엽니다.
3. 브라우저에서 표시되는 주소로 접속합니다.

## 사용 방법

1. `값 입력`에 숫자를 하나 이상 입력합니다.
2. 변환 종류를 선택합니다.
3. 입력 단위와 변환 단위를 확인합니다.
4. `변환 실행` 버튼을 누르거나 Enter를 누릅니다.
5. 결과 표에서 각 행을 탭하면 해당 결과값만 복사됩니다.
6. `전체 복사`를 누르면 표 전체가 탭 구분 텍스트로 복사됩니다.
7. `결과 지우기`를 누르면 현재 결과를 한 번에 지울 수 있습니다.

## 수정 포인트

- 변환 항목 추가: `app.js`의 `convertTypes`, `convertFormulas` 수정
- 색상/스타일 변경: `style.css` 수정
- 앱 이름/아이콘 변경: `index.html`, `manifest.webmanifest`, `icons/` 수정
