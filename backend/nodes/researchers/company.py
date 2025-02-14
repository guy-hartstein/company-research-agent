from langchain_core.messages import AIMessage
from typing import Dict, Any

from ...classes import ResearchState
from .base import BaseResearcher

class CompanyAnalyzer(BaseResearcher):
    def __init__(self) -> None:
        super().__init__()

    async def analyze(self, state: ResearchState) -> Dict[str, Any]:
        company = state.get('company', 'Unknown Company')
        msg = f"🏢 Company Analyzer researching {company}'s core business...\n"
        
        # Generate search queries using LLM
        queries = await self.generate_queries(state, """
        Focus on company fundamentals such as:
        - Core products and services
        - Company history and milestones
        - Leadership and management team
        - Business model and strategy
        - Technology and innovation
        - Mission and vision statements
        - Recent innovations and R&D
        - Customer base and target market
        - Geographic presence and expansion
        
        Cover both historical context and current operations.
        """)
        
        company_data = {}
        
        # If we have site_scrape data and company_url, analyze it first
        if site_scrape := state.get('site_scrape'):
            if company_url := state.get('company_url'):
                msg += "\n📊 Including site scrape data in company analysis..."
                company_data[company_url] = {
                    'title': company,
                    'raw_content': site_scrape,
                    'source': 'company_website',
                    'query': 'Company website content'  # Add query for site scrape
                }
            else:
                msg += "\n⚠️ Site scrape data available but no company URL provided"
        
        # Perform additional research with comprehensive search
        try:
            msg += f"\n🔍 Searching for company information using {len(queries)} queries..."
            # Store documents with their respective queries
            for query in queries:
                documents = await self.search_documents([query], search_depth="advanced")
                if documents:  # Only process if we got results
                    for url, doc in documents.items():
                        doc['query'] = query  # Associate each document with its query
                        company_data[url] = doc
            
            msg += f"\n✅ Found {len(company_data)} relevant company documents"
            msg += f"\n🔍 Used queries: \n" + "\n".join(f"  • {q}" for q in queries)
        except Exception as e:
            error_msg = f"⚠️ Error during company research: {str(e)}"
            print(error_msg)
            msg += f"\n{error_msg}"
        
        # Update state with our findings
        messages = state.get('messages', [])
        messages.append(AIMessage(content=msg))
        state['messages'] = messages
        state['company_data'] = company_data
        
        return {
            'message': msg,
            'company_data': company_data
        }

    async def run(self, state: ResearchState) -> Dict[str, Any]:
        return await self.analyze(state) 