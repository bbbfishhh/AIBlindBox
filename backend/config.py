import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEEPSEEK_V3_API_KEY = os.getenv("DEEPSEEK_V3_API_KEY")
    DEEPSEEK_V3_ENDPOINT = os.getenv("DEEPSEEK_V3_ENDPOINT")
    DOUBAO_SEEDREAM_API_KEY = os.getenv("DOUBAO_SEEDREAM_API_KEY")
    DOUBAO_SEEDREAM_ENDPOINT = os.getenv("DOUBAO_SEEDREAM_ENDPOINT")