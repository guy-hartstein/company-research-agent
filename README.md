 [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.es.md)
[![jp](https://img.shields.io/badge/lang-jp-orange.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.jp.md)
[![kr](https://img.shields.io/badge/lang-ko-purple.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.kr.md)


# Agentic Company Researcher 🔍

![web ui](<static/ui-1.png>)

A multi-agent tool that generates comprehensive company research reports. The platform uses a pipeline of AI agents to gather, curate, and synthesize information about any company.

✨Check it out online! https://companyresearcher.tavily.com ✨

https://github.com/user-attachments/assets/0e373146-26a7-4391-b973-224ded3182a9

## Features

- **Multi-Source Research**: Gathers data from various sources, including company websites, news articles, financial reports, and industry analyses
- **AI-Powered Content Filtering**: Uses Tavily's relevance scoring for content curation
- **Asynchronous Processing**: Efficient polling-based architecture for tracking research progress
- **Dual Model Architecture**:
  - Gemini 2.5 Flash for high-context research synthesis
  - GPT-5.1 for precise report formatting and editing
- **Modern React Frontend**: Responsive UI with progress tracking and download options
- **Modular Architecture**: Built using a pipeline of specialized research and processing nodes

## Agent Framework

### Research Pipeline

The platform follows an agentic framework with specialized nodes that process data sequentially:

1. **Research Nodes**:
   - `CompanyAnalyzer`: Researches core business information
   - `IndustryAnalyzer`: Analyzes market position and trends
   - `FinancialAnalyst`: Gathers financial metrics and performance data
   - `NewsScanner`: Collects recent news and developments

2. **Processing Nodes**:
   - `Collector`: Aggregates research data from all analyzers
   - `Curator`: Implements content filtering and relevance scoring
   - `Briefing`: Generates category-specific summaries using Gemini 2.5 Flash
   - `Editor`: Compiles and formats the briefings into a final report using GPT-5.1

   ![web ui](<static/agent-flow.png>)

### Content Generation Architecture

The platform leverages separate models for optimal performance:

1. **Gemini 2.5 Flash** (`briefing.py`):
   - Handles high-context research synthesis tasks
   - Excels at processing and summarizing large volumes of data
   - Used for generating initial category briefings
   - Efficient at maintaining context across multiple documents

2. **GPT-5.1** (`editor.py`):
   - Specializes in precise formatting and editing tasks
   - Handles markdown structure and consistency
   - Superior at following exact formatting instructions
   - Used for:
     - Final report compilation
     - Content deduplication
     - Markdown formatting
     - Real-time report streaming

This approach combines Gemini's strength in handling large context windows with GPT-5.1's precision in following specific formatting instructions.

### Content Curation System

The platform uses a content filtering system in `curator.py`:

1. **Relevance Scoring**:
   - Documents are scored by Tavily's AI-powered search
   - A minimum threshold (default 0.4) is required to proceed
   - Scores reflect relevance to the specific research query
   - Higher scores indicate better matches to the research intent

2. **Document Processing**:
   - Content is normalized and cleaned
   - URLs are deduplicated and standardized
   - Documents are sorted by relevance scores
   - Research runs asynchronously in the background

### Backend Architecture

The platform implements a simple polling-based communication system:

![web ui](<static/ui-2.png>)

1. **Backend Implementation**:
   - Uses FastAPI with async support
   - Research tasks run in background
   - Results are stored and accessed via REST endpoints
   - Simple job status tracking
   
2. **Frontend Integration**:
   - React frontend submits research requests
   - Receives job_id for tracking
   - Polls `/research/{job_id}/report` endpoint
   - Displays final report when complete

3. **API Endpoints**:
   - `POST /research`: Submit new research request
   - `GET /research/{job_id}/report`: Poll for completed report
   - `POST /generate-pdf`: Generate PDF from report content

## Setup

### Quick Setup (Recommended)

The easiest way to get started is using the setup script, which automatically detects and uses `uv` for faster Python package installation when available:

1. Clone the repository:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Make the setup script executable and run it:
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:

- Detect and use `uv` for faster Python package installation (if available)
- Check for required Python and Node.js versions
- Optionally create a Python virtual environment (recommended)
- Install all dependencies (Python and Node.js)
- Guide you through setting up your environment variables
- Optionally start both backend and frontend servers

> **💡 Pro Tip**: Install [uv](https://github.com/astral-sh/uv) for significantly faster Python package installation:
>
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

You'll need the following API keys ready:
- Tavily API Key
- Google Gemini API Key
- OpenAI API Key
- Google Maps API Key
- MongoDB URI (optional)

### Manual Setup

If you prefer to set up manually, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Install backend dependencies:
```bash
# Optional: Create and activate virtual environment
# With uv (faster - recommended if available):
uv venv .venv
source .venv/bin/activate

# Or with standard Python:
# python -m venv .venv
# source .venv/bin/activate

# Install Python dependencies
# With uv (faster):
uv pip install -r requirements.txt

# Or with pip:
# pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ui
npm install
```

4. **Set up Environment Variables**:

This project requires two separate `.env` files for the backend and frontend.

**For the Backend:**

Create a `.env` file in the project's root directory and add your backend API keys:

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Optional: Enable MongoDB persistence
# MONGODB_URI=your_mongodb_connection_string
```

**For the Frontend:**

Create a `.env` file inside the `ui` directory. You can copy the example file first:

```bash
cp ui/.env.development.example ui/.env
```

Then, open `ui/.env` and add your frontend environment variables:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Docker Setup

The application can be run using Docker and Docker Compose:

1. Clone the repository:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. **Set up Environment Variables**:

The Docker setup uses two separate `.env` files.

**For the Backend:**

Create a `.env` file in the project's root directory with your backend API keys:

```env
TAVILY_API_KEY=your_tavily_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Optional: Enable MongoDB persistence
# MONGODB_URI=your_mongodb_connection_string
```

**For the Frontend:**

Create a `.env` file inside the `ui` directory. You can copy the example file first:

```bash
cp ui/.env.development.example ui/.env
```

Then, open `ui/.env` and add your frontend environment variables:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Build and start the containers:
```bash
docker compose up --build
```

This will start both the backend and frontend services:
- Backend API will be available at `http://localhost:8000`
- Frontend will be available at `http://localhost:5174`

To stop the services:
```bash
docker compose down
```

Note: When updating environment variables in `.env`, you'll need to restart the containers:
```bash
docker compose down && docker compose up
```

### Running the Application

1. Start the backend server (choose one):
```bash
# Option 1: Direct Python Module
python -m application.py

# Option 2: FastAPI with Uvicorn
uvicorn application:app --reload --port 8000
```

2. In a new terminal, start the frontend:
```bash
cd ui
npm run dev
```

3. Access the application at `http://localhost:5173`

## Usage

### Local Development

1. Start the backend server (choose one option):

   **Option 1: Direct Python Module**
   ```bash
   python -m application.py
   ```

   **Option 2: FastAPI with Uvicorn**
   ```bash
   # Install uvicorn if not already installed
   # With uv (faster):
   uv pip install uvicorn
   # Or with pip:
   # pip install uvicorn

   # Run the FastAPI application with hot reload
   uvicorn application:app --reload --port 8000
   ```

   The backend will be available at:
   - API Endpoint: `http://localhost:8000`

2. Start the frontend development server:
   ```bash
   cd ui
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

> **⚡ Performance Note**: If you used `uv` during setup, you'll benefit from significantly faster package installation and dependency resolution. `uv` is a modern Python package manager written in Rust that can be 10-100x faster than pip.

### Deployment Options

The application can be deployed to various cloud platforms. Here are some common options:

#### AWS Elastic Beanstalk

1. Install the EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize EB application:
   ```bash
   eb init -p python-3.11 tavily-research
   ```

3. Create and deploy:
   ```bash
   eb create tavily-research-prod
   ```

#### Other Deployment Options

- **Docker**: The application includes a Dockerfile for containerized deployment
- **Heroku**: Deploy directly from GitHub with the Python buildpack
- **Google Cloud Run**: Suitable for containerized deployment with automatic scaling

Choose the platform that best suits your needs. The application is platform-agnostic and can be hosted anywhere that supports Python web applications.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tavily](https://tavily.com/) for the research API
- All other open-source libraries and their contributors

## FAQ

### General

**What is the Company Research Agent?**
It's a multi-agent tool that generates comprehensive company research reports. The platform uses a pipeline of AI agents to gather, curate, and synthesize information about any company from multiple sources including websites, news articles, financial reports, and industry analyses.

**How does it work?**
The platform follows an agentic framework with specialized research nodes (CompanyAnalyzer, IndustryAnalyzer, FinancialAnalyst, NewsScanner) that process data sequentially, followed by processing nodes (Collector, Curator, Briefing, Editor) that aggregate, filter, and format the final report.

**Is there a hosted version?**
Yes, check it out online at https://companyresearcher.tavily.com

### Setup & Configuration

**How do I install the Company Research Agent?**
Clone the repository and install dependencies: `pip install -r requirements.txt`. You'll need Python 3.10+ and API keys for Tavily (research), Gemini 2.5 Flash (briefing), and GPT-5.1 (editing).

**What API keys are required?**
You need three API keys:
- **Tavily API**: For web search and content retrieval
- **Google Gemini API**: For high-context research synthesis (briefing generation)
- **OpenAI API**: For precise report formatting and editing

**How do I configure the API keys?**
Create a `.env` file in the project root with your API keys:
```
TAVILY_API_KEY=your_tavily_key
GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### Agent Architecture

**What models are used and why?**
The platform uses a dual model architecture:
- **Gemini 2.5 Flash**: Handles high-context research synthesis tasks, excels at processing large volumes of data and maintaining context across multiple documents
- **GPT-5.1**: Handles precise report formatting and editing, produces polished final reports

**Can I use different models?**
Yes, the modular architecture allows swapping models. The briefing node uses Gemini for context-heavy tasks, and the editor node uses GPT for formatting. You can modify `briefing.py` and `editor.py` to use alternative models.

**How many agents run in parallel?**
The four research nodes (CompanyAnalyzer, IndustryAnalyzer, FinancialAnalyst, NewsScanner) run asynchronously and in parallel, making the research phase efficient.

### Usage

**How long does a research report take?**
Research time depends on company complexity and data availability. Typical reports take 2-5 minutes, as the four research agents run in parallel.

**What information is included in a report?**
Reports include core business information, market position and trends, financial metrics and performance data, and recent news and developments — all synthesized into a comprehensive briefing.

**Can I customize the report format?**
Yes, the Editor node (GPT-5.1) compiles and formats briefings into the final report. You can modify the prompt templates in `editor.py` to customize the output format.

### Troubleshooting

**Research returns empty or incomplete results**
Verify your Tavily API key is valid and has sufficient quota. Check your internet connection. Some companies with limited online presence may have less data available.

**Gemini API errors during briefing**
Ensure your Google API key is valid and has Gemini 2.5 Flash enabled. Check that you haven't hit rate limits. Large research contexts may require higher quota tiers.

**GPT-5.1 editing fails**
Verify your OpenAI API key is valid and has access to GPT-5.1 models. Check rate limits and billing status. If GPT-5.1 is unavailable, you can modify `editor.py` to use an alternative model.

**Need more help?**
- Open an issue on GitHub for bug reports or feature requests
- Check the online version at https://companyresearcher.tavily.com for a quick trial
