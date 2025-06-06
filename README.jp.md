 [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.es.md)
[![jp](https://img.shields.io/badge/lang-jp-orange.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.jp.md)
[![kr](https://img.shields.io/badge/lang-ko-purple.svg)](https://github.com/pogjester/company-research-agent/blob/main/README.kr.md)


# 企業調査エージェント 🔍

![web ui](<static/ui-1.png>)

包括的な企業調査レポートを生成するマルチエージェントツール。このプラットフォームは、AIエージェントのパイプラインを使用して、あらゆる企業に関する情報を収集、整理、統合します。

✨オンラインで試してみてください！ https://companyresearcher.tavily.com ✨

https://github.com/user-attachments/assets/0e373146-26a7-4391-b973-224ded3182a9

## 機能

- **マルチソース調査**：企業ウェブサイト、ニュース記事、財務報告書、業界分析など、様々なソースからデータを取得
- **AIによるコンテンツフィルタリング**：Tavilyの関連性スコアを使用したコンテンツキュレーション
- **リアルタイムストリーミング**：WebSocketを使用して調査の進捗と結果をリアルタイムで配信
- **デュアルモデルアーキテクチャ**：
  - 大規模コンテキスト調査統合のためのGemini 2.0 Flash
  - 精密なレポート書式設定と編集のためのGPT-4.1
- **モダンなReactフロントエンド**：リアルタイム更新、進捗追跡、ダウンロードオプションを備えたレスポンシブインターフェース
- **モジュラーアーキテクチャ**：専門的な調査・処理ノードのパイプラインを中心に構築

## エージェントフレームワーク

### 調査パイプライン

このプラットフォームは、データを順次処理する専門ノードを持つエージェントフレームワークに従います：

1. **調査ノード**：
   - `CompanyAnalyzer`：主要な企業情報を調査
   - `IndustryAnalyzer`：市場ポジションとトレンドを分析
   - `FinancialAnalyst`：財務指標とパフォーマンスデータを取得
   - `NewsScanner`：最新のニュースと動向を収集

2. **処理ノード**：
   - `Collector`：すべてのアナライザーから調査データを集約
   - `Curator`：コンテンツフィルタリングと関連性スコアリングを実装
   - `Briefing`：Gemini 2.0 Flashを使用してカテゴリ別の要約を生成
   - `Editor`：GPT-4.1-miniで要約を最終レポートにコンパイル・書式設定

   ![web ui](<static/agent-flow.png>)

### コンテンツ生成アーキテクチャ

このプラットフォームは最適なパフォーマンスのために異なるモデルを活用します：

1. **Gemini 2.0 Flash** (`briefing.py`)：
   - 大規模コンテキスト調査統合を処理
   - 大量データの処理と要約に優れる
   - カテゴリ別の初期要約生成に使用
   - 複数文書にわたるコンテキスト維持に効率的

2. **GPT-4.1 mini** (`editor.py`)：
   - 精密な書式設定と編集に特化
   - Markdown構造と一貫性を処理
   - 正確な書式設定指示の遵守に優れる
   - 以下に使用：
     - 最終レポートのコンパイル
     - コンテンツの重複除去
     - Markdown書式設定
     - リアルタイムレポートストリーミング

このアプローチは、Geminiの大規模コンテキストウィンドウ処理能力とGPT-4.1-miniの書式設定指示精度を組み合わせます。

### コンテンツキュレーションシステム

このプラットフォームは`curator.py`でコンテンツフィルタリングシステムを使用します：

1. **関連性スコアリング**：
   - 文書はTavilyのAI検索によってスコア付けされます
   - 継続するには最小閾値（デフォルト0.4）が必要
   - スコアは検索クエリとの関連性を反映
   - 高スコアは検索意図とのより良い一致を示す

2. **文書処理**：
   - コンテンツは正規化・クリーニングされます
   - URLは重複除去・標準化されます
   - 文書は関連性スコアでソートされます
   - 進捗更新はWebSocket経由でリアルタイム送信されます

### リアルタイム通信システム

このプラットフォームはWebSocketベースのリアルタイム通信システムを実装します：

![web ui](<static/ui-2.png>)

1. **バックエンド実装**：
   - FastAPIのWebSocketサポートを使用
   - 調査タスクごとに永続的な接続を維持
   - 様々なイベントに対して構造化された更新を送信：
     ```python
     await websocket_manager.send_status_update(
         job_id=job_id,
         status="processing",
         message=f"{category}ブリーフィング生成中",
         result={
             "step": "Briefing",
             "category": category,
             "total_docs": len(docs)
         }
     )
     ```

2. **フロントエンド統合**：
   - ReactコンポーネントがWebSocket更新を購読
   - 更新はリアルタイムで処理・表示されます
   - 異なるUIコンポーネントが特定の更新タイプを処理：
     - クエリ生成進捗
     - 文書キュレーション統計
     - ブリーフィング完了ステータス
     - レポート生成進捗

3. **ステータスタイプ**：
   - `query_generating`：リアルタイムクエリ作成更新
   - `document_kept`：文書キュレーション進捗
   - `briefing_start/complete`：ブリーフィング生成ステータス
   - `report_chunk`：レポート生成ストリーミング
   - `curation_complete`：最終文書統計

## セットアップ

### クイックセットアップ（推奨）

最も簡単な開始方法はセットアップスクリプトを使用することです。このスクリプトは自動的に`uv`を検出し、利用可能な場合はより高速なPythonパッケージインストールに使用します：

1. リポジトリをクローン：
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. セットアップスクリプトを実行可能にして実行：
```bash
chmod +x setup.sh
./setup.sh
```

セットアップスクリプトは以下を行います：

- `uv`を検出してより高速なPythonパッケージインストールに使用（利用可能な場合）
- 必要なPythonとNode.jsのバージョンを確認
- Python仮想環境を作成（推奨）
- すべての依存関係をインストール（PythonとNode.js）
- 環境変数の設定をガイド
- バックエンドとフロントエンドサーバーを起動（オプション）

> **💡 プロのヒント**: [uv](https://github.com/astral-sh/uv)をインストールすることで、Pythonパッケージの大幅に高速なインストールが可能になります：
>
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

以下のAPIキーが必要です：
- Tavily APIキー
- Google Gemini APIキー
- OpenAI APIキー
- Google Maps APIキー
- MongoDB URI（オプション）

### 手動セットアップ

手動でセットアップしたい場合は、以下の手順に従ってください：

1. リポジトリをクローン：
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. バックエンド依存関係をインストール：
```bash
# オプション：仮想環境を作成・アクティベート
# uv使用（より高速 - 利用可能な場合は推奨）：
uv venv .venv
source .venv/bin/activate

# または標準Python：
# python -m venv .venv
# source .venv/bin/activate

# Python依存関係をインストール
# uv使用（より高速）：
uv pip install -r requirements.txt

# またはpip使用：
# pip install -r requirements.txt
```

3. フロントエンド依存関係をインストール：
```bash
cd ui
npm install
```

4. **環境変数の設定**：

このプロジェクトはバックエンドとフロントエンド用に2つの個別の`.env`ファイルが必要です。

**バックエンド設定：**

プロジェクトのルートディレクトリに`.env`ファイルを作成し、バックエンドAPIキーを追加します：

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# オプション：MongoDB永続化を有効化
# MONGODB_URI=your_mongodb_connection_string
```

**フロントエンド設定：**

`ui`ディレクトリ内に`.env`ファイルを作成します。最初にサンプルファイルをコピーできます：

```bash
cp ui/.env.development.example ui/.env
```

次に、`ui/.env`を開いてフロントエンド環境変数を追加します：

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Dockerセットアップ

アプリケーションはDockerとDocker Composeを使用して実行できます：

1. リポジトリをクローン：
```bash
git clone https://github.com/pogjester/tavily-company-research.git
cd tavily-company-research
```

2. **環境変数の設定**：

Docker設定は2つの個別の`.env`ファイルを使用します。

**バックエンド設定：**

プロジェクトのルートディレクトリに`.env`ファイルを作成し、バックエンドAPIキーを追加します：

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# オプション：MongoDB永続化を有効化
# MONGODB_URI=your_mongodb_connection_string
```

**フロントエンド設定：**

`ui`ディレクトリ内に`.env`ファイルを作成します。最初にサンプルファイルをコピーできます：

```bash
cp ui/.env.development.example ui/.env
```

次に、`ui/.env`を開いてフロントエンド環境変数を追加します：

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. コンテナをビルド・起動：
```bash
docker compose up --build
```

これによりバックエンドとフロントエンドサービスが起動します：
- バックエンドAPIは`http://localhost:8000`で利用可能
- フロントエンドは`http://localhost:5174`で利用可能

サービスを停止するには：
```bash
docker compose down
```

注意：`.env`の環境変数を更新する際は、コンテナを再起動する必要があります：
```bash
docker compose down && docker compose up
```

### アプリケーションの実行

1. バックエンドサーバーを起動（オプションを選択）：
```bash
# オプション1：直接Pythonモジュール
python -m application.py

# オプション2：UvicornでFastAPI
uvicorn application:app --reload --port 8000
```

2. 新しいターミナルでフロントエンドを起動：
```bash
cd ui
npm run dev
```

3. `http://localhost:5173`でアプリケーションにアクセス

## 使用方法

### ローカル開発

1. バックエンドサーバーを起動（オプションを選択）：

   **オプション1：直接Pythonモジュール**
   ```bash
   python -m application.py
   ```

   **オプション2：UvicornでFastAPI**
   ```bash
   # uvicornがインストールされていない場合はインストール
   # uv使用（より高速）：
   uv pip install uvicorn
   # またはpip使用：
   # pip install uvicorn

   # ホットリロード付きでFastAPIアプリケーションを実行
   uvicorn application:app --reload --port 8000
   ```

   バックエンドは以下で利用可能：
   - APIエンドポイント：`http://localhost:8000`
   - WebSocketエンドポイント：`ws://localhost:8000/research/ws/{job_id}`

2. フロントエンド開発サーバーを起動：
   ```bash
   cd ui
   npm run dev
   ```

3. `http://localhost:5173`でアプリケーションにアクセス

> **⚡ パフォーマンス注意**: セットアップ時に`uv`を使用した場合、大幅に高速なパッケージインストールと依存関係解決の恩恵を受けられます。`uv`はRustで書かれた現代的なPythonパッケージマネージャーで、pipより10〜100倍高速です。

### デプロイメントオプション

アプリケーションは様々なクラウドプラットフォームにデプロイできます。一般的なオプションをいくつか紹介します：

#### AWS Elastic Beanstalk

1. EB CLIをインストール：
   ```bash
   pip install awsebcli
   ```

2. EBアプリケーションを初期化：
   ```bash
   eb init -p python-3.11 tavily-research
   ```

3. 作成・デプロイ：
   ```bash
   eb create tavily-research-prod
   ```

#### その他のデプロイメントオプション

- **Docker**：アプリケーションにはコンテナ化デプロイメント用のDockerfileが含まれています
- **Heroku**：PythonビルドパックでGitHubから直接デプロイ
- **Google Cloud Run**：自動スケーリング付きコンテナ化デプロイメントに適しています

ニーズに最も適したプラットフォームを選択してください。アプリケーションはプラットフォーム非依存で、Pythonウェブアプリケーションがサポートされているどこでもホストできます。

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add some amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを開く

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 謝辞

- 検索APIを提供する[Tavily](https://tavily.com/)
- その他すべてのオープンソースライブラリとその貢献者
