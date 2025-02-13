from langchain_core.messages import AIMessage
from typing import Dict, Any
from ...classes import ResearchState, InputState
from .base import BaseResearcher

class NewsScanner(BaseResearcher):
    def __init__(self) -> None:
        super().__init__()

    async def analyze(self, state: ResearchState) -> Dict[str, Any]:
        company = state.get('company', 'Unknown Company')
        msg = f"📰 News Scanner analyzing recent coverage of {company}...\n"
        
        # Generate search queries using LLM
        queries = await self.generate_queries(state, """
        Focus on news aspects such as:
        - Major recent developments
        - Key announcements
        - Notable partnerships or deals
        - Public perception and media coverage
        """)
        
        news_data = {}
        
        # If we have site_scrape data, include it first
        if site_scrape := state.get('site_scrape'):
            msg += "\n📊 Including site scrape data in company analysis..."
            news_data[InputState['company_url']] = {
                'title': InputState['company'],
                'raw_content': site_scrape
            }
        
        # Perform additional research
        try:
            msg += f"\n🔍 Searching for news coverage using {len(queries)} queries..."
            for query in queries:
                search_results = await self.search_documents(query, search_depth="advanced")
                news_data.update(search_results)
            
            msg += f"\n✅ Found {len(news_data)} relevant news articles"
            msg += f"\n🔍 Used queries: \n" + "\n".join(f"  • {q}" for q in queries)
        except Exception as e:
            error_msg = f"⚠️ Error during news research: {str(e)}"
            print(error_msg)
            msg += f"\n{error_msg}"
        
        # Update state with our findings
        messages = state.get('messages', [])
        messages.append(AIMessage(content=msg))
        state['messages'] = messages
        state['news_data'] = news_data
        
        return {
            'message': msg,
            'news_data': news_data
        }

    async def run(self, state: ResearchState) -> Dict[str, Any]:
        return await self.analyze(state) 