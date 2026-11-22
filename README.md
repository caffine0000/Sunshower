# Sunshower · CYOA Studio

시각적 메이킹과 플레이를 분리한 CYOA 웹사이트입니다.

플레이 탭: 빌딩 · 스토리 · 인연 · 정보 · 추출/입력.

소스는 dist/, GitHub Pages 배포 설정은 .github/workflows/pages.yml에 있습니다.

## 테스트와 라이브 배포

기존 `dist/`는 테스트용 원본입니다. 저장소 루트에서 다음 명령을 실행하고 브라우저에서 `http://localhost:8000/`을 엽니다.

```sh
python3 -m http.server 8000 --directory dist
```

테스트에서는 화면 테마와 명함 테마의 해금 조건을 건너뜁니다. 브라우저 저장 키에는 `sunshower.test.` 접두사가 붙습니다. 라이브는 기존 저장 키를 그대로 사용합니다. 세이브 코드로 두 환경 사이에 진행 기록을 옮길 수 있습니다.

같은 저장소 루트에서 다음 명령을 실행하면 별도의 `live/`를 자동으로 만듭니다.

```sh
node scripts/prepare-release.cjs
```

이 명령은 `dist/`를 복사하고, 복사본의 HTML만 라이브 채널로 전환한 뒤 성능과 캐시 갱신을 위해 버전이 붙은 앱·엔진·CSS 파일을 연결합니다. 수정은 `dist/`에서 합니다. `live/`는 생성 결과이므로 Git에 커밋하지 않습니다. 새 라이브 빌드를 브라우저로 확인하려면 `python3 -m http.server 8001 --directory live`를 실행하고 `http://localhost:8001/`을 엽니다.

개발 중에는 `dist/`를 수정하고 `main`에 커밋을 올릴 수 있습니다. 공개 사이트는 마지막으로 배포한 버전을 계속 제공합니다.

공개 배포는 요청한 시점에만 실행합니다. GitHub의 **Actions → Deploy CYOA to GitHub Pages → Run workflow**에서 `main`을 선택하면 됩니다. CLI에서는 저장소 루트에서 `gh workflow run pages.yml --ref main`을 실행합니다. 이 워크플로가 검사를 실행하고 `live/`를 새로 만들어 기존 GitHub Pages 주소에 게시합니다.

라이브에서 선택한 화면 테마나 명함 테마의 해금 조건이 사라지면 각각 ‘수사관 사무실의 유리창’과 ‘유리 명함’으로 돌아가며, 기본값을 브라우저에 다시 저장합니다. 명함 테마에 해금 조건을 추가하려면 `dist/app.js`의 `cardThemes` 항목에 `unlock(player, project)`를 지정합니다. 기존 명함 세 종류에는 별도 조건이 없습니다.
