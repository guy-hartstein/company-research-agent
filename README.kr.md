 [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.es.md)
[![jp](https://img.shields.io/badge/lang-jp-orange.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.jp.md)
[![kr](https://img.shields.io/badge/lang-ko-purple.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.kr.md)


# 기업 조사 에이전트 🔍

![web ui](<static/ui-1.png>)

포괄적인 기업 조사 보고서를 생성하는 멀티 에이전트 도구입니다. 이 플랫폼은 AI 에이전트 파이프라인을 사용하여 모든 기업에 대한 정보를 수집, 정리 및 종합합니다.

✨온라인에서 체험해보세요! https://companyresearcher.tavily.com ✨

https://github.com/user-attachments/assets/0e373146-26a7-4391-b973-224ded3182a9

## 기능

- **멀티소스 조사**: 기업 웹사이트, 뉴스 기사, 재무 보고서, 업계 분석 등 다양한 소스에서 데이터 수집
- **AI 콘텐츠 필터링**: Tavily의 관련성 점수를 사용한 콘텐츠 큐레이션
- **실시간 스트리밍**: WebSocket을 사용하여 조사 진행 상황과 결과를 실시간으로 스트리밍
- **듀얼 모델 아키텍처**:
  - 대규모 컨텍스트 조사 종합을 위한 Gemini 2.0 Flash
  - 정밀한 보고서 형식 지정 및 편집을 위한 GPT-4.1
- **모던 React 프론트엔드**: 실시간 업데이트, 진행 상황 추적, 다운로드 옵션을 갖춘 반응형 인터페이스
- **모듈러 아키텍처**: 전문화된 조사 및 처리 노드 파이프라인을 중심으로 구축

## 에이전트 프레임워크

### 조사 파이프라인

이 플랫폼은 데이터를 순차적으로 처리하는 전문화된 노드를 가진 에이전트 프레임워크를 따릅니다:

1. **조사 노드**:
   - `CompanyAnalyzer`: 핵심 기업 정보 조사
   - `IndustryAnalyzer`: 시장 위치 및 트렌드 분석
   - `FinancialAnalyst`: 재무 지표 및 성과 데이터 수집
   - `NewsScanner`: 최신 뉴스 및 개발 사항 수집

2. **처리 노드**:
   - `Collector`: 모든 분석기에서 조사 데이터 집계
   - `Curator`: 콘텐츠 필터링 및 관련성 점수 매기기 구현
   - `Briefing`: Gemini 2.0 Flash를 사용하여 카테고리별 요약 생성
   - `Editor`: GPT-4.1-mini로 요약을 최종 보고서로 컴파일 및 형식 지정

   ![web ui](<static/agent-flow.png>)

### 콘텐츠 생성 아키텍처

이 플랫폼은 최적의 성능을 위해 서로 다른 모델을 활용합니다:

1. **Gemini 2.0 Flash** (`briefing.py`):
   - 대규모 컨텍스트 조사 종합 처리
   - 대량의 데이터 처리 및 요약에 뛰어남
   - 카테고리별 초기 요약 생성에 사용
   - 여러 문서에 걸친 컨텍스트 유지에 효율적

2. **GPT-4.1 mini** (`editor.py`):
   - 정밀한 형식 지정 및 편집에 특화
   - Markdown 구조 및 일관성 처리
   - 정확한 형식 지정 지침 준수에 우수
   - 다음 용도로 사용:
     - 최종 보고서 컴파일
     - 콘텐츠 중복 제거
     - Markdown 형식 지정
     - 실시간 보고서 스트리밍

이 접근 방식은 Gemini의 대규모 컨텍스트 윈도우 처리 능력과 GPT-4.1-mini의 형식 지정 지침 정밀도를 결합합니다.

### 콘텐츠 큐레이션 시스템

이 플랫폼은 `curator.py`에서 콘텐츠 필터링 시스템을 사용합니다:

1. **관련성 점수 매기기**:
   - 문서는 Tavily의 AI 검색으로 점수가 매겨집니다
   - 계속 진행하려면 최소 임계값(기본값 0.4)이 필요합니다
   - 점수는 검색 쿼리와의 관련성을 반영합니다
   - 높은 점수는 검색 의도와의 더 나은 일치를 나타냅니다

2. **문서 처리**:
   - 콘텐츠가 정규화되고 정리됩니다
   - URL이 중복 제거되고 표준화됩니다
   - 문서가 관련성 점수로 정렬됩니다
   - 진행 상황 업데이트가 WebSocket을 통해 실시간으로 전송됩니다

### 실시간 통신 시스템

이 플랫폼은 WebSocket 기반 실시간 통신 시스템을 구현합니다:

![web ui](<static/ui-2.png>)

1. **백엔드 구현**:
   - FastAPI의 WebSocket 지원 사용
   - 조사 작업당 지속적인 연결 유지
   - 다양한 이벤트에 대한 구조화된 업데이트 전송:
     ```python
     await websocket_manager.send_status_update(
         job_id=job_id,
         status="processing",
         message=f"{category} 브리핑 생성 중",
         result={
             "step": "Briefing",
             "category": category,
             "total_docs": len(docs)
         }
     )
     ```

2. **프론트엔드 통합**:
   - React 컴포넌트가 WebSocket 업데이트를 구독
   - 업데이트가 실시간으로 처리되고 표시됩니다
   - 다양한 UI 컴포넌트가 특정 업데이트 유형을 처리:
     - 쿼리 생성 진행 상황
     - 문서 큐레이션 통계
     - 브리핑 완료 상태
     - 보고서 생성 진행 상황

3. **상태 유형**:
   - `query_generating`: 실시간 쿼리 생성 업데이트
   - `document_kept`: 문서 큐레이션 진행 상황
   - `briefing_start/complete`: 브리핑 생성 상태
   - `report_chunk`: 보고서 생성 스트리밍
   - `curation_complete`: 최종 문서 통계

## 설정

### 빠른 설정 (권장)

시작하는 가장 쉬운 방법은 설정 스크립트를 사용하는 것입니다. 이 스크립트는 자동으로 `uv`를 감지하고 사용 가능할 때 더 빠른 Python 패키지 설치에 사용합니다:

1. 저장소 클론:
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. 설정 스크립트를 실행 가능하게 만들고 실행:
```bash
chmod +x setup.sh
./setup.sh
```

설정 스크립트는 다음을 수행합니다:

- `uv`를 감지하고 더 빠른 Python 패키지 설치에 사용 (사용 가능한 경우)
- 필요한 Python 및 Node.js 버전 확인
- Python 가상 환경 생성 (권장)
- 모든 종속성 설치 (Python 및 Node.js)
- 환경 변수 설정 안내
- 백엔드 및 프론트엔드 서버 시작 (선택사항)

> **💡 프로 팁**: [uv](https://github.com/astral-sh/uv)를 설치하여 훨씬 빠른 Python 패키지 설치를 이용하세요:
>
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

다음 API 키가 필요합니다:
- Tavily API 키
- Google Gemini API 키
- OpenAI API 키
- Google Maps API 키
- MongoDB URI (선택사항)

### 수동 설정

수동으로 설정하려면 다음 단계를 따르세요:

1. 저장소 클론:
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. 백엔드 종속성 설치:
```bash
# 선택사항: 가상 환경 생성 및 활성화
# uv 사용 (더 빠름 - 사용 가능한 경우 권장):
uv venv .venv
source .venv/bin/activate

# 또는 표준 Python:
# python -m venv .venv
# source .venv/bin/activate

# Python 종속성 설치
# uv 사용 (더 빠름):
uv pip install -r requirements.txt

# 또는 pip 사용:
# pip install -r requirements.txt
```

3. 프론트엔드 종속성 설치:
```bash
cd ui
npm install
```

4. **환경 변수 설정**:

이 프로젝트는 백엔드와 프론트엔드용으로 두 개의 별도 `.env` 파일이 필요합니다.

**백엔드 설정:**

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 백엔드 API 키를 추가합니다:

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# 선택사항: MongoDB 지속성 활성화
# MONGODB_URI=your_mongodb_connection_string
```

**프론트엔드 설정:**

`ui` 디렉토리 내에 `.env` 파일을 생성합니다. 먼저 예제 파일을 복사할 수 있습니다:

```bash
cp ui/.env.development.example ui/.env
```

그런 다음, `ui/.env`를 열고 프론트엔드 환경 변수를 추가합니다:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Docker 설정

애플리케이션은 Docker 및 Docker Compose를 사용하여 실행할 수 있습니다:

1. 저장소 클론:
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. **환경 변수 설정**:

Docker 설정은 두 개의 별도 `.env` 파일을 사용합니다.

**백엔드 설정:**

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 백엔드 API 키를 추가합니다:

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# 선택사항: MongoDB 지속성 활성화
# MONGODB_URI=your_mongodb_connection_string
```

**프론트엔드 설정:**

`ui` 디렉토리 내에 `.env` 파일을 생성합니다. 먼저 예제 파일을 복사할 수 있습니다:

```bash
cp ui/.env.development.example ui/.env
```

그런 다음, `ui/.env`를 열고 프론트엔드 환경 변수를 추가합니다:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. 컨테이너 빌드 및 시작:
```bash
docker compose up --build
```

이렇게 하면 백엔드 및 프론트엔드 서비스가 시작됩니다:
- 백엔드 API는 `http://localhost:8000`에서 사용 가능
- 프론트엔드는 `http://localhost:5174`에서 사용 가능

서비스를 중지하려면:
```bash
docker compose down
```

참고: `.env`의 환경 변수를 업데이트할 때 컨테이너를 다시 시작해야 합니다:
```bash
docker compose down && docker compose up
```

### 애플리케이션 실행

1. 백엔드 서버 시작 (옵션 선택):
```bash
# 옵션 1: 직접 Python 모듈
python -m application.py

# 옵션 2: Uvicorn으로 FastAPI
uvicorn application:app --reload --port 8000
```

2. 새 터미널에서 프론트엔드 시작:
```bash
cd ui
npm run dev
```

3. `http://localhost:5173`에서 애플리케이션에 액세스

> **⚡ 성능 참고사항**: 설정 중에 `uv`를 사용했다면 훨씬 빠른 패키지 설치와 종속성 해결의 이점을 얻을 수 있습니다. `uv`는 Rust로 작성된 현대적인 Python 패키지 관리자로 pip보다 10-100배 빠를 수 있습니다.

## 사용법

### 로컬 개발

1. 백엔드 서버 시작 (옵션 선택):

   **옵션 1: 직접 Python 모듈**
   ```bash
   python -m application.py
   ```

   **옵션 2: Uvicorn으로 FastAPI**
   ```bash
   # uvicorn이 설치되지 않은 경우 설치
   # uv 사용 (더 빠름):
   uv pip install uvicorn
   # 또는 pip 사용:
   # pip install uvicorn

   # 핫 리로드로 FastAPI 애플리케이션 실행
   uvicorn application:app --reload --port 8000
   ```

   백엔드는 다음에서 사용 가능합니다:
   - API 엔드포인트: `http://localhost:8000`
   - WebSocket 엔드포인트: `ws://localhost:8000/research/ws/{job_id}`

2. 프론트엔드 개발 서버 시작:
   ```bash
   cd ui
   npm run dev
   ```

3. `http://localhost:5173`에서 애플리케이션에 액세스

### 배포 옵션

애플리케이션은 다양한 클라우드 플랫폼에 배포할 수 있습니다. 몇 가지 일반적인 옵션은 다음과 같습니다:

#### AWS Elastic Beanstalk

1. EB CLI 설치:
   ```bash
   pip install awsebcli
   ```

2. EB 애플리케이션 초기화:
   ```bash
   eb init -p python-3.11 tavily-research
   ```

3. 생성 및 배포:
   ```bash
   eb create tavily-research-prod
   ```

#### 기타 배포 옵션

- **Docker**: 애플리케이션에는 컨테이너화된 배포를 위한 Dockerfile이 포함되어 있습니다
- **Heroku**: Python 빌드팩으로 GitHub에서 직접 배포
- **Google Cloud Run**: 자동 스케일링을 통한 컨테이너화된 배포에 적합

귀하의 요구 사항에 가장 적합한 플랫폼을 선택하세요. 애플리케이션은 플랫폼에 구애받지 않으며 Python 웹 애플리케이션이 지원되는 곳이면 어디든 호스팅할 수 있습니다.

## 기여

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경 사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 감사의 말

- 검색 API를 제공하는 [Tavily](https://tavily.com/)
- 모든 다른 오픈 소스 라이브러리와 그 기여자들
