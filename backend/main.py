from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.interpret_name import interpret_name_router
from api.generate_image import generate_image_router
from api.generate_feedback import generate_feedback_router

app = FastAPI()

# 配置 CORS
origins = [
    "http://localhost:8080",  # 允许来自 http://localhost:8080 的请求
    "http://localhost",       # 允许来自 http://localhost 的请求
    "http://localhost:8000",  # 允许来自 http://localhost:8000 的请求
    "*", # 允许所有域名，生产环境不推荐
    # 添加你的前端域名
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)

# Include routers
app.include_router(interpret_name_router)
app.include_router(generate_image_router)
app.include_router(generate_feedback_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)