from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm import doubao_llm_service
from models.user_models import NameInput
from models.user_models import InterpretNameLLMResponse
from prompts.llm_prompts import get_interpret_name_prompt

interpret_name_router = APIRouter()

@interpret_name_router.post("/api/interpret_name", response_model=InterpretNameLLMResponse)
async def interpret_name(input: NameInput):
    try:
        prompt = get_interpret_name_prompt(input.name)

        messages = [
            {"role": "system", "content": "你是一个根据用户名称拆解为意象组合的助手。"},
            {"role": "user", "content": prompt}
        ]

        result = await doubao_llm_service.generate_response(messages=messages, temperature=1.2, top_p=0.9)
        # 尝试将 LLM 返回的字符串解析为 InterpretNameLLMResponse 对象
        try:
            interpretations = InterpretNameLLMResponse.parse_raw(result)
            return interpretations
        except Exception as e:
            print(f"Error parsing LLM response: {e}")
            raise HTTPException(status_code=500, detail="Failed to parse LLM response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))