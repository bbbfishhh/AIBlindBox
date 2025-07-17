from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm import doubao_llm_service
from models.user_models import FeedbackInput, FeedbackResponse
from typing import List, Dict
from prompts.llm_prompts import get_feedback_prompt

generate_feedback_router = APIRouter()

@generate_feedback_router.post("/api/generate_feedback", response_model=FeedbackResponse)
async def generate_feedback(input: FeedbackInput):
    try:
        prompt = get_feedback_prompt(input.imagery1, input.imagery2)

        messages = [
            {"role": "system", "content": "你是一位精通命理、文化、风水和积极心理学的专家，能够根据用户选择的意象组合生成充满情绪价值的赞美和反馈。"},
            {"role": "user", "content": prompt}
        ]
        result = await doubao_llm_service.generate_response(messages=messages, temperature=1.2, top_p=0.9)
        return FeedbackResponse(feedback=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))