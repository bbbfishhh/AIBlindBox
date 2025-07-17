import httpx
from typing import List, Optional, Dict, Any
from config import Config

class DoubaoLLMService:
    def __init__(self):
        self.api_key = Config.DOUBAO_SEEDREAM_API_KEY
        self.endpoint = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
        self.model_name = "doubao-seed-1-6-flash-250615"
        self.client = httpx.AsyncClient()

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7, # 可选的温度参数
        top_p: float = 0.9, # 可选的 Top P 参数
    ) -> str:
        """
        调用豆包LLM API生成对话回复。

        Args:
            messages (List[Dict[str, str]]): 对话消息列表，包含 "role" (system, user, assistant) 和 "content"。
            temperature (float): 控制生成文本的随机性，值越高越随机。
            top_p (float): 控制生成文本的多样性，值越高越多样。

        Returns:
            str: 生成的文本回复。

        Raises:
            Exception: 如果API调用失败或返回错误消息。
        """

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
            "top_p": top_p,
        }

        print(f"Calling Doubao LLM with payload: {payload}") # For debugging

        try:
            response = await self.client.post(self.endpoint, headers=headers, json=payload, timeout=60)
            response.raise_for_status()

            response_data = response.json()
            print(f"Doubao LLM response: {response_data}") # For debugging

            if response_data.get("error"):
                error_message = response_data["error"]
                print(f"Doubao LLM API returned error: {error_message}")
                raise Exception(f"Doubao LLM API error: {error_message}")

            # 提取生成的文本回复
            if "choices" in response_data and len(response_data["choices"]) > 0:
                return response_data["choices"][0]["message"]["content"]
            else:
                raise Exception("No response received from Doubao LLM API")

        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            error_details = e.response.text
            print(f"Doubao LLM HTTP error {status_code}: {error_details}")
            raise Exception(f"Doubao LLM API request failed: {status_code} - {error_details}")
        except httpx.RequestError as e:
            print(f"Doubao LLM request error: {e}")
            raise Exception(f"Network or request error, unable to connect to Doubao LLM service: {e}")
        except Exception as e:
            print(f"An unexpected error occurred during Doubao LLM call: {e}")
            raise Exception(f"LLM service internal error: {e}")

# 实例化服务
doubao_llm_service = DoubaoLLMService()