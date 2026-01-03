import os
from typing import Dict, Any, Optional
from tavily import TavilyClient

class DeepResearchAgent:
    def __init__(self, tavily_api_key: Optional[str] = None, **kwargs):
        """
        Initialize the DeepResearchAgent with Tavily API key.
        The **kwargs argument allows for passing other keys (like groq_api_key) 
        without breaking compatibility, even if they aren't used here.
        """
        self.tavily_key = tavily_api_key or os.getenv("TAVILY_API_KEY")
        
        if self.tavily_key:
            self.tavily_client = TavilyClient(api_key=self.tavily_key)
        else:
            self.tavily_client = None

    def run_deep_search(self, name: str, context: str = "", max_iterations: int = 3, status_callback=None) -> Dict[str, Any]:
        """
        Executes the 'Deep Diver' research logic:
        1. Initial Search: LinkedIn, GitHub, Twitter.
        2. Gap Analysis: Check for Developer context & missing GitHub.
        3. Content Aggregation.
        """
        if not self.tavily_client:
            raise ValueError("Tavily API key is required for Deep Research.")

        all_text = []
        all_sources = []
        seen_urls = set()

        # Helper to perform a search and accumulate results
        def perform_search(query, step_desc):
            if status_callback:
                status_callback(f"{step_desc}: '{query}'")
            
            try:
                response = self.tavily_client.search(
                    query=query, 
                    search_depth="advanced", 
                    include_raw_content=True,
                    max_results=3
                )
                
                res_count = 0
                if response and 'results' in response:
                    res_count = len(response['results'])
                    for result in response['results']:
                        url = result.get('url')
                        if url not in seen_urls:
                            seen_urls.add(url)
                            all_sources.append(url)
                            content = result.get('raw_content') or result.get('content', '')
                            # Limiting content per source to avoid exploding context too much
                            if len(content) > 10000: 
                                content = content[:10000] + "...(truncated)"
                            all_text.append(f"\n--- Source: {url} ---\n{content}")
                
                print(f"DEBUG: Tavily search for '{query}' returned {res_count} results.")
            except Exception as e:
                print(f"ERROR: Search Error for '{query}': {e}")

        # 1. Initial Searches
        queries = [
            f"{name} {context} linkedin",
            f"{name} github",
            f"{name} twitter"
        ]
        
        for q in queries:
            perform_search(q, "Searching")

        # 2. Gap Analysis
        # Check if we found a github url
        found_github = any("github.com" in url for url in seen_urls)
        
        # Check if context implies developer
        is_developer_context = any(kw in context.lower() for kw in ["developer", "engineer", "coder", "programmer", "software", "tech", "ai", "data"])
        
        if is_developer_context and not found_github:
            perform_search(f"{name} personal website portfolio", "Gap Analysis Triggered (Developer)")

        # 3. Content Aggregation
        massive_text = "\n".join(all_text)
        
        return {
            "text": massive_text,
            "sources": all_sources
        }
