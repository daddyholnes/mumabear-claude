"""
🏛️ Deep Research Center - Collaborative AI Research System
Combines Claude 3.5 models with Gemini Deep Research for mind-blowing collaborative research
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from enum import Enum
import json
import anthropic
import google.generativeai as genai

logger = logging.getLogger(__name__)

class ResearchMode(Enum):
    CLAUDE_ONLY = "claude_only"
    GEMINI_ONLY = "gemini_only"
    COLLABORATIVE = "collaborative"
    CONSENSUS = "consensus"
    DEBATE = "debate"

class ResearchDepth(Enum):
    QUICK = "quick"  # 5-10 minutes
    STANDARD = "standard"  # 15-30 minutes
    DEEP = "deep"  # 30-60 minutes
    EXHAUSTIVE = "exhaustive"  # 1-2 hours

class DeepResearchCenter:
    """
    🏛️ The Library - A collaborative deep research center
    Where Claude and Gemini work together to produce extraordinary research
    """
    
    def __init__(self, anthropic_api_key: str, gemini_api_key: str):
        # Initialize Claude models
        self.anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
        self.claude_models = {
            "opus": "claude-3-opus-20240229",      # Most capable, best for complex research
            "sonnet": "claude-3-5-sonnet-20241022", # Balanced, great for most research
            "haiku": "claude-3-haiku-20240307"     # Fast, good for quick lookups
        }
        
        # Initialize Gemini with Deep Research
        genai.configure(api_key=gemini_api_key)
        self.gemini_models = {
            "deep_research": "gemini-1.5-pro",  # Has Deep Research capability
            "deep_think": "gemini-2.5-pro",     # Enhanced reasoning
            "fast": "gemini-2.5-flash"          # Quick responses
        }
        
        self.research_sessions = {}
        logger.info("🏛️ Deep Research Center initialized with Claude & Gemini collaboration")
    
    async def conduct_research(self, 
                             query: str,
                             mode: ResearchMode = ResearchMode.COLLABORATIVE,
                             depth: ResearchDepth = ResearchDepth.STANDARD,
                             user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main entry point for conducting research
        """
        
        session_id = f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        logger.info(f"🔬 Starting research session {session_id}: {query}")
        
        session = {
            "id": session_id,
            "query": query,
            "mode": mode,
            "depth": depth,
            "status": "initializing",
            "start_time": datetime.now(),
            "user_context": user_context or {},
            "findings": {},
            "collaboration_log": []
        }
        
        self.research_sessions[session_id] = session
        
        try:
            if mode == ResearchMode.CLAUDE_ONLY:
                result = await self._claude_research(query, depth, session)
            elif mode == ResearchMode.GEMINI_ONLY:
                result = await self._gemini_research(query, depth, session)
            elif mode == ResearchMode.COLLABORATIVE:
                result = await self._collaborative_research(query, depth, session)
            elif mode == ResearchMode.CONSENSUS:
                result = await self._consensus_research(query, depth, session)
            elif mode == ResearchMode.DEBATE:
                result = await self._debate_research(query, depth, session)
            
            session["status"] = "completed"
            session["end_time"] = datetime.now()
            session["duration"] = (session["end_time"] - session["start_time"]).total_seconds()
            
            return {
                "success": True,
                "session_id": session_id,
                "mode": mode.value,
                "depth": depth.value,
                "result": result,
                "metadata": {
                    "duration_seconds": session["duration"],
                    "models_used": self._get_models_used(session),
                    "collaboration_steps": len(session["collaboration_log"])
                }
            }
            
        except Exception as e:
            logger.error(f"Research session {session_id} failed: {e}")
            session["status"] = "failed"
            session["error"] = str(e)
            return {
                "success": False,
                "session_id": session_id,
                "error": str(e)
            }
    
    async def _claude_research(self, query: str, depth: ResearchDepth, session: Dict) -> Dict[str, Any]:
        """Conduct research using only Claude models"""
        
        session["status"] = "researching_with_claude"
        
        # Select Claude model based on depth
        if depth == ResearchDepth.QUICK:
            model = self.claude_models["haiku"]
        elif depth in [ResearchDepth.STANDARD, ResearchDepth.DEEP]:
            model = self.claude_models["sonnet"]
        else:  # EXHAUSTIVE
            model = self.claude_models["opus"]
        
        # Build research prompt
        research_prompt = self._build_claude_research_prompt(query, depth)
        
        # Execute research
        response = await asyncio.to_thread(
            self.anthropic_client.messages.create,
            model=model,
            max_tokens=8192,
            messages=[{"role": "user", "content": research_prompt}]
        )
        
        findings = {
            "model": model,
            "content": response.content[0].text,
            "timestamp": datetime.now().isoformat()
        }
        
        session["findings"]["claude"] = findings
        
        return self._format_research_output(findings, "Claude")
    
    async def _gemini_research(self, query: str, depth: ResearchDepth, session: Dict) -> Dict[str, Any]:
        """Conduct research using Gemini Deep Research"""
        
        session["status"] = "researching_with_gemini"
        
        # Use Gemini Deep Research for thorough research
        if depth in [ResearchDepth.DEEP, ResearchDepth.EXHAUSTIVE]:
            return await self._gemini_deep_research(query, session)
        else:
            return await self._gemini_standard_research(query, depth, session)
    
    async def _gemini_deep_research(self, query: str, session: Dict) -> Dict[str, Any]:
        """Use Gemini's Deep Research feature"""
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Deep Research prompt that triggers multi-step research
        deep_research_prompt = f"""
        Please conduct deep, comprehensive research on the following topic:
        
        {query}
        
        Use your Deep Research capabilities to:
        1. Break down this query into multiple research angles
        2. Explore each angle thoroughly
        3. Synthesize findings from multiple sources
        4. Identify key insights, patterns, and contradictions
        5. Provide a comprehensive report with clear structure
        
        Include:
        - Executive summary
        - Detailed findings organized by theme
        - Key insights and conclusions
        - Areas of uncertainty or debate
        - Recommendations for further research
        
        This is a deep research task - please be thorough and comprehensive.
        """
        
        response = await model.generate_content_async(deep_research_prompt)
        
        findings = {
            "model": "gemini-1.5-pro-deep-research",
            "content": response.text,
            "timestamp": datetime.now().isoformat(),
            "research_type": "deep_research"
        }
        
        session["findings"]["gemini"] = findings
        
        return self._format_research_output(findings, "Gemini Deep Research")
    
    async def _collaborative_research(self, query: str, depth: ResearchDepth, session: Dict) -> Dict[str, Any]:
        """
        The magic happens here - Claude and Gemini research together
        """
        
        session["status"] = "collaborative_research"
        collaboration_log = session["collaboration_log"]
        
        # Phase 1: Initial Independent Research
        collaboration_log.append({
            "phase": "independent_research",
            "timestamp": datetime.now().isoformat(),
            "description": "Claude and Gemini conducting independent research"
        })
        
        # Both conduct independent research in parallel
        claude_task = self._claude_research(query, depth, session)
        gemini_task = self._gemini_research(query, depth, session)
        
        claude_result, gemini_result = await asyncio.gather(claude_task, gemini_task)
        
        # Phase 2: Share Findings
        collaboration_log.append({
            "phase": "sharing_findings",
            "timestamp": datetime.now().isoformat(),
            "description": "Models sharing their research findings"
        })
        
        # Have Claude review Gemini's findings
        claude_review = await self._claude_reviews_gemini(
            query, 
            session["findings"]["gemini"]["content"],
            session["findings"]["claude"]["content"]
        )
        
        # Have Gemini review Claude's findings
        gemini_review = await self._gemini_reviews_claude(
            query,
            session["findings"]["claude"]["content"],
            session["findings"]["gemini"]["content"]
        )
        
        # Phase 3: Synthesis
        collaboration_log.append({
            "phase": "synthesis",
            "timestamp": datetime.now().isoformat(),
            "description": "Creating unified synthesis of all findings"
        })
        
        # Create final synthesis
        synthesis = await self._create_collaborative_synthesis(
            query,
            claude_result,
            gemini_result,
            claude_review,
            gemini_review
        )
        
        return {
            "research_mode": "collaborative",
            "independent_findings": {
                "claude": claude_result,
                "gemini": gemini_result
            },
            "cross_reviews": {
                "claude_on_gemini": claude_review,
                "gemini_on_claude": gemini_review
            },
            "collaborative_synthesis": synthesis,
            "collaboration_process": collaboration_log
        }
    
    async def _consensus_research(self, query: str, depth: ResearchDepth, session: Dict) -> Dict[str, Any]:
        """
        Both AIs research independently, then work together to find consensus
        """
        
        # Similar to collaborative but focuses on agreement
        session["status"] = "consensus_building"
        
        # Get independent research
        claude_result = await self._claude_research(query, depth, session)
        gemini_result = await self._gemini_research(query, depth, session)
        
        # Find points of agreement and disagreement
        consensus_analysis = await self._analyze_consensus(
            query,
            session["findings"]["claude"]["content"],
            session["findings"]["gemini"]["content"]
        )
        
        # Build consensus report
        consensus_report = await self._build_consensus_report(
            query,
            consensus_analysis
        )
        
        return {
            "research_mode": "consensus",
            "independent_findings": {
                "claude": claude_result,
                "gemini": gemini_result
            },
            "consensus_analysis": consensus_analysis,
            "consensus_report": consensus_report
        }
    
    async def _debate_research(self, query: str, depth: ResearchDepth, session: Dict) -> Dict[str, Any]:
        """
        AIs engage in scholarly debate to explore different perspectives
        """
        
        session["status"] = "debate_mode"
        debate_rounds = []
        
        # Initial positions
        claude_position = await self._get_claude_position(query)
        gemini_position = await self._get_gemini_position(query)
        
        debate_rounds.append({
            "round": 1,
            "type": "opening_statements",
            "claude": claude_position,
            "gemini": gemini_position
        })
        
        # Conduct debate rounds
        for round_num in range(2, 4):  # 2-3 rounds of debate
            claude_response = await self._claude_debate_response(
                query, gemini_position, debate_rounds
            )
            gemini_response = await self._gemini_debate_response(
                query, claude_position, debate_rounds
            )
            
            debate_rounds.append({
                "round": round_num,
                "type": "rebuttal_and_elaboration",
                "claude": claude_response,
                "gemini": gemini_response
            })
            
            claude_position = claude_response
            gemini_position = gemini_response
        
        # Final synthesis of the debate
        debate_synthesis = await self._synthesize_debate(query, debate_rounds)
        
        return {
            "research_mode": "debate",
            "debate_rounds": debate_rounds,
            "synthesis": debate_synthesis,
            "key_insights": self._extract_debate_insights(debate_rounds)
        }
    
    async def _claude_reviews_gemini(self, query: str, gemini_findings: str, 
                                   own_findings: str) -> Dict[str, Any]:
        """Claude reviews Gemini's research findings"""
        
        prompt = f"""
        As a research collaborator, please review the following research findings from Gemini
        on the topic: "{query}"
        
        GEMINI'S FINDINGS:
        {gemini_findings}
        
        YOUR OWN FINDINGS (for reference):
        {own_findings}
        
        Please provide:
        1. What Gemini discovered that you might have missed
        2. Areas where you agree strongly
        3. Areas where you have different perspectives
        4. How Gemini's findings complement or enhance your own
        5. Suggestions for further collaborative exploration
        
        Be constructive and collaborative in your review.
        """
        
        response = await asyncio.to_thread(
            self.anthropic_client.messages.create,
            model=self.claude_models["sonnet"],
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return {
            "reviewer": "Claude",
            "review": response.content[0].text,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _gemini_reviews_claude(self, query: str, claude_findings: str,
                                   own_findings: str) -> Dict[str, Any]:
        """Gemini reviews Claude's research findings"""
        
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        prompt = f"""
        As a research collaborator, please review the following research findings from Claude
        on the topic: "{query}"
        
        CLAUDE'S FINDINGS:
        {claude_findings}
        
        YOUR OWN FINDINGS (for reference):
        {own_findings}
        
        Please provide:
        1. What Claude discovered that you might have missed
        2. Areas where you agree strongly
        3. Areas where you have different perspectives
        4. How Claude's findings complement or enhance your own
        5. Suggestions for further collaborative exploration
        
        Be constructive and collaborative in your review.
        """
        
        response = await model.generate_content_async(prompt)
        
        return {
            "reviewer": "Gemini",
            "review": response.text,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _create_collaborative_synthesis(self, query: str, claude_result: Dict,
                                            gemini_result: Dict, claude_review: Dict,
                                            gemini_review: Dict) -> Dict[str, Any]:
        """Create a unified synthesis of all research findings"""
        
        # Use Claude Opus for the final synthesis (it's excellent at this)
        synthesis_prompt = f"""
        Please create a comprehensive synthesis of collaborative research on: "{query}"
        
        You have access to:
        1. Claude's independent research findings
        2. Gemini's independent research findings
        3. Claude's review of Gemini's work
        4. Gemini's review of Claude's work
        
        RESEARCH MATERIALS:
        
        Claude's Research:
        {claude_result}
        
        Gemini's Research:
        {gemini_result}
        
        Claude's Review of Gemini:
        {claude_review['review']}
        
        Gemini's Review of Claude:
        {gemini_review['review']}
        
        Please create a unified synthesis that:
        1. Integrates the best insights from both research efforts
        2. Highlights areas of agreement and consensus
        3. Explores areas of disagreement constructively
        4. Provides a comprehensive answer that leverages both perspectives
        5. Identifies areas for future research
        6. Concludes with actionable insights
        
        Make this a truly collaborative output that is better than either could produce alone.
        """
        
        response = await asyncio.to_thread(
            self.anthropic_client.messages.create,
            model=self.claude_models["opus"],
            max_tokens=8192,
            messages=[{"role": "user", "content": synthesis_prompt}]
        )
        
        return {
            "synthesis": response.content[0].text,
            "created_by": "Claude Opus (Master Synthesizer)",
            "timestamp": datetime.now().isoformat(),
            "synthesis_type": "collaborative_integration"
        }
    
    # Helper methods
    
    def _build_claude_research_prompt(self, query: str, depth: ResearchDepth) -> str:
        """Build research prompt for Claude"""
        
        depth_instructions = {
            ResearchDepth.QUICK: "Provide a concise but informative overview (5-10 minutes of research)",
            ResearchDepth.STANDARD: "Conduct thorough research with moderate depth (15-30 minutes)",
            ResearchDepth.DEEP: "Perform deep, comprehensive research (30-60 minutes)",
            ResearchDepth.EXHAUSTIVE: "Conduct exhaustive research leaving no stone unturned (1-2 hours)"
        }
        
        return f"""
        Please conduct {depth.value} research on the following topic:
        
        {query}
        
        {depth_instructions[depth]}
        
        Structure your research to include:
        1. Executive Summary
        2. Background and Context
        3. Key Findings (organized by theme)
        4. Analysis and Insights
        5. Implications and Applications
        6. Areas of Uncertainty
        7. Recommendations for Further Research
        
        Be thorough, accurate, and provide a balanced perspective.
        """
    
    def _format_research_output(self, findings: Dict, source: str) -> Dict[str, Any]:
        """Format research output consistently"""
        
        return {
            "source": source,
            "content": findings["content"],
            "metadata": {
                "model": findings["model"],
                "timestamp": findings["timestamp"],
                "research_type": findings.get("research_type", "standard")
            }
        }
    
    def _get_models_used(self, session: Dict) -> List[str]:
        """Get list of all models used in session"""
        
        models = []
        for source, findings in session["findings"].items():
            if "model" in findings:
                models.append(findings["model"])
        return list(set(models))
    
    async def _analyze_consensus(self, query: str, claude_findings: str, 
                               gemini_findings: str) -> Dict[str, Any]:
        """Analyze areas of consensus and disagreement"""
        
        # Use Gemini for this analysis
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        prompt = f"""
        Analyze the following two independent research reports on "{query}" 
        to identify areas of consensus and disagreement:
        
        CLAUDE'S FINDINGS:
        {claude_findings}
        
        GEMINI'S FINDINGS:
        {gemini_findings}
        
        Please provide:
        1. Points of Strong Agreement (with evidence from both)
        2. Points of Partial Agreement (similar but with nuances)
        3. Points of Disagreement (conflicting perspectives)
        4. Unique Insights from Each (not mentioned by the other)
        5. Overall Assessment of Consensus Level (percentage)
        
        Be objective and thorough in your analysis.
        """
        
        response = await model.generate_content_async(prompt)
        
        return {
            "analysis": response.text,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _build_consensus_report(self, query: str, consensus_analysis: Dict) -> Dict[str, Any]:
        """Build final consensus report"""
        
        # Use Claude for final consensus building
        prompt = f"""
        Based on the consensus analysis below, create a unified research report on "{query}"
        that emphasizes areas of agreement while acknowledging different perspectives:
        
        CONSENSUS ANALYSIS:
        {consensus_analysis['analysis']}
        
        Create a report that:
        1. Leads with the strongest consensus findings
        2. Integrates different perspectives constructively
        3. Clearly marks areas of uncertainty or debate
        4. Provides a balanced, comprehensive view
        5. Concludes with high-confidence insights
        
        The goal is a report that represents the best collective understanding.
        """
        
        response = await asyncio.to_thread(
            self.anthropic_client.messages.create,
            model=self.claude_models["opus"],
            max_tokens=8192,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return {
            "report": response.content[0].text,
            "consensus_level": "high",  # Could be calculated from analysis
            "timestamp": datetime.now().isoformat()
        }
    
    # Additional methods for debate mode
    
    async def _get_claude_position(self, query: str) -> str:
        """Get Claude's initial position on the research topic"""
        
        prompt = f"""
        Take a scholarly position on the following research topic: "{query}"
        
        Present your perspective with:
        1. A clear thesis statement
        2. Supporting evidence and reasoning
        3. Acknowledgment of complexity
        4. Openness to other viewpoints
        
        This is the opening of a scholarly debate, so be thoughtful but clear in your position.
        """
        
        response = await asyncio.to_thread(
            self.anthropic_client.messages.create,
            model=self.claude_models["sonnet"],
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    async def _get_gemini_position(self, query: str) -> str:
        """Get Gemini's initial position on the research topic"""
        
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        prompt = f"""
        Take a scholarly position on the following research topic: "{query}"
        
        Present your perspective with:
        1. A clear thesis statement
        2. Supporting evidence and reasoning
        3. Acknowledgment of complexity
        4. Openness to other viewpoints
        
        This is the opening of a scholarly debate, so be thoughtful but clear in your position.
        """
        
        response = await model.generate_content_async(prompt)
        return response.text
    
    def _extract_debate_insights(self, debate_rounds: List[Dict]) -> List[str]:
        """Extract key insights from the debate"""
        
        insights = []
        
        # This would analyze the debate rounds to extract key insights
        # For now, returning placeholder
        insights.append("Multiple valid perspectives exist on this topic")
        insights.append("The debate revealed nuanced considerations")
        insights.append("Both positions have merit in different contexts")
        
        return insights
    
    async def get_research_status(self, session_id: str) -> Dict[str, Any]:
        """Get status of ongoing research session"""
        
        if session_id not in self.research_sessions:
            return {"error": "Session not found"}
        
        session = self.research_sessions[session_id]
        
        return {
            "session_id": session_id,
            "status": session["status"],
            "mode": session["mode"].value,
            "depth": session["depth"].value,
            "start_time": session["start_time"].isoformat(),
            "duration": (datetime.now() - session["start_time"]).total_seconds()
        }


# Integration with existing system

class LibrarySection:
    """
    🏛️ The Library - Deep Research Center Integration
    """
    
    def __init__(self, anthropic_api_key: str, gemini_api_key: str):
        self.research_center = DeepResearchCenter(anthropic_api_key, gemini_api_key)
        self.research_history = []
        logger.info("🏛️ Library Section initialized")
    
    async def research(self, query: str, mode: str = "collaborative", 
                      depth: str = "standard", user_id: str = None) -> Dict[str, Any]:
        """
        Main API endpoint for research requests
        """
        
        # Convert string parameters to enums
        research_mode = ResearchMode(mode)
        research_depth = ResearchDepth(depth)
        
        # Add user context
        user_context = {
            "user_id": user_id,
            "request_time": datetime.now().isoformat(),
            "preferred_format": "comprehensive"
        }
        
        # Conduct research
        result = await self.research_center.conduct_research(
            query=query,
            mode=research_mode,
            depth=research_depth,
            user_context=user_context
        )
        
        # Store in history
        self.research_history.append({
            "query": query,
            "mode": mode,
            "depth": depth,
            "result": result,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        })
        
        return result
    
    def get_available_modes(self) -> List[Dict[str, str]]:
        """Get available research modes with descriptions"""
        
        return [
            {
                "mode": "claude_only",
                "name": "Claude Research",
                "description": "Use Claude 3.5 models for research (like Perplexity)"
            },
            {
                "mode": "gemini_only",
                "name": "Gemini Deep Research",
                "description": "Use Gemini's Deep Research for comprehensive analysis"
            },
            {
                "mode": "collaborative",
                "name": "Collaborative Research",
                "description": "Claude and Gemini research together, sharing findings"
            },
            {
                "mode": "consensus",
                "name": "Consensus Building",
                "description": "Both research independently, then find consensus"
            },
            {
                "mode": "debate",
                "name": "Scholarly Debate",
                "description": "AIs debate different perspectives for deeper insights"
            }
        ]
    
    def get_depth_options(self) -> List[Dict[str, str]]:
        """Get available research depth options"""
        
        return [
            {
                "depth": "quick",
                "name": "Quick Research",
                "description": "5-10 minutes - Quick overview and key points"
            },
            {
                "depth": "standard",
                "name": "Standard Research",
                "description": "15-30 minutes - Thorough research with good depth"
            },
            {
                "depth": "deep",
                "name": "Deep Research",
                "description": "30-60 minutes - Comprehensive analysis"
            },
            {
                "depth": "exhaustive",
                "name": "Exhaustive Research",
                "description": "1-2 hours - Leave no stone unturned"
            }
        ]